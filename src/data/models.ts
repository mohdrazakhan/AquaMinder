// src/data/models.ts
export type Model = {
  id: "lite" | "pro" | "pro-plus";
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
    title: "AquaMinder Lite",
    subtitle: "Basic",
    short: "Reliable scheduling & local alerts for small homes and flats.",
    long:
      "AquaMinder Lite is a compact, affordable water controller for single-home setups. It provides manual controls, local scheduling, and essential notifications without cloud dependency — perfect for students, flats, and basic households.",
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
    title: "AquaMinder Pro",
    subtitle: "Recommended",
    short: "Level sensing, auto ON/OFF and cloud history for households & PGs.",
    long:
      "AquaMinder Pro adds water-level sensing and cloud features for homes and rental properties. Use smart auto ON/OFF based on tank level, view 30-day history, and get smarter alerts to prevent dry-runs and overflow.",
    priceSuggested: "₹3,499",
    features: [
      "All Lite features",
      "Live Water Level Monitoring (Full/High/Medium/Low/Empty)",
      "Smart Auto ON/OFF based on tank level",
      "Smart schedule + sensor logic",
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
  {
    id: "pro-plus",
    title: "AquaMinder Pro+",
    subtitle: "Premium",
    short: "Flow monitoring, dry-run protection and advanced automations for businesses.",
    long:
      "AquaMinder Pro+ is the advanced model with real-time flow monitoring, dry-run protection and multi-motor support for high-demand installations. Perfect for societies, hostels, and commercial setups that need insights and automation at scale.",
    priceSuggested: "₹6,499",
    features: [
      "All Pro features",
      "Water Flow Monitoring (real-time)",
      "Dry Run Protection (auto-off on no flow)",
      "Advanced automations and premium hardware",
    ],
    specs: [
      { k: "Connectivity", v: "Wi-Fi (2.4GHz) + Ethernet (optional)" },
      { k: "Power", v: "12-24V DC adapter / PoE optional" },
      { k: "Sensors", v: "High-accuracy flow sensor + level sensor" },
      { k: "Motor Support", v: "Multi-motor / three-phase support (with relay addon)" },
      { k: "Warranty", v: "2 years (Pro+ hardware)" },
    ],
    gallery: ["/images/proplus-1.png", "/images/proplus-2.png"],
  },
];

export function getModelById(id: string) {
  return MODELS.find((m) => m.id === id);
}
