"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  requiredRole?: "user" | "admin" | "superadmin";
}

export default function RequireAuth({ children, requiredRole = "user" }: RequireAuthProps) {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Still loading

    if (!user) {
      // Redirect to login with callback URL
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // Debug logging
    console.log("RequireAuth check:", { userRole, requiredRole, pathname });

    // Check role-based access
    if (requiredRole === "admin" && userRole !== "admin" && userRole !== "superadmin") {
      console.warn("Access denied: User role is", userRole, "but required role is", requiredRole);
      router.push("/");
      return;
    }

    if (requiredRole === "superadmin" && userRole !== "superadmin") {
      console.warn("Access denied: User role is", userRole, "but required role is", requiredRole);
      router.push("/");
      return;
    }
  }, [user, loading, userRole, router, pathname, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Role check
  if (requiredRole === "admin" && userRole !== "admin" && userRole !== "superadmin") {
    return null;
  }

  if (requiredRole === "superadmin" && userRole !== "superadmin") {
    return null;
  }

  return <>{children}</>;
}

