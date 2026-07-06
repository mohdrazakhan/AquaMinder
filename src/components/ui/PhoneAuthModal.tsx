"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA", flag: "🇺🇸/🇨🇦" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
];

export default function PhoneAuthModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India based on context
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  // To track if recaptcha is initialized to prevent duplicates
  const recaptchaInitialized = useRef(false);

  useEffect(() => {
    // When modal closes, clean up the recaptcha verifier to prevent "element removed" errors
    if (!isOpen) {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = null;
      }
      recaptchaInitialized.current = false;
      return;
    }

    // Reset state when modal opens
    setStep("PHONE");
    setPhoneNumber("");
    setOtp("");
    setError(null);
    setLoading(false);
    
    // Initialize recaptcha after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initRecaptcha();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const initRecaptcha = async () => {
    if (recaptchaInitialized.current || typeof window === "undefined") return;
    
    try {
      // Clean up any existing broken verifiers just in case
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch(e) {}
      }

      const { getAuth, RecaptchaVerifier } = await import("firebase/auth");
      const { getClientApp } = await import("@/lib/firebase");
      const auth = getAuth(getClientApp());
      
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        "expired-callback": () => {
           setError("reCAPTCHA expired. Please try again.");
        }
      });
      recaptchaInitialized.current = true;
    } catch (err) {
      console.error("Recaptcha Init Error", err);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const { getAuth, signInWithPhoneNumber } = await import("firebase/auth");
      const { getClientApp } = await import("@/lib/firebase");
      const auth = getAuth(getClientApp());
      
      const appVerifier = (window as any).recaptchaVerifier;
      
      // Combine country code and phone number, stripping any spaces
      const formattedPhone = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("OTP");
    } catch (err: any) {
      console.error("SMS Error", err);
      setError(getFirebaseErrorMessage(err));
      
      // Reset recaptcha on error so they can try again
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    
    setError(null);
    setLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("OTP Error", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {step === "PHONE" ? "Continue with Phone" : "Verify Phone"}
        </h2>
        
        <p className="text-sm text-slate-600 mb-6">
          {step === "PHONE" 
            ? "Enter your phone number to receive a secure one-time password." 
            : `We sent a 6-digit code to ${countryCode} ${phoneNumber}.`}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 p-3 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-1/3 border border-slate-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 bg-white cursor-pointer appearance-none"
                  style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.country} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-2/3 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-center text-xl tracking-[0.5em] font-mono text-slate-900"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            
            <button
              type="button"
              onClick={() => setStep("PHONE")}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Back to edit phone number
            </button>
          </form>
        )}

        {/* Firebase Recaptcha Container */}
        <div id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  );
}
