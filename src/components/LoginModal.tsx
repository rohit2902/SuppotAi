"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import api from "../../lib/Axios";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      onSuccess();
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log("register successful:", response.data);
      onSuccess();
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKGROUND */}
          <motion.div
            className="absolute inset-0 bg-gray-250/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* GLOW */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black-500/20 blur-[120px]" />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#D8D2C2] shadow-2xl shadow-blue-950/50"
          >
            <div className="absolute left-1/2 top-[-100px] h-[200px] w-[300px] -translate-x-1/2 rounded-full bg-black-600/20 blur-[80px]" />

            <div className="relative p-7 sm:p-8">
              {/* CLOSE */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-zinc-500 transition hover:bg-white hover:text-black cursor-pointer"
                aria-label="Close login"
              >
                ×
              </button>

              {/* LOGO */}
              <Link href="/" className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5C9B0] text-black"
                >
                  ✦
                </motion.div>
                <span className="text-lg font-semibold tracking-tight">
                  SupportAI
                </span>
              </Link>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold tracking-tight text-black mt-4">
                {step === 2 ? "Create an account" : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {step === 2
                  ? "Sign up to start building your AI customer support agent."
                  : "Login to manage your AI customer support agent."}
              </p>

              {/* LOGIN FORM */}
              {step === 1 && (
                <form onSubmit={handleLogin} className="mt-7 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none placeholder:text-zinc-600 transition focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-black outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div style={{ color: "red" }} className="text-sm">
                      {error}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Logging in...
                      </>
                    ) : (
                      "Login →"
                    )}
                  </motion.button>
                </form>
              )}

              {/* REGISTER FORM */}
              {step === 2 && (
                <form onSubmit={handleRegister} className="mt-7 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      required
                      placeholder="enter your name"
                      className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none placeholder:text-zinc-600 transition focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none placeholder:text-zinc-600 transition focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                 <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 pr-12 text-sm text-black outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div style={{ color: "red" }} className="text-sm">
                      {error}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </>
                    ) : (
                      "Create account →"
                    )}
                  </motion.button>
                </form>
              )}

              {/* DIVIDER */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-zinc-600">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* GOOGLE */}
              {/* <button
                onClick={() => signIn("google")}
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white text-sm font-medium text-black transition cursor-pointer"
              >
                <span className="text-base">G</span>
                Continue with Google
              </button> */}

              {/* TOGGLE LOGIN/REGISTER */}
              <p className="mt-7 text-center text-sm text-zinc-500">
                {step === 2
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(step === 2 ? 1 : 2);
                  }}
                  className="font-medium text-blue-400 transition hover:text-blue-300 cursor-pointer"
                >
                  {step === 2 ? "Log in" : "Create account"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
