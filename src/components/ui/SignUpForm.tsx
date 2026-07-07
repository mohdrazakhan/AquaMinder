// src/components/ui/SignUpForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialLoginButtons from "./SocialLoginButtons";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";

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

export default function SignUpForm() {
  const router = useRouter();
  
  // Form Details State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Step & Flow State
  const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const recaptchaInitialized = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      initRecaptcha();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const initRecaptcha = async () => {
    if (recaptchaInitialized.current || typeof window === "undefined") return;
    try {
      if ((window as any).signupRecaptchaVerifier) {
        try { (window as any).signupRecaptchaVerifier.clear(); } catch(e) {}
      }
      const { getAuth, RecaptchaVerifier } = await import("firebase/auth");
      const { getClientApp } = await import("@/lib/firebase");
      const auth = getAuth(getClientApp());
      
      (window as any).signupRecaptchaVerifier = new RecaptchaVerifier(auth, "signup-recaptcha-container", {
        size: "invisible",
        "expired-callback": () => setError("reCAPTCHA expired. Please try again.")
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
      
      const appVerifier = (window as any).signupRecaptchaVerifier;
      const formattedPhone = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("OTP");
    } catch (err: any) {
      console.error("SMS Error", err);
      setError(getFirebaseErrorMessage(err));
      
      if ((window as any).signupRecaptchaVerifier) {
        (window as any).signupRecaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    
    setError(null);
    setLoading(true);
    
    try {
      // 1. Verify OTP -> signs the user in via Phone Auth
      const userCredential = await confirmationResult.confirm(otp);
      
      // 2. Link Email & Password credential to this new Phone account
      const { EmailAuthProvider, linkWithCredential, updateProfile } = await import("firebase/auth");
      const credential = EmailAuthProvider.credential(email, password);
      
      try {
        await linkWithCredential(userCredential.user, credential);
      } catch (linkError: any) {
        // If email is already in use, delete the phone user we just created so it's not orphaned.
        if (linkError.code === 'auth/credential-already-in-use' || linkError.code === 'auth/email-already-in-use') {
          await userCredential.user.delete();
          throw new Error("This email is already in use by another account. Please log in.");
        }
        throw linkError;
      }
      
      // 3. Update Display Name
      if (displayName.trim()) {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration Error", err);
      setError(err.message || getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-red-600 p-3 bg-red-50 border border-red-100 rounded">{error}</div>}

      {step === "DETAILS" ? (
        <form onSubmit={handleSendCode} className="space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="Create a secure password (6+ chars)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3 border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white cursor-pointer"
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
                className="w-2/3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
          </div>

          <div className="pt-4 space-y-5">
            <button
              type="submit"
              disabled={loading || !phoneNumber || !email || !password || !displayName}
              className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 disabled:opacity-60 font-bold shadow-sm transition-colors"
            >
              {loading ? "Sending verification..." : "Continue"}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-4 text-sm text-slate-600">
              <a href="/login" className="hover:text-slate-900 hover:underline transition-colors">
                Already have an account? <span className="font-semibold text-slate-900">Log in</span>
              </a>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister} className="space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium mb-2 text-center text-slate-600">
              Enter the 6-digit code sent to {countryCode} {phoneNumber}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 text-center text-xl tracking-[0.5em] font-mono text-slate-900"
            />
          </div>
          
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating Account..." : "Verify & Create Account"}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep("DETAILS");
                setOtp("");
                setError(null);
              }}
              disabled={loading}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Back to edit details
            </button>
          </div>
        </form>
      )}
      
      {/* Firebase Recaptcha Container */}
      <div id="signup-recaptcha-container" className="mt-2"></div>
      
      {step === "DETAILS" && <SocialLoginButtons />}
    </div>
  );
}
