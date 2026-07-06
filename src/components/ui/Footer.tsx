import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-600 text-center md:text-left">
        <div>© {new Date().getFullYear()} Aqua Minder — All rights reserved.</div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <a className="underline" href="/privacy">Privacy</a>
          <a className="underline" href="/terms">Terms</a>
          <a className="underline" href="/refund">Refund</a>
          <a className="underline" href="/cancellation">Cancellation</a>
          <a className="underline" href="/shipping">Shipping</a>
          <a className="underline" href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
