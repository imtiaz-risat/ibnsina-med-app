"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login/admin" })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Doctor Management</h2>
          <p className="text-gray-600 mb-4">
            Add, edit, and manage doctor accounts in the system.
          </p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/admin/doctor-list"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
            >
              View All Doctors
            </Link>
            <Link
              href="/admin/add-doctor"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center"
            >
              Add New Doctor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
