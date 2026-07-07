// src/app/reset-password/page.tsx
import React from "react";
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";

export const metadata = {
  title: "Reset Password - Aqua Minder",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center py-20">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-3xl font-extrabold mb-2">Reset Password</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
