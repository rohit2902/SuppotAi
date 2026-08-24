"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();

  // 1. Form State
  const [formData, setFormData] = useState({
    businessName: "",
    supportEmail: "",
    knowledge: "",
  });
  const [hasBusiness, setHasBusiness] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 2. Loading & UI States
  const [isFetching, setIsFetching] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [message, setMessage] = useState({ type: "", text: "" }); // Success/Error messages

 
 

 
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post("/api/business/create", formData);
      setMessage({ type: "success", text: "Business details saved successfully!" });
      
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to save details." 
      });
    } finally {
      setIsSaving(false);
    }
  };
   useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get("/api/business/get");

        if (response.data?.business) {
          setFormData(response.data.business);
          setUserId(response.data.business.ownerId || "");
         
        }
      } catch (error) {
        console.log("No existing business data found.");
      } finally {
         setHasBusiness(true);
        setIsFetching(false);
      }
    };

    fetchBusinessData();
  }, []);

  const handleEmbeddedClick = ()=>{
         if(hasBusiness && userId){
          router.push(`/embaded?userId=${userId}`);
         }else{
          alert("Please save your Business Configuration first before accessing the embedded link.");
         }
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-zinc-700">
      
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-zinc-200 to-white text-black shadow-lg"
          >
            ✦
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-zinc-100">
            SupportAI
          </span>
        </Link>

       <button 
          onClick={handleEmbeddedClick}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-all 
            ${hasBusiness 
              ? "bg-white/10 text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer" 
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" // Disabled look agar business nahi hai
            }`}
        >
          Embedded Link
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mt-8 flex justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-2xl shadow-black/50 sm:p-12"
        >
          {isFetching ? (

            <div className="animate-pulse space-y-6">
              <div className="h-8 w-1/3 rounded-lg bg-zinc-200"></div>
              <div className="h-4 w-1/2 rounded-lg bg-zinc-100"></div>
              <div className="mt-10 h-12 w-full rounded-xl bg-zinc-100"></div>
              <div className="h-12 w-full rounded-xl bg-zinc-100"></div>
              <div className="h-40 w-full rounded-xl bg-zinc-100"></div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  Business Configuration
                </h1>
                <p className="mt-2 text-base text-zinc-500">
                  Set up your business details to train your AI support agent.
                </p>
              </div>

              {/* Business Details Section */}
              <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  Basic Details
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Maurya Coaching Center"
                      required
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Support Email</label>
                    <input
                      type="email"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleInputChange}
                      placeholder="support@yourbusiness.com"
                      required
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Knowledge Base Section */}
              <div className="mb-10">
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                    Knowledge Base
                  </h2>
                </div>
                <p className="mb-4 text-sm text-zinc-500">
                  Add your FAQs, return policies, and general info. The AI will use this to answer customers.
                </p>
                <textarea
                  name="knowledge"
                  value={formData.knowledge}
                  onChange={handleInputChange}
                  required
                  className="h-56 w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                  placeholder={`Example:\n• Refund policy: 7 days return available\n• Delivery time: 3-5 working days\n• Cash on Delivery available`}
                />
              </div>

              {/* Messages & Submit Button */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                
                {/* Success/Error Message display */}
                <div className="text-sm">
                  <AnimatePresence>
                    {message.text && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <span className={message.type === "error" ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                          {message.text}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-black px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Configuration"
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}