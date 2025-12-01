"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface CabService {
  _id: string;
  name: string;
  pickup: string;
  drop: string;
  fare: number;
  vehicleType: string;
  images: string[];
  provider: {
    _id: string;
    name: string;
  };
}

export default function AdminCabsPage() {
  const { user, userData } = useAuth();
  const [cabs, setCabs] = useState<CabService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCabs = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE}/api/providers/${userData.provider}/services/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCabs(data.services?.rides || []);
      }
    } catch (error) {
      console.error("Error fetching cabs:", error);
    } finally {
      setLoading(false);
    }
  }, [user, userData]);

  useEffect(() => {
    if (userData?.provider) {
      fetchCabs();
    } else {
      setLoading(false);
    }
  }, [userData, fetchCabs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cab service?")) return;
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE}/api/cab-services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setCabs(cabs.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Error deleting cab service:", error);
    }
  };

  const filteredCabs = cabs.filter((cab) =>
    cab.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cab.pickup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cab.drop?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Cab Services</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your cab services</p>
        </div>
        <Link
          href="/admin/cabs/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Cab Service
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cab services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Cabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCabs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery ? "No cab services found matching your search" : "No cab services yet. Add your first service!"}
          </div>
        ) : (
          filteredCabs.map((cab) => (
            <div
              key={cab._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {cab.images && cab.images.length > 0 && (
                <img
                  src={cab.images[0]}
                  alt={cab.name || "Cab service"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{cab.name || "Cab Service"}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">From:</span> {cab.pickup}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">To:</span> {cab.drop}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">₹{cab.fare}</p>
                    <p className="text-sm text-gray-500 capitalize">{cab.vehicleType}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/cabs/${cab._id}/edit`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(cab._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

