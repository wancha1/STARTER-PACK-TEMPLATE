import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { X, LogIn, Mail, Lock, User, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { 
    loginCustomerWithEmail, 
    signUpCustomerWithEmail, 
    loginCustomerWithGoogle,
    customerUser 
  } = useCart();

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await loginCustomerWithEmail(email, password);
        setSuccess("Welcome back! Synchronizing catalog...");
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1500);
      } else {
        if (password.length < 6) {
          throw new Error("Password must stand at least 6 characters for safety.");
        }
        await signUpCustomerWithEmail(email, password, name);
        setSuccess("Success! Account created and verified.");
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      let localizedError = err.message || "Authentication attempt failed.";
      if (err.code === "auth/email-already-in-use") {
        localizedError = "This email is already registered here. Try logging in.";
      } else if (err.code === "auth/invalid-credential") {
        localizedError = "Incorrect password or details. Try again.";
      } else if (err.code === "auth/user-not-found") {
        localizedError = "No account found with this email. Please sign up.";
      }
      setError(localizedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      await loginCustomerWithGoogle();
      setSuccess("Google Authentication Complete!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020205]/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          id="customer-auth-modal"
          className="relative w-full max-w-md bg-[#090915] border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl"
        >
          {/* Accent lighting effect */}
          <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/4 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center select-none">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-white tracking-tight">
              Customer Identity Desk
            </h3>
            <p className="text-[11px] text-slate-400 font-light mt-1 max-w-xs mx-auto">
              Unlock synchronized order invoicing, personalized gadget comparison tracking, and seamless live showroom catalogs.
            </p>
          </div>

          {/* Tab Selection Switcher */}
          <div className="flex bg-[#030308] border border-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Dynamic feedback messages */}
          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2 text-left"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-light leading-normal">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2 text-left"
              >
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-normal">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {activeTab === "signup" && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#030308] border border-white/10 hover:border-white/20 transition-colors text-xs text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. buyer@apex.co.ug"
                  className="w-full bg-[#030308] border border-white/10 hover:border-white/20 transition-colors text-xs text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                Passphrase Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#030308] border border-white/10 hover:border-white/20 transition-colors text-xs text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.01] transition-all duration-200 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>{isLoading ? "Validating Account..." : activeTab === "login" ? "Sign In Credentials" : "Submit Account Key"}</span>
            </button>
          </form>

          {/* Social Sign-In Splitter */}
          <div className="relative flex py-4 items-center select-none">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-3 text-[8px] text-slate-500 font-mono uppercase font-bold tracking-widest">
              or connect instant auth
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleClick}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#090915] font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google Core Identity Sync</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
