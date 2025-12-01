"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  provider: {
    _id: string;
    name: string;
  };
}

export default function AdminHotelsPage() {
  const { user, userData } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHotels = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      // Fetch only hotels for this provider
      const res = await fetch(`${API_BASE}/api/providers/${userData.provider}/services/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setHotels(data.services?.hotels || []);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  }, [user, userData]);

  useEffect(() => {
    if (userData?.provider) {
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, [userData, fetchHotels]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_BASE}/api/hotels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setHotels(hotels.filter((h) => h._id !== id));
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Hotels</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your hotel services</p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Hotel
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery ? "No hotels found matching your search" : "No hotels yet. Add your first hotel!"}
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {hotel.images && hotel.images.length > 0 && (
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{hotel.location}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">₹{hotel.price}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/hotels/${hotel._id}/edit`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(hotel._id)}
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

