"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import MotorCard from "./MotorCard";

export default function ClientDeviceWidget({ deviceId }: { deviceId: string }) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!db) return;

    const statusRef = ref(db, `devices/${deviceId}/status`);
    return onValue(statusRef, (snapshot) => {
      setStatus(snapshot.val());
    });
  }, [deviceId]);

  if (!status) return <p>Loading...</p>;

  return <MotorCard deviceId={deviceId} status={status} />;
}
