"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("naver", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Blog Admin</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-[#03C75A] text-white py-3 px-4 rounded-md font-medium hover:bg-[#02b350] transition-colors"
        >
          네이버로 로그인
        </button>
      </div>
    </div>
  );
}
