"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";


function EmbedContent() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true); 
  
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useRouter();

  const embedCode = `  <script 
        src="https://suppot-ai-pied.vercel.app/chatBot.js" 
         data-owner-id ="${userId}" >
     </script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <div
            className="cursor-pointer text-lg font-semibold"
            onClick={() => navigate.push("/")}
          >
            Support<span className="text-zinc-400">AI</span>
          </div>

          {/* BACK TO DASHBOARD BUTTON */}
          <button
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
            onClick={() => navigate.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex justify-center px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl rounded-2xl bg-white p-10 shadow-xl border border-zinc-100"
        >
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
            Embed ChatBot
          </h1>
          <p className="mb-6 text-zinc-500">
            Copy and paste this code right before the closing{" "}
            <code>&lt;/body&gt;</code> tag of your website.
          </p>

          {/* CODE BLOCK CONTAINER */}
          <div className="relative mb-10 overflow-hidden rounded-xl bg-zinc-900 text-zinc-100 p-5 text-sm font-mono shadow-inner border border-zinc-800">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
                ${
                  copied
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
            >
              {copied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Copy Code
                </>
              )}
            </button>

            {/* Actual Code Display */}
            <pre className="overflow-x-auto pt-6 text-emerald-400">
              {userId ? embedCode : "Loading your unique embed code..."}
            </pre>
          </div>
          <ol className="space-y-3 text-sm text-zinc-600 list-decimal list-inside">
            <li>Copy the embed script</li>
            <li>Paste it before the closing body tag</li>
            <li>Reload your website</li>
          </ol>

          <div className="rounded-xl border border-zinc-300 bg-white shadow-md overflow-hidden mt-2">
            <div className="flex items-center gap-2 px-4 h-9 bg-zinc-100 border-b border-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />

              <span className="ml-4 text-xs text-zinc-500">
                Your-website.com
              </span>
            </div>

            <div className="relative h-64 sm:h-72 p-6">
              <p className="text-zinc-400 text-sm">Your website goes here</p>

              <div className="mt-4">
                <p className="text-zinc-600 text-sm">
                  Add the SupportAI chatbot on your website.
                </p>
                
                {isOpen && (
                  <div className="absolute bottom-24 right-6 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-black text-white text-xs px-3 py-2 flex justify-between items-center">
                      <span>Customer Support</span>
                      <span className="cursor-pointer" onClick={() => setIsOpen(false)}>×</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-3 space-y-2 bg-zinc-50">
                      <div className="bg-zinc-200 text-zinc-800 text-xs px-3 py-2 rounded-lg w-fit">
                        Hi! How can I help you?
                      </div>

                      <div className="bg-black text-white text-xs px-3 py-2 rounded-lg ml-auto w-fit">
                        What is the return policy?
                      </div>

                      <div className="bg-zinc-200 text-zinc-800 text-xs px-3 py-2 rounded-lg w-fit">
                        Our return policy allows returns within 30 days.
                      </div>
                    </div>
                  </div>
                )}
                
                <motion.div
                  onClick={() => setIsOpen(!isOpen)}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                  }}
                  className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-2xl cursor-pointer text-white"
                >
                  💬
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 2. Wrap it all in Suspense in your default export
export default function Page() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500">
          Loading embed details...
        </div>
      }
    >
      <EmbedContent />
    </Suspense>
  );
}