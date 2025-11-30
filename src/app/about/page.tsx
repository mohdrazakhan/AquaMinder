// /app/about/page.tsx  (or /pages/about.tsx — replace your current file)
import React from "react";
import SEO from "@/lib/seo";
import Link from "next/link";
import TeamCard from "@/components/TeamCard";
import FounderStory from "@/components/FounderStory";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl md:text-3xl font-extrabold">{value}</div>
    </div>
  );
}

const TEAM = [
  { name: "Mohd. Raza Khan", subtitle: "CS Engineer", role: "Founder", img: "raza.jpeg", linkedin: "https://www.linkedin.com/in/mohdrazakhan32" },
  { name: "Chandan Kumar Tiwari", subtitle: "CS Engineer", role: "Co-Founder", img: "chandan.jpeg", linkedin: "https://www.linkedin.com/in/chandan-tiwari-462824265/" },
  { name: "We're Hiring!", subtitle: "Join our team", role: "See open roles", img: "hiring.png", linkedin: "/careers" },
];

export default function AboutPage() {
  return (
    <>
      <SEO title="About" desc="Learn about Aqua Minder — our mission, story, and team." />

      <section className="pt-16 pb-24">
        <div className="container mx-auto px-6">
          {/* HERO */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                About Aqua Minder
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                We give people simple, dependable control over their water systems so they can avoid damage, reduce waste,
                and save money. We build durable hardware and privacy-first cloud software that homes and small businesses trust.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-block px-5 py-2 bg-sky-600 text-white rounded-md shadow">
                  Contact us
                </Link>
                <Link href="/careers" className="inline-block px-5 py-2 border rounded-md text-slate-700">
                  Careers
                </Link>
              </div>

              {/* quick stats strip - evenly spaced across the column */}
              <div className="mt-6 flex flex-wrap sm:flex-nowrap gap-6 items-center justify-between w-full max-w-xl">
                <div className="flex-1 min-w-[120px]"><Stat label="Devices in pilot" value="20+" /></div>
                <div className="flex-1 min-w-[120px]"><Stat label="Avg daily alerts" value="1k" /></div>
                <div className="flex-1 min-w-[120px]"><Stat label="Countries" value="India" /></div>
                <div className="flex-1 min-w-[120px]"><Stat label="Team size" value="2" /></div>
              </div>
            </div>

            {/* right column: visual card */}
            <div className="md:col-span-5">
              <div className="h-full rounded-xl bg-gradient-to-br from-sky-50 to-white p-6 flex flex-col justify-center items-start gap-4">
                <div className="text-slate-700">
                  <h3 className="text-xl font-semibold">Our approach</h3>
                  <p className="mt-2 text-sm">
                    Practical devices and clear software — built for climates, installers and families across India.
                  </p>
                </div>

                <div className="mt-4 w-full grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg shadow">
                    <div className="text-xs text-slate-500">Installed</div>
                    <div className="font-semibold text-lg mt-1">20+</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow">
                    <div className="text-xs text-slate-500">Pilots</div>
                    <div className="font-semibold text-lg mt-1">Local partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MISSION */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-lg bg-sky-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2C12 2 15 6 20 7" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 22C12 22 9 18 4 17" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Our mission</h2>
                <p className="mt-2 text-slate-600 max-w-2xl">
                  Reduce water waste by making monitoring accessible, actionable and private. We focus on delivering
                  solutions that are simple to install, reliable in difficult environments, and respectful of user privacy.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <h4 className="font-semibold">Reliable</h4>
                    <p className="mt-1 text-sm text-slate-600">Hardware that endures in real homes and real conditions.</p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <h4 className="font-semibold">Private</h4>
                    <p className="mt-1 text-sm text-slate-600">We minimize telemetry and give users control of their data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VALUES */}
          <div className="mt-10 max-w-5xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">What we value</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-lg shadow-sm text-center">
                <div className="text-sky-600 mb-2">🔩</div>
                <div className="font-semibold">Reliability</div>
                <div className="text-sm text-slate-600 mt-1">Durable hardware and robust firmware.</div>
              </div>

              <div className="p-5 bg-white rounded-lg shadow-sm text-center">
                <div className="text-sky-600 mb-2">🔒</div>
                <div className="font-semibold">Privacy</div>
                <div className="text-sm text-slate-600 mt-1">User data belongs to the user.</div>
              </div>

              <div className="p-5 bg-white rounded-lg shadow-sm text-center">
                <div className="text-sky-600 mb-2">⚙️</div>
                <div className="font-semibold">Simplicity</div>
                <div className="text-sm text-slate-600 mt-1">Fast installs and clear controls.</div>
              </div>

              <div className="p-5 bg-white rounded-lg shadow-sm text-center">
                <div className="text-sky-600 mb-2">💸</div>
                <div className="font-semibold">Affordability</div>
                <div className="text-sm text-slate-600 mt-1">Useful tech at sensible prices.</div>
              </div>
            </div>
          </div>

          {/* Founder story */}
          <div className="mt-12">
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm max-w-5xl mx-auto card-accent">
              <div className="prose max-w-none text-slate-700">
                <FounderStory />
              </div>
            </div>
          </div>

          {/* Team — updated to include "We're Hiring" card */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Team</h2>
            <p className="mt-3 text-slate-600">
              A compact team of firmware, hardware, cloud and product engineers. We partner with certified installers for deployments — and we're growing.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center items-center max-w-5xl mx-auto">

              {/* Founder cards from TEAM */}
              {TEAM.map((p) => (
                <TeamCard key={p.name} name={p.name} subtitle={p.subtitle} role={p.role} img={p.img} linkedin={p.linkedin} />
              ))}

              {/* Hiring / Join us card */}
              
            </div>
          </div>

          {/* Partnerships, Press, Contact CTA */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 items-stretch">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">Partners</h4>
              <p className="mt-2 text-slate-600">We work with local installers and select hardware partners for supply and installation.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">Press</h4>
              <p className="mt-2 text-slate-600">For press inquiries, email <a className="text-sky-600" href="mailto:press@aquaminder.example">press@aquaminder.example</a>.</p>
            </div>

            <div className="p-6 bg-sky-50 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-semibold">Get in touch</h4>
                <p className="mt-2 text-slate-600">Interested in pilots, integrations or reseller partnerships? Reach out and we'll reply within 2 business days.</p>
              </div>

              <div className="mt-4">
                <Link href="/contact" className="px-4 py-2 bg-sky-600 text-white rounded-md">Contact sales</Link>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-20 bg-white p-8 rounded-lg text-center shadow-sm">
            <h3 className="text-xl font-semibold">Want to test an AquaMinder at your home?</h3>
            <p className="mt-2 text-slate-600">Apply for a pilot or request a demo from our team.</p>
            <div className="mt-4">
              <Link href="/contact" className="px-5 py-2 bg-sky-600 text-white rounded-md">Request a demo</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
