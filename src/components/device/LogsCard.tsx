"use client";
export default function LogsCard({ deviceId }: { deviceId: string }) {
  return (
    <div className="p-6 rounded-lg border bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Logs</h3>
      <p className="text-sm text-slate-600">Realtime event log (coming next).</p>
      <div className="mt-4 text-xs text-slate-500">Device: {deviceId}</div>
    </div>
  );
}
