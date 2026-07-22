// src/app/dashboard/device/[deviceId]/page.tsx
import React from "react";
import DeviceDashboard from "@/components/device/DeviceDashboard";
import DeviceHeaderStatus from "@/components/device/DeviceHeaderStatus";
import AuthGuard from "@/components/AuthGuard";

export default async function DevicePage(props: any) {
  // Access params safely
  const resolvedParams = await Promise.resolve(props?.params) as { deviceId?: string | string[] } | undefined;

  // Normalise deviceId
  let rawId = resolvedParams?.deviceId;
  if (Array.isArray(rawId)) rawId = rawId[0];
  const deviceId = typeof rawId === "string" ? rawId : undefined;

  if (!deviceId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-xl text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Device Not Found</h1>
          <p className="text-slate-600 text-sm mb-6">Missing or invalid device identification in URL parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-slate-800 pb-20 font-sans">
        {/* Device Status Bar */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 md:px-6 py-1">
          <div className="container mx-auto">
            {/* Real-time Online / Offline Status Component */}
            <DeviceHeaderStatus deviceId={deviceId} />
            
            <div className="hidden md:flex md:items-center md:justify-between gap-4 mt-2">
              <h1 className="text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-x-2 gap-y-1">
                Tank Monitor <span className="text-blue-600 font-mono break-all">#{deviceId}</span>
              </h1>
              <p className="text-slate-600 text-sm max-w-md text-right font-medium">
                Manage pump relay states, toggle night mode, and inspect real-time flow telemetry directly from your dashboard.
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 md:px-6 pt-1 pb-8">
          <DeviceDashboard deviceId={deviceId} />
        </main>
      </div>
    </AuthGuard>
  );
}
