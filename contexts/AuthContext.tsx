"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>; // Refresh user data from backend
  userRole: "user" | "admin" | "superadmin" | null;
  userData: any | null; // Full user data from backend including provider
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"user" | "admin" | "superadmin" | null>(null);
  const [userData, setUserData] = useState<any | null>(null); // Full user data from backend
  const router = useRouter();

  useEffect(() => {
    // Ensure we're on client side
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    // Initialize Firebase auth
    const initAuth = async () => {
      try {
        const { getFirebaseAuthAsync } = await import("@/lib/firebase");
        if (!mounted) return;
        
        // Use async version to ensure Firebase is initialized
        const authInstance = await getFirebaseAuthAsync();
        
        if (!mounted) return;
        
        unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
          if (!mounted) return;
          
          if (firebaseUser) {
            setUser(firebaseUser);
            // Fetch user role from backend
            try {
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
              const token = await firebaseUser.getIdToken();
              const res = await fetch(`${API_BASE}/api/auth/user`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (res.ok) {
                const data = await res.json();
                setUserRole(data.user?.role || "user");
                setUserData(data.user); // Store full user data
              } else {
                setUserRole("user");
                setUserData(null);
              }
            } catch (error) {
              console.error("Error fetching user role:", error);
              setUserRole("user");
            }
          } else {
            setUser(null);
            setUserRole(null);
            setUserData(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Failed to initialize Firebase auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize immediately
    initAuth();
    
    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { getFirebaseAuthAsync } = await import("@/lib/firebase");
    const authInstance = await getFirebaseAuthAsync();
  
    await signInWithEmailAndPassword(authInstance, email, password);
    
    const token = await authInstance.currentUser?.getIdToken();
    if (token) {
      await syncUserWithBackend(token);
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    const { getFirebaseAuthAsync } = await import("@/lib/firebase");
    const authInstance = await getFirebaseAuthAsync();
  
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    
    const token = await userCredential.user.getIdToken();
    await syncUserWithBackend(token, { name, email });
  };
  

  const signInWithGoogle = async () => {
    if (typeof window === "undefined") {
      throw new Error("Firebase auth can only be used on the client side");
    }
    const { getFirebaseAuthAsync } = await import("@/lib/firebase");
const authInstance = await getFirebaseAuthAsync();

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(authInstance, provider);
    // Sync user with backend
    const token = await userCredential.user.getIdToken();
    await syncUserWithBackend(token, {
      name: userCredential.user.displayName || "",
      email: userCredential.user.email || "",
      image: userCredential.user.photoURL || "",
      googleId: userCredential.user.uid,
    });
  };

  const logout = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const { getFirebaseAuthAsync } = await import("@/lib/firebase");
const authInstance = await getFirebaseAuthAsync();

    await firebaseSignOut(authInstance);
    setUser(null);
    setUserRole(null);
    router.push("/");
  };

  const resetPassword = async (email: string) => {
    if (typeof window === "undefined") {
      throw new Error("Firebase auth can only be used on the client side");
    }
    const { getFirebaseAuthAsync } = await import("@/lib/firebase");
    const authInstance = await getFirebaseAuthAsync();

    await sendPasswordResetEmail(authInstance, email);
  };

  // Refresh user data from backend (useful after role changes)
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.user?.role || "user");
        setUserData(data.user); // Store full user data
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const syncUserWithBackend = async (
    token: string,
    userData?: { name?: string; email?: string; image?: string; googleId?: string }
  ) => {
    try {
      if (typeof window === "undefined") return;
      
      const { getFirebaseAuthAsync } = await import("@/lib/firebase");
const authInstance = await getFirebaseAuthAsync();

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${API_BASE}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUid: authInstance.currentUser?.uid,
          ...userData,
        }),
      });
    } catch (error) {
      console.error("Error syncing user with backend:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        refreshUserData,
        userRole,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

