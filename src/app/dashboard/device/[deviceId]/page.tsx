import React from "react";
import MotorCard from "@/components/device/MotorCard";
import ScheduleCard from "@/components/device/ScheduleCard";
import LogsCard from "@/components/device/LogsCard";
import DeviceRealtime from "@/components/device/DeviceRealtime";
import ClientDeviceWidget from "@/components/device/ClientDeviceWidget";

type Props = {
  params: Promise<{ deviceId: string }>;
};

export default async function DevicePage({ params }: Props) {
  // ✅ FIX: params is a Promise → unwrap it
  const { deviceId } = await params;

  if (!deviceId) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Device not found</h1>
        <p className="text-slate-600">Missing device id in URL.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Device: {deviceId}</h1>
        <p className="text-slate-600 mb-8">
          Manage your device in real-time. Controls, schedules and logs below.
        </p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Realtime client wrapper */}
          <ClientDeviceWidget deviceId={deviceId} />

          <ScheduleCard deviceId={deviceId} />
          <LogsCard deviceId={deviceId} />
        </div>
      </div>
    </div>
  );
}
