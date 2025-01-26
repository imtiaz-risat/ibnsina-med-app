"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const DoctorLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("doctor-login", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      console.error("Login failed: " + result.error);
      alert("Login failed: " + result.error);
    } else {
      window.location.href = "/doctor";
    }
  };

  return (
    <div>
      <h1>Doctor Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default DoctorLoginPage;
