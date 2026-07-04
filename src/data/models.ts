// src/data/models.ts
export type Model = {
  id: "lite" | "pro";
  title: string;
  subtitle?: string;
  short: string;
  long: string;
  priceSuggested?: string; // guide price
  features: string[];
  specs: { k: string; v: string }[];
  gallery?: string[]; // public/image paths
};

export const MODELS: Model[] = [
  {
    id: "lite",
    title: "Aqua Minder",
    subtitle: "Basic",
    short: "Reliable scheduling & local alerts for homes.",
    long:
      "Aqua Minder is a compact water controller for single-home setups. It provides manual controls, local scheduling, and essential notifications.",
    priceSuggested: "₹1,499",
    features: [
      "Manual Motor Control (App + Web)",
      "Time Scheduling (multiple schedules)",
      "Real-time motor state & action history",
      "Push notifications for actions",
    ],
    specs: [
      { k: "Connectivity", v: "Wi-Fi (2.4GHz)" },
      { k: "Power", v: "12V DC adapter" },
      { k: "Mount", v: "Wall mount (included)" },
      { k: "Sensors", v: "Basic flow state (on/off)" },
      { k: "Warranty", v: "1 year" },
    ],
    gallery: ["/images/lite-1.png", "/images/lite-2.png"],
  },
  {
    id: "pro",
    title: "Aqua Minder +",
    subtitle: "Recommended",
    short: "Advanced level sensing, Dry Run Protection, and Temperature monitoring.",
    long:
      "Aqua Minder + adds advanced sensors for your water system. It includes intelligent Dry Run Protection to save your motor, real-time tank temperature monitoring, and smart auto ON/OFF based on tank levels.",
    priceSuggested: "₹3,499",
    features: [
      "All Aqua Minder features",
      "Dry Run Protection",
      "Water Tank Temperature Monitoring",
      "Live Water Level Monitoring",
      "Automatic safety alerts",
    ],
    specs: [
      { k: "Connectivity", v: "Wi-Fi (2.4GHz) + BLE" },
      { k: "Power", v: "12V DC adapter" },
      { k: "Sensors", v: "Ultrasonic / float level sensor (included)" },
      { k: "Motor Support", v: "Single-phase AC motor (up to 1 HP)" },
      { k: "Warranty", v: "1 year" },
    ],
    gallery: ["/images/pro-1.png", "/images/pro-2.png"],
  },
];

export function getModelById(id: string) {
  return MODELS.find((m) => m.id === id);
}
