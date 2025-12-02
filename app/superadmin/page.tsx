"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Users, Building2, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({
    totalProviders: 0,
    totalUsers: 0,
    totalServices: 0,
  });

  useEffect(() => {
    // Fetch providers data
    const fetchData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/providers`);
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers || []);
          setStats({
            totalProviders: data.providers?.length || 0,
            totalUsers: 0, // Fetch from users endpoint
            totalServices: 0, // Calculate from providers
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProviders}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalServices}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Providers</h2>
          <Link
            href="/superadmin/providers"
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {providers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No providers found</p>
          ) : (
            providers.slice(0, 5).map((provider: { _id: string; name: string; email: string }) => (
              <div
                key={provider._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{provider.name}</p>
                  <p className="text-sm text-gray-600">{provider.email}</p>
                </div>
                <Link
                  href={`/superadmin/providers/${provider._id}`}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

