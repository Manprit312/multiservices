"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Hotel, Car, BrushCleaning, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function AdminDashboard() {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    revenue: 0,
    customers: 0,
  });
  const [, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      // Fetch provider's services
      const servicesRes = await fetch(`${API_BASE}/api/providers/${userData.provider}/services/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        const totalServices = servicesData.counts?.total || 0;
        setStats((prev) => ({ ...prev, totalServices }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user, userData]);

  useEffect(() => {
    if (userData?.provider) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [userData, fetchStats]);

  const statsData = [
    { name: "Total Services", value: stats.totalServices.toString(), icon: Hotel, color: "bg-blue-500" },
    { name: "Total Bookings", value: stats.totalBookings.toString(), icon: TrendingUp, color: "bg-green-500" },
    { name: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "bg-yellow-500" },
    { name: "Customers", value: stats.customers.toString(), icon: Users, color: "bg-purple-500" },
  ];

  const quickActions = [
    { name: "Hotels", href: "/admin/hotels", icon: Hotel, color: "bg-blue-100 text-blue-600" },
    { name: "Cabs", href: "/admin/cabs", icon: Car, color: "bg-yellow-100 text-yellow-600" },
    { name: "Cleaning", href: "/admin/cleaning", icon: BrushCleaning, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className={`${action.color} p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold">Manage {action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

