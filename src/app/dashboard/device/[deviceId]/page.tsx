// src/app/dashboard/device/[deviceId]/page.tsx
import React from "react";
import DeviceDashboard from "@/components/device/DeviceDashboard";

type ParamsShape = { deviceId?: string | string[] };

type Props = { params: ParamsShape };

export default async function DevicePage({ params }: Props) {
  // handle cases where params might be a promise, or deviceId an array
  // log incoming params for debugging (server-side)
  try {
    // eslint-disable-next-line no-console
    console.log("DevicePage incoming params:", JSON.stringify(params));
  } catch (e) {}

  const resolvedParams = await Promise.resolve(params as any);
  let rawId = resolvedParams?.deviceId;
  if (Array.isArray(rawId)) rawId = rawId[0];
  const deviceId = typeof rawId === "string" ? rawId : undefined;

  if (!deviceId) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Device not found</h1>
        <p className="text-slate-600">Missing device id in URL.</p>
        <div className="mt-4 p-4 bg-slate-50 rounded text-sm">
          <div className="font-medium">Debug: resolved params</div>
          <pre className="text-xs text-slate-700 mt-2">{JSON.stringify(resolvedParams, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-extrabold mb-2">Device: {deviceId}</h1>
      <p className="text-slate-600 mb-8">Manage your device in real-time. Controls, schedules and logs below.</p>

      <DeviceDashboard deviceId={deviceId} />
    </div>
  );
}
