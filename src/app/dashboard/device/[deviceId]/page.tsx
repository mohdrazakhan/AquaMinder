// src/app/dashboard/device/[deviceId]/page.tsx
import React from "react";
import DeviceDashboard from "@/components/device/DeviceDashboard";

/**
 * Temporary: accept `props: any` to avoid Next.js PageProps type constraint issues
 * caused by differences between your `Props` type and the framework's expected type.
 * This preserves runtime behavior while unblocking the build. We can restore strict
 * typing later.
 */
export default async function DevicePage(props: any) {
  // Access params safely (they may be a promise-like or a plain object)
  const resolvedParams = await Promise.resolve(props?.params) as { deviceId?: string | string[] } | undefined;

  // Normalise deviceId (handle array or missing value)
  let rawId = resolvedParams?.deviceId;
  if (Array.isArray(rawId)) rawId = rawId[0];
  const deviceId = typeof rawId === "string" ? rawId : undefined;

  // Optional server-side debug logging
  try {
    // eslint-disable-next-line no-console
    console.log("DevicePage incoming params:", JSON.stringify(resolvedParams));
  } catch (e) {}

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
