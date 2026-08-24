"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LoginModal from "./LoginModal";
import api from "../../lib/Axios";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "✦",
    title: "Train With Your Business",
    description:
      "Give your business information, FAQs, services and policies. Your AI agent learns from your content.",
  },
  {
    icon: "⚡",
    title: "Instant Customer Support",
    description:
      "Let your customers get instant answers without waiting for your support team.",
  },
  {
    icon: "◎",
    title: "Works 24/7",
    description:
      "Your AI support agent stays available around the clock, even when your team is offline.",
  },
  {
    icon: "⌘",
    title: "Easy Website Integration",
    description:
      "Add your AI support agent to your website with a simple script.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Add your business details, services, FAQs, policies and important information.",
  },
  {
    number: "02",
    title: "Create your AI agent",
    description:
      "Our AI turns your business knowledge into a customer support agent.",
  },
  {
    number: "03",
    title: "Add it to your website",
    description:
      "Copy one small script and your AI support assistant is ready for customers.",
  },
];

const businesses = [
  "E-commerce",
  "Restaurants",
  "SaaS",
  "Healthcare",
  "Education",
  "Local Business",
];

type User = {
  email: string;
};

export default function HomeScreen() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      setLoginOpen(true);
    }
  };

  
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/auth/getMe");
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logOut");
      setUser(null); 
      setOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    fetchUser(); 
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F3F4F4] text-black">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
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

        <div className="hidden items-center gap-8 text-sm text-zinc-800 md:flex">
          <a href="#features" className="transition hover:text-emerald-400">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-emerald-400">
            How it works
          </a>
          <a href="#businesses" className="transition hover:text-emerald-400">
            Businesses
          </a>
        </div>

        <div className="flex items-center gap-3  ">
          {isLoading ? (
            // Skeleton placeholder instead of blocking the whole page
            <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-300 "  />
          ) : user?.email ? (
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                {user.email.charAt(0).toUpperCase()}
              </button>

              {open && (
                <div className="absolute right-0 top-12 z-50 mt-1 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="mb-1 border-b border-zinc-100 px-3 py-2">
                    <p className="text-xs text-zinc-500">Signed in as</p>
                    <p className="truncate text-sm font-medium text-black">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 cursor-pointer"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-sm text-black-300"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Turn your business knowledge into an AI Support Agent
            </motion.div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Your business. Your knowledge. Your AI agent.{" "}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Tell us about your business and let AI handle your customer
              conversations 24/7.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleClick}
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black bg-black/[0.03] transition hover:bg-zinc-200 cursor-pointer"
              >
                {user ? "Go to Dashboard" : "Create your AI agent"}
                <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }}>
                  →
                </motion.span>
              </button>

              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-xl border border-black/10 bg-black/[0.03] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/[0.07]"
              >
                See demo
              </a>
            </div>

            <div className="mt-8 flex items-center gap-5 text-xs text-zinc-500">
              <span>✓ No credit card required</span>
              <span>✓ Setup in minutes</span>
            </div>
          </motion.div>

          {/* AI CHAT PREVIEW */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto max-w-md"
            >
              <div className="absolute inset-0 -z-10 rounded-[30px] bg-grey-500/20 blur-3xl" />

              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#F9F6F3] shadow-2xl shadow-black">
                <div className="flex items-center justify-between border-b bg-black border-white/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br bg-[#F5C9B0] text-white">
                      ✦
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0d0d0f] bg-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        SupportAI
                      </p>
                      <p className="text-xs text-emerald-400">
                        Online · AI Assistant
                      </p>
                    </div>
                  </div>
                  <span className="text-zinc-500">•••</span>
                </div>

                <div className="space-y-5 p-5 text-black">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-zinc-900"
                  >
                    Hi! 👋 I'm the AI assistant for Acme Store. How can I help
                    you today?
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-black px-4 py-3 text-sm leading-6 text-white"
                  >
                    Do you offer same-day delivery?
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-zinc-900"
                  >
                    Yes! We offer same-day delivery for orders placed before
                    2:00 PM within our service area.
                  </motion.div>
                </div>

                <div className="border-t border-black/10 p-4">
                  <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3">
                    <span className="text-sm text-zinc-600">
                      Ask anything...
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C9B0] border-black/10 text-black">
                      ↑
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 sm:flex-row lg:px-8">
          <p className="text-sm text-zinc-500">
            Built for businesses that care about their customers.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-zinc-600 sm:gap-8">
            <span>24/7 SUPPORT</span>
            <span>AI POWERED</span>
            <span>EASY INTEGRATION</span>
            <span>NO CODE</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium text-violet-400">
            POWERFUL SUPPORT
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your AI agent needs.
          </h2>
          <p className="mt-4 text-zinc-400">
            Give your customers instant answers while reducing repetitive
            support work for your team.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-white/10 bg-[#DDDDDD] p-6 transition hover:border-white/20 hover:bg-[#E9E3DF]"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                {feature.icon}
              </div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-sm font-medium text-violet-400">
              SIMPLE SETUP
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              From business information to AI support.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              No complicated setup. Just give your AI agent the knowledge it
              needs and put it on your website.
            </p>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-white/10 md:block" />
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#090909] text-sm font-semibold text-violet-400"
                >
                  {step.number}
                </motion.div>
                <h3 className="mt-7 font-medium">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPT INTEGRATION */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-sm font-medium text-blue-400">ONE SCRIPT</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Add AI support to your website in minutes.
            </h2>
            <p className="mt-5 leading-7 text-zinc-500">
              Once your AI agent is ready, simply copy one script into your
              website. Your customers can immediately start chatting with your
              AI support assistant.
            </p>
            <button
                onClick={handleClick}
                  className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 cursor-pointer"
              >
                {user ? "Go to Dashboard" : "Create your agent "}
                <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }}>
                  →
                </motion.span>
              </button>
         
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-[#0b0b0d] p-5"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
            </div>

            <pre className="overflow-x-auto text-xs leading-7 text-zinc-400">
              <code>{`<!-- SupportAI -->

<script
  src="https://cdn.supportai.com/widget.js"
  data-agent-id="your-agent-id"
></script>`}</code>
            </pre>

            <div className="mt-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-400">
              ✓ AI support widget ready
            </div>
          </motion.div>
        </div>
      </section>

      {/* BUSINESSES */}
      <section id="businesses" className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-violet-400">
              BUILT FOR EVERY BUSINESS
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              One AI agent. Any business.
            </h2>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {businesses.map((business, index) => (
              <motion.div
                key={business}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-400"
              >
                {business}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="px-5 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-6 py-16 text-center sm:px-10"
        >
          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

          <div className="relative">
            <p className="text-sm font-medium text-violet-400">
              READY TO AUTOMATE?
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Let AI handle your repetitive support questions.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-zinc-500">
              Create your AI support agent and give your customers a faster way
              to get help.
            </p>
            
             <button
                onClick={handleClick}
                className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 cursor-pointer"
              >
                {user ? "Go to Dashboard" : " Build your AI Agent"}
                <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }}>
                  →
                </motion.span>
              </button>
             
        
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm text-zinc-600 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs text-black">
              ✦
            </div>
            <span>SupportAI</span>
          </div>
          <p>© 2026 SupportAI. All rights reserved.</p>
        </div>
      </footer>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </main>
  );
}