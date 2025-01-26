"use client";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import UserButton from "../components/userButton";
import { SessionProvider } from "next-auth/react";

const DoctorLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-row items-end justify-end bg-white border-b border-slate-300 text-black p-4">
          {/* <h1>Doctor Dashboard</h1> */}
          <SessionProvider>
            <UserButton />
          </SessionProvider>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 p-6 bg-gray-100 ${
            isOpen ? "ml-[200px]" : "ml-[50px]"
          } transition-all duration-400`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
