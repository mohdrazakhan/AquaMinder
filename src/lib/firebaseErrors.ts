// src/lib/firebaseErrors.ts

export function getFirebaseErrorMessage(err: any): string {
  if (!err) return "An unknown error occurred. Please try again.";

  const message = err.message || err.toString();
  
  if (message.includes("auth/invalid-credential") || message.includes("auth/user-not-found") || message.includes("auth/wrong-password")) {
    return "Invalid email or password. Please try again.";
  }
  if (message.includes("auth/email-already-in-use")) {
    return "An account with this email already exists.";
  }
  if (message.includes("auth/weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (message.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (message.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Please wait a moment and try again.";
  }
  if (message.includes("auth/invalid-verification-code")) {
    return "The verification code is incorrect. Please double check and try again.";
  }
  if (message.includes("auth/code-expired")) {
    return "The verification code has expired. Please request a new one.";
  }
  if (message.includes("auth/captcha-check-failed") || message.includes("auth/invalid-app-credential")) {
    return "Security verification failed. Please refresh the page and try again.";
  }

  // Fallback for unexpected firebase errors
  if (message.includes("Firebase:")) {
    return "Authentication failed. Please try again later.";
  }

  return typeof err === 'string' ? err : "An unexpected error occurred. Please try again.";
}
