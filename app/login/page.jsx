"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { BiMessageSquareError } from "react-icons/bi";
import { LuUser } from "react-icons/lu";
import { LuLock } from "react-icons/lu";

const DoctorLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("doctor-login", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Login failed: " + result.error);
    } else {
      window.location.href = "/doctor";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-800">
          Sign in to Your Account
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md flex items-center">
            <BiMessageSquareError className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10"
              placeholder="Enter your username"
            />
            <LuUser className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10"
              placeholder="Enter your password"
            />
            <LuLock className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Validating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLoginPage;
