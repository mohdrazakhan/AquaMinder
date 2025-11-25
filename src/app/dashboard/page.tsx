"use client";
import DeviceListFirestore from "@/components/DeviceListFirestore";

export default function DashboardPage() {
  return (
    <div className="py-12 container">
      <h1 className="text-3xl font-extrabold">Dashboard</h1>
      <p className="text-slate-600 mt-2">Manage your devices</p>

      <div className="mt-6">
        <DeviceListFirestore />
      </div>
    </div>
  );
}
