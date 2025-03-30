"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Users, UserPlus, Settings, LogOut, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login/admin" })}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-colors border border-white border-opacity-20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/doctor-list"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Doctor List
              </h2>
              <p className="text-gray-600 mb-4 flex-grow">
                View and manage all doctors in the system
              </p>
              <div className="flex items-center text-indigo-600 font-medium mt-2">
                <span>Manage doctors</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/add-doctor"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Add Doctor
              </h2>
              <p className="text-gray-600 mb-4 flex-grow">
                Register a new doctor to the system
              </p>
              <div className="flex items-center text-green-600 font-medium mt-2">
                <span>Add new doctor</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
