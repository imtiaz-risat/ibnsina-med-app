import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { SessionProvider, useSession } from "next-auth/react";
import { LuSettings, LuLogOut, LuUser } from "react-icons/lu";

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <SessionProvider>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <LuUser className="w-5 h-5 text-gray-600 hover:text-gray-800 rounded-full" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2">
            <div className="flex items-center p-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <LuUser className="w-5 h-5 rounded-full" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold">
                  {session?.user?.firstname} {session?.user?.lastname}
                </p>
                <p className="text-sm text-gray-500">{session?.user?.name}</p>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                href="/doctor/profile"
              >
                <LuSettings className="mr-2" />
                Manage account
              </button>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <LuLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </SessionProvider>
  );
};

export default UserButton;
