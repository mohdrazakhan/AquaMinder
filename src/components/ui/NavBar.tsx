
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NavBar() {
  return (
    <header className="border-b bg-white/60 backdrop-blur-sm w-full">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo and name on the left */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Aqua Minder Logo" width={40} height={40} className="object-contain" />
          <div className="text-lg font-semibold">Aqua Minder</div>
        </Link>

        {/* Nav links on the right */}
        <nav className="hidden md:flex gap-6 items-center text-sm text-slate-700 ml-auto">
          <Link href="#features" className="hover:text-slate-900">Features</Link>
          <Link href="/product" className="hover:text-slate-900">Product</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          <Button className="hover:text-slate-900">Buy now</Button>
        </nav>

        {/* Mobile menu button stays on the right */}
        <div className="md:hidden ml-auto">
          <button aria-label="Open menu" className="p-2 rounded-md bg-slate-100">☰</button>
        </div>
      </div>
    </header>
  );
}
