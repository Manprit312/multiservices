"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Star, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Service {
  _id: string;
  name: string;
  price?: number;
}

interface Hotel {
  _id: string;
  name: string;
  price?: number;
}

interface Ride {
  _id: string;
  name?: string;
  price?: number;
}

interface Provider {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  rating?: number;
  totalReviews?: number;
  logo?: string;
  images?: string[];
  isActive: boolean;
  specialties?: string[];
  services?: Service[];
  allServices?: {
    cleaning?: Service[];
    hotels?: Hotel[];
    rides?: Ride[];
  };
  user?: {
    name: string;
    email: string;
  };
  createdAt?: string;
}

export default function ProviderDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = await user?.getIdToken();
        
        const res = await fetch(`${API_BASE}/api/providers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setProvider(data.provider);
        }
      } catch (error) {
        console.error("Error fetching provider:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchProvider();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Provider not found</p>
        <Link href="/superadmin/providers" className="text-green-600 hover:underline mt-4 inline-block">
          Back to Providers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
          <p className="text-gray-600 mt-1">Provider Details</p>
        </div>
        <Link
          href={`/superadmin/providers/${id}/edit`}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Edit Provider
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Provider Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-6 mb-6">
              {provider.logo && (
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-lg object-cover"
                  unoptimized
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                  {provider.isActive ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
                {provider.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                    {provider.totalReviews && (
                      <span className="text-gray-500 text-sm">
                        ({provider.totalReviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {provider.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{provider.description}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{provider.email}</p>
                  </div>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{provider.phone}</p>
                  </div>
                </div>
              )}
              {(provider.address || provider.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">
                      {[provider.address, provider.city, provider.state, provider.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Specialties */}
            {provider.specialties && provider.specialties.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
            {provider.allServices ? (
              <div className="space-y-4">
                {provider.allServices.cleaning && provider.allServices.cleaning.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Cleaning Services ({provider.allServices.cleaning.length})
                    </h4>
                    <div className="space-y-2">
                      {provider.allServices.cleaning.slice(0, 5).map((service: Service) => (
                        <div key={service._id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{service.name}</p>
                          {service.price && (
                            <p className="text-sm text-gray-600">₹{service.price}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {provider.allServices.hotels && provider.allServices.hotels.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Hotels ({provider.allServices.hotels.length})
                    </h4>
                    <div className="space-y-2">
                      {provider.allServices.hotels.slice(0, 5).map((hotel: Hotel) => (
                        <div key={hotel._id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{hotel.name}</p>
                          {hotel.price && (
                            <p className="text-sm text-gray-600">₹{hotel.price}/night</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {provider.allServices.rides && provider.allServices.rides.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Rides ({provider.allServices.rides.length})
                    </h4>
                    <div className="space-y-2">
                      {provider.allServices.rides.slice(0, 5).map((ride: Ride) => (
                        <div key={ride._id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{ride.name || "Ride Service"}</p>
                          {ride.price && (
                            <p className="text-sm text-gray-600">₹{ride.price}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(!provider.allServices.cleaning || provider.allServices.cleaning.length === 0) &&
                 (!provider.allServices.hotels || provider.allServices.hotels.length === 0) &&
                 (!provider.allServices.rides || provider.allServices.rides.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No services found</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No services found</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {provider.user && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Linked User</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900">{provider.user.name}</p>
                <p className="text-sm text-gray-500 mt-3">Email</p>
                <p className="text-gray-900">{provider.user.email}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Services</span>
                <span className="font-semibold text-gray-900">
                  {provider.services?.length || 0}
                </span>
              </div>
              {provider.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(provider.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

