"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function DoctorPage() {
  return (
    <div>
      <h1>Doctor Main Page (Dashboard)</h1>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>
        Sign Out
      </button>
    </div>
  );
}
