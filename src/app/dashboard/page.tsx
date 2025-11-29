// src/app/dashboard/page.tsx
import React from "react";
import DeviceListFirestore from "@/components/DeviceListFirestore";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-6">Your Devices</h1>
        <DeviceListFirestore />
      </div>
    </AuthGuard>
  );
}
