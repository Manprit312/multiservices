"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { User, Mail, Building2, Shield, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnifiedHeader from "@/components/UnifiedHeader";

export default function ProfilePage() {
  const { user, userRole, userData, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData?.name || user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    } else if (user?.displayName) {
      setName(user.displayName);
    }
  }, [userData, user]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      // Update user name in backend
      const res = await fetch(`${API_BASE}/api/auth/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setEditing(false);
        // Reload to get updated data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
            <Link
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UnifiedHeader />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="w-10 h-10 text-green-600" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-green-100">{user.email}</p>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </label>
                  {editing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setName(userData?.name || user?.displayName || "");
                          setMessage("");
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-900 text-lg">{name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role
                    </div>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      userRole === "superadmin" 
                        ? "bg-purple-100 text-purple-700"
                        : userRole === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {userRole || "user"}
                    </span>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Go to Admin Dashboard →
                      </Link>
                    )}
                    {userRole === "superadmin" && (
                      <Link
                        href="/superadmin"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Go to Superadmin Dashboard →
                      </Link>
                    )}
                  </div>
                </div>

                {userData?.provider && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Provider
                      </div>
                    </label>
                    <p className="text-gray-900">Provider ID: {userData.provider}</p>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
                      >
                        Manage Provider Services →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                {userRole !== "admin" && userRole !== "superadmin" && (
                  <Link
                    href="/register-provider"
                    className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register as Provider
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

