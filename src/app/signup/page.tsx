// src/app/signup/page.tsx
import React from "react";
import SignUpForm from "@/components/ui/SignUpForm";

export const metadata = {
  title: "Sign Up - Aqua Minder",
};

export default function SignUpPage() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center py-20">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-3xl font-extrabold mb-6">Create your account</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
