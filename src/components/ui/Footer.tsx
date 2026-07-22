import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12 bg-white">
      <div className="container mx-auto pt-8 pb-24 md:pb-8 px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-sm text-slate-500 text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-semibold text-slate-800">Aqua Minder</span>
          <span>© {new Date().getFullYear()} — All rights reserved.</span>
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-4 max-w-sm md:max-w-none">
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/privacy">Privacy</a>
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/terms">Terms</a>
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/refund">Refund</a>
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/cancellation">Cancellation</a>
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/shipping">Shipping</a>
          <a className="hover:text-sky-600 transition-colors py-1 px-2" href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
