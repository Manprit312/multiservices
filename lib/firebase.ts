import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCdALu2r_nseJls3hjRa2A3_6qE3EXwJGE",
  authDomain: "multiservices-f5391.firebaseapp.com",
  projectId: "multiservices-f5391",
  storageBucket: "multiservices-f5391.firebasestorage.app",
  messagingSenderId: "280920856842",
  appId: "1:280920856842:web:35b0c0f4fe1d7c1ea382f3",
  measurementId: "G-SS33VX6W10"
};

// Initialize Firebase synchronously on client side
let app: FirebaseApp | null = null;
let authx: Auth | null = null;
let analytics: Analytics | null = null;
let isInitializing = false;
let initPromise: Promise<{ app: FirebaseApp; auth: Auth }> | null = null;

// Initialize Firebase function
function initializeFirebase(): Promise<{ app: FirebaseApp; auth: Auth }> {
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be initialized on the client side");
  }

  // If already initialized, return immediately
  if (app && authx) {
    return Promise.resolve({ app, auth: authx });
  }

  // If currently initializing, return the existing promise
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  isInitializing = true;
  initPromise = (async () => {
    try {
      // Check if app already exists
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
      } else {
        // Initialize new app (don't use a name to avoid conflicts)
        app = initializeApp(firebaseConfig);
      }
      
      // Initialize auth - must be called after app is initialized
      if (!app) {
        throw new Error("Failed to initialize Firebase app");
      }
      
      // Get auth instance - this must use the same app instance
      // Use the default app instance to ensure consistency
      try {
        authx = getAuth(app);
        
        // Verify auth is properly configured by checking if we can access auth settings
        if (!authx || !authx.app) {
          throw new Error("Firebase Auth instance is invalid");
        }
      } catch (authError) {
        console.error("Firebase Auth initialization error:", authError);
        // If it's a configuration error, provide helpful message
        const error = authError as { code?: string; message?: string };
        if (error.code === "auth/configuration-not-found" || error.message?.includes("CONFIGURATION_NOT_FOUND")) {
          throw new Error("Firebase Auth is not configured. Please enable Authentication in Firebase Console and ensure the project configuration is correct.");
        }
        throw authError;
      }
      
      // Initialize Analytics asynchronously (non-blocking)
      isSupported().then((yes) => {
        if (yes && app && !analytics) {
          try {
            analytics = getAnalytics(app);
          } catch (err) {
            console.warn("Analytics initialization failed:", err);
          }
        }
      }).catch(() => {
        // Analytics not supported, ignore
      });
      
      isInitializing = false;
      return { app, auth: authx };
    } catch (error) {
      isInitializing = false;
      initPromise = null;
      console.error("Firebase initialization error:", error);
      throw error;
    }
  })();

  return initPromise;
}

// Initialize Firebase immediately when module loads (client-side only)
if (typeof window !== "undefined") {
  // Initialize in the background, don't wait for it
  initializeFirebase().catch((error) => {
    console.error("Firebase initialization failed on module load:", error);
  });
}

// Get auth - only works on client side (synchronous, but may throw if not initialized)
export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used on the client side");
  }
  
  // If already initialized, return immediately
  if (authx && app) {
    return authx;
  }
  
  // If currently initializing, throw error (should use async version)
  if (isInitializing) {
    throw new Error("Firebase is currently initializing. Use getFirebaseAuthAsync() instead.");
  }
  
  // Try to get existing app
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    authx = getAuth(app);
    return authx;
  }
  
  // If no app exists, throw error (should use async version)
  throw new Error("Firebase not initialized. Use getFirebaseAuthAsync() to initialize.");
}

// Async version - ensures Firebase is initialized before returning
export async function getFirebaseAuthAsync(): Promise<Auth> {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used on the client side");
  }
  
  // If already initialized, return immediately
  if (authx && app) {
    return authx;
  }
  
  // Initialize and wait for it
  const { auth } = await initializeFirebase();
  return auth;
}

// Get app - only works on client side
export async function getFirebaseAppAsync(): Promise<FirebaseApp> {
  if (typeof window === "undefined") {
    throw new Error("Firebase App can only be used on the client side");
  }
  
  // If already initialized, return immediately
  if (app) {
    return app;
  }
  
  // Initialize and wait for it
  const { app: initializedApp } = await initializeFirebase();
  return initializedApp;
}

// Synchronous version (may throw if not initialized)
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase App can only be used on the client side");
  }
  
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      throw new Error("Firebase not initialized. Use getFirebaseAppAsync() to initialize.");
    }
  }
  
  return app;
}

// Export auth for backward compatibility (lazy getter)
export function getAuthInstance(): Auth | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return getFirebaseAuth();
  } catch {
    return null;
  }
}

// Export as getter to avoid initialization issues
export const auth = typeof window !== "undefined" ? getAuthInstance() : null;

export { analytics };
export default app;

