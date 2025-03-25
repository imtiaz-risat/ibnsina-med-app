import Link from "next/link";
import { FaUserMd } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-8">
          Ibn Sina Med App
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Portal Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <FaUserMd className="text-blue-600 text-5xl" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Doctor Portal
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Access patient information and manage prescriptions for your
              patients.
            </p>

            <Link href="/doctor" className="mt-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-300">
                Access Doctor Portal
              </button>
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <FaUserCog className="text-yellow-600 text-5xl" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Admin Portal
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Manage system settings, user accounts, and oversee the entire
              platform.
            </p>

            <Link href="/admin" className="mt-auto">
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-md transition-colors duration-300">
                Access Admin Portal
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-10 text-gray-600 text-sm">
          © 2025 Ibn Sina Medical App
        </div>
      </div>
    </div>
  );
}
