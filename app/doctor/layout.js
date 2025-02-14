"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import UserButton from "../components/userButton";
import { SessionProvider } from "next-auth/react";
import Loading from "./loading";

const DoctorLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true);
    const handleRouteChangeComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed h-16 top-0 left-0 right-0 flex flex-row items-end justify-end bg-white border-b border-slate-300 text-black p-4 z-10">
          {/* <h1>Doctor Dashboard</h1> */}
          <SessionProvider>
            <UserButton />
          </SessionProvider>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 p-6 pt-20 bg-gray-100 ${
            isOpen ? "ml-[200px]" : "ml-[50px]"
          } transition-all duration-400`}
        >
          {isLoading ? <Loading /> : children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
