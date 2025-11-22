import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
        <div>© {new Date().getFullYear()} Aqua Minder — All rights reserved.</div>
        <div className="flex gap-4">
          <a className="underline" href="/privacy">Privacy</a>
          <a className="underline" href="/terms">Terms</a>
          <a className="underline" href="/contact"> Contact Us </a>
        </div>
      </div>
    </footer>
  );
}
