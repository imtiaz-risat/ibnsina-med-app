"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Main Page (Dashboard)</h1>
      <button onClick={() => signOut({ callbackUrl: "/login/admin" })}>
        Sign Out
      </button>
    </div>
  );
}
