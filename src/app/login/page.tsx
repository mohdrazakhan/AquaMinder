// src/app/login/page.tsx
import React from "react";
import SEO from "@/lib/seo";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <SEO title="Login" />
      <section className="py-20">
        <div className="container max-w-xl">
          <h1 className="text-3xl font-extrabold">Sign in to Aqua Minder</h1>
          <p className="mt-2 text-slate-600">Use your device ID & password, or sign in with email.</p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-12">
            <img src="/images/support-hero.png" alt="hero" />
            {/* or use local placeholder: /mnt/data/Screenshot 2025-11-23 at 1.22.28 AM.png */}
            <p className="text-xs text-slate-500 mt-2">Device ID printed on your device. Default password is printed on the device label.</p>
          </div>
        </div>
      </section>
    </>
  );
}
