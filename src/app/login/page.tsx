// src/app/login/page.tsx
import React from "react";
import LoginForm from "@/components/ui/LoginForm";

export const metadata = {
  title: "Login - Aqua Minder",
};

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center py-20">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-3xl font-extrabold mb-6">Login with email</h1>
        <LoginForm />
      </div>
    </div>
  );
}
