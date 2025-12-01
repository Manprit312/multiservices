"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface CleaningService {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  images: string[];
  provider: {
    _id: string;
    name: string;
  };
}

export default function AdminCleaningPage() {
  const { user, userData } = useAuth();
  const [services, setServices] = useState<CleaningService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = useCallback(async () => {
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
        setServices(data.services?.cleaning || []);
      }
    } catch (error) {
      console.error("Error fetching cleaning services:", error);
    } finally {
      setLoading(false);
    }
  }, [user, userData]);

  useEffect(() => {
    if (userData?.provider) {
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [userData, fetchServices]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE}/api/cleaning/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Cleaning Services</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your cleaning services</p>
        </div>
        <Link
          href="/admin/cleaning/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery ? "No services found matching your search" : "No cleaning services yet. Add your first service!"}
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    {service.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">₹{service.price}</p>
                    <p className="text-sm text-gray-500">{service.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/cleaning/${service._id}/edit`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
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

