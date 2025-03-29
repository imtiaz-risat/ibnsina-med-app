"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LuUser, LuLoader2 } from "react-icons/lu";

export default function DoctorProfilePage() {
  const { data: session, status } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctorData() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/doctor/${session.user.id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch doctor data");
          }

          const data = await response.json();
          setDoctor(data);
        } catch (err) {
          console.error("Error fetching doctor data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
        setError("You must be logged in to view this page");
      }
    }

    fetchDoctorData();
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* <LuLoader2 className="w-10 h-10 animate-spin text-blue-600" /> */}
        <p className="mt-4 text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Doctor profile not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6">
            <LuUser className="w-12 h-12 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {doctor.firstname} {doctor.lastname}
            </h1>
            <p className="text-gray-600">ID: {doctor.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <div className="mt-2 space-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Username:</span>
                  <span>{doctor.username}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Gender:</span>
                  <span>{doctor.gender}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <div className="mt-2 space-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Phone:</span>
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Address:</span>
                  <span>{doctor.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            // You can add an onClick handler to edit profile
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
