import React from "react";

export default function Features() {
  const items = [
    { title: "Instant Leak Alerts", desc: "Receive push & SMS alerts when abnormal flow is detected." },
    { title: "Consumption Insights", desc: "Daily, weekly and monthly breakdowns with personalized tips." },
    { title: "Remote Shutoff", desc: "Integrates with smart valves to remotely stop water in emergencies." },
  ];
  return (
    <section id="features" className="py-12 bg-slate-50 flex justify-center w-full">
      <div className="w-full max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-center">Features</h2>
        <p className="mt-2 text-slate-600 text-center">A compact device + intuitive app that helps you reduce bills and avoid damage.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(i => (
            <div key={i.title} className="p-6 bg-white rounded-2xl shadow text-center">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
