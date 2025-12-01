"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function DebugPage() {
  return (
    <RequireAuth requiredRole="user">
      <DebugContent />
    </RequireAuth>
  );
}

function DebugContent() {
  const { user, userRole, userData, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const updateRole = async (newRole: string) => {
    if (!confirm(`Are you sure you want to update your role to ${newRole}?`)) return;
    
    setUpdating(true);
    setMessage("");
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE}/api/auth/user/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData?._id,
          role: newRole,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Role updated to ${newRole}. Please refresh the page.`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(data.message || "Failed to update role");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error updating role");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Debug Info</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Firebase User:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(
              {
                uid: user?.uid,
                email: user?.email,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">User Role:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg mb-4">
              <span className="font-semibold">Current Role:</span>{" "}
              <span className={userRole === "admin" || userRole === "superadmin" ? "text-green-600" : "text-red-600"}>
                {userRole || "null"}
              </span>
            </p>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">Update your role (requires superadmin access or database update):</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateRole("admin")}
                  disabled={updating || userRole === "admin"}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Set to Admin
                </button>
                <button
                  onClick={() => updateRole("superadmin")}
                  disabled={updating || userRole === "superadmin"}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Set to Superadmin
                </button>
              </div>
              {message && (
                <p className={`text-sm mt-2 ${message.includes("success") || message.includes("updated") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Backend User Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">To access admin pages:</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Your role must be set to &quot;admin&quot; or &quot;superadmin&quot; in the database</li>
            <li>Current role: <strong>{userRole || "null"}</strong></li>
            <li>If your role is &quot;user&quot;, you can try updating it above (if you have superadmin access)</li>
            <li>Otherwise, update it directly in MongoDB: <code className="bg-gray-200 px-1 rounded">db.users.updateOne(&#123;&quot;email&quot;: &quot;your@email.com&quot;&#125;, &#123;$set: &#123;&quot;role&quot;: &quot;admin&quot;&#125;&#125;)</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

