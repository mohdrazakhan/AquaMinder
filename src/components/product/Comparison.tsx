// src/components/product/Comparison.tsx
import React from "react";
import { MODELS } from "@/data/models";

export default function Comparison({ currentModel }: { currentModel: string }) {
  // show a compact comparison of 3 models
  return (
    <div className="bg-white rounded-2xl p-4 border shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">Compare models</h4>

      <div className="mt-3 text-sm text-slate-600">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2"></th>
              {MODELS.map((m) => (
                <th key={m.id} className="py-2 text-left">
                  <div className={`px-2 py-1 rounded ${m.id === currentModel ? "bg-sky-600 text-white inline-block" : "bg-slate-50 inline-block text-slate-700"}`}>
                    {m.title.split(" ")[1]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-slate-600">Key feature</td>
              {MODELS.map((m) => (
                <td key={m.id} className="py-2">{m.features[0]}</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-slate-600">Suggested price</td>
              {MODELS.map((m) => (
                <td key={m.id} className="py-2">{m.priceSuggested}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <a href="/pricing" className="inline-flex items-center px-3 py-2 rounded bg-white border text-slate-700 hover:bg-slate-50 text-sm">
          See full pricing
        </a>
      </div>
    </div>
  );
}
