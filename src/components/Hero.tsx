import React, { useState, useEffect } from "react";
import { ArrowRight, MessageSquare, BadgeCheck, Zap, Laptop, Clock, Smartphone, Tv, Gamepad2, Headphones, Shield, HelpCircle, Gift } from "lucide-react";
import { BUSINESS_INFO } from "../data";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

export default function Hero() {
  const { activeCategory, setActiveCategory } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeStr, setTimeStr] = useState("07:21:10");

  useEffect(() => {
    // Show current local time nice and clean
    const updateTime = () => {
      const ugTime = new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 180) * 60000);
      const hours = String(ugTime.getHours()).padStart(2, "0");
      const minutes = String(ugTime.getMinutes()).padStart(2, "0");
      const seconds = String(ugTime.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds}`);
    };
    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  // Premium blue/purple/indigo sliding promotions
  const slides = [
    {
      title: "APEX PREMIER SAVINGS",
      tagline: "High-End Gadgets & Top Deals",
      description: "Discover verified genuine flagship electronics in Uganda. Brand new sealed smartphones, official Apple MacBooks, and high-performance headsets with full warranties.",
      accentText: "Phones Super Week",
      cta: "Explore Tech Deals",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      color: "from-blue-600 to-indigo-800",
      badge: "SAME-DAY DELIVERY"
    },
    {
      title: "OFFICIAL BRANDS EXTRAVAGANZA",
      tagline: "Ultra high-speed M3 Laptops",
      description: "Empower your corporate office or design workflow. Premium metal chassis business notebooks pre-packaged with free waterproof cases and local office suites.",
      accentText: "Save up to 600K UGX",
      cta: "Browse Computing",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      color: "from-blue-600 to-indigo-700",
      badge: "OFFICIAL WARRANTY"
    },
    {
      title: "HOME CINEMA & GAMING BUNDLES",
      tagline: "4K Frameless Screens & PS5 Consoles",
      description: "Transform your living room or entertainment lounge. Get same-day mounting layouts with digital surge protectors and multiple titles preloaded free.",
      accentText: "Limited Stock Units",
      cta: "Explore Home Tech",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      color: "from-purple-600 to-indigo-800",
      badge: "FREE WALL MOUNT"
    }
  ];

  // Auto-rotate carousel slides like Jumia's main page slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleWhatsAppConsultation = (customProductText = "") => {
    const defaultMsg = encodeURIComponent(
      customProductText 
        ? `Hi ${BUSINESS_INFO.name}! I am browsing your Jumia-style online storefront and want to secure stock availability for: ${customProductText}`
        : `Hello ${BUSINESS_INFO.name}! 👋 I am browsing your online e-commerce catalog for Lira, Uganda. I am looking to place a secure order with express doorstep dispatch!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${defaultMsg}`, "_blank");
  };

  const categoriesList = [
    { name: "Phones", label: "Smartphones & Tablets", icon: Smartphone },
    { name: "Laptops", label: "Computing & Business", icon: Laptop },
    { name: "TVs & Audio", label: "Smart screens & Sound", icon: Tv },
    { name: "Gaming", label: "Consoles & Controllers", icon: Gamepad2 },
    { name: "Accessories", label: "Caretags & Chargers", icon: Headphones }
  ];

  const handleCategoryChoice = (categoryName: string) => {
    setActiveCategory(categoryName);
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-24 md:pt-32 pb-12 bg-[#020205] overflow-hidden"
    >
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-[-5%] w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Jumia Style Retail Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* 1. Left Sidebar: Jumia-style Categories Directory */}
          <div className="hidden lg:col-span-3 lg:flex flex-col bg-neutral-950/80 border border-white/5 rounded-2xl p-4 text-left justify-between min-h-[400px]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block mb-3 px-2">
                STORE DEPARTMENTS
              </span>
              {categoriesList.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChoice(cat.name)}
                    className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all cursor-pointer text-left ${
                      isSelected 
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" 
                        : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight">{cat.name}</div>
                      <div className="text-[9px] text-slate-500 truncate leading-none mt-0.5">{cat.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-4 mt-4 px-2 select-none">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  Verified Seller Protection
                </span>
              </div>
              <p className="text-[9px] text-slate-500 leading-normal font-sans">
                100% Genuine, sealed boxes only. Secure Mobile Money escrow refund flows.
              </p>
            </div>
          </div>

          {/* 2. Middle Column: Jumia-style Main Promotion Banner Carousel */}
          <div className="col-span-1 lg:col-span-7 relative bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden min-h-[350px] md:min-h-[440px] flex flex-col justify-end p-6 md:p-10 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0 z-0 flex items-center justify-center"
              >
                {/* Image overlay backdrop with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent z-10`} />
                <img
                  src={slides[currentSlide].image}
                  className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
                  alt=""
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 max-w-xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[9px] font-mono font-extrabold bg-blue-500 text-white rounded uppercase tracking-wider">
                  {slides[currentSlide].badge}
                </span>
                <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 rounded uppercase tracking-wider">
                  LIRA OUTLET DEAL
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {slides[currentSlide].title}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
                  {slides[currentSlide].tagline}
                </h2>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed font-sans max-w-lg">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => handleWhatsAppConsultation(slides[currentSlide].title + " - " + slides[currentSlide].tagline)}
                  className="px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-500/15"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>{slides[currentSlide].cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCategoryChoice(categoriesList[currentSlide % categoriesList.length].name)}
                  className="px-5 py-3.5 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center"
                >
                  Quick Show Store
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute right-5 bottom-5 z-10 flex gap-1.5 bg-black/40 backdrop-blur-sm py-1.5 px-3 rounded-full border border-white/5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? "bg-blue-500 scale-125 w-3" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 3. Right Sidebar: Quick Help & Express Services Widgets */}
          <div className="col-span-1 lg:col-span-2 flex flex-col justify-between gap-3">
            
            {/* Widget 1: Fast Delivery Tracker */}
            <div className="bg-neutral-950/80 border border-white/5 rounded-2xl p-4 text-left flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-slate-500 font-bold block">
                    FAST SHIPPING
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Express Dispatch</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-sans">
                  Doorstep shipping within 3 hours directly in Lira.
                </p>
              </div>
              <div className="mt-3 bg-white/3 border border-white/5 p-2 rounded-xl flex items-center justify-between font-mono text-[9px] text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Time:</span>
                </span>
                <span className="font-semibold text-emerald-400">{timeStr} EAT</span>
              </div>
            </div>

            {/* Widget 2: Escrow Money refund flow */}
            <div className="bg-neutral-950/80 border border-white/5 rounded-2xl p-4 text-left flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider uppercase text-slate-500 font-bold block mb-2">
                  100% SECURE PAY
                </span>
                <h4 className="text-xs font-bold text-white mb-1">Mobile Money Escrow</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-sans">
                  Pay upon secure physical delivery. Immediate verification and exchange.
                </p>
              </div>
              <div className="mt-2 text-[9px] text-slate-500 uppercase tracking-tight flex items-center gap-1.5 bg-neutral-900 border border-white/5 p-1.5 rounded-lg font-mono">
                <span className="text-blue-400">✓</span> MTNi / Airtel Cash Cards
              </div>
            </div>

            {/* Widget 3: Live Hotline Help */}
            <div className="bg-gradient-to-tr from-blue-500/10 to-purple-600/10 border border-white/5 rounded-2xl p-4 text-left flex-1 flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[9px] font-mono tracking-wider uppercase text-blue-400 font-bold block mb-1">
                  NEED HELP?
                </span>
                <h4 className="text-xs font-bold text-white mb-1">Talk to Lira Team</h4>
                <p className="text-[10px] text-slate-400 leading-tight font-sans">
                  Reach out directly to place wholesale orders.
                </p>
              </div>
              <button 
                onClick={() => handleWhatsAppConsultation()}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-[10px] font-mono font-bold text-white rounded-xl hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
              >
                Inquire Hotline
              </button>
            </div>

          </div>

        </div>

        {/* Quick horizontal benefits banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 bg-neutral-950/30 border border-white/5 rounded-2xl p-4 text-left sm:text-center select-none font-sans">
          <div className="flex items-center gap-2 md:justify-center">
            <BadgeCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-300">Verified Brand Sealed</span>
          </div>
          <div className="flex items-center gap-2 md:justify-center">
            <Zap className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-300">Same-Day Lira Delivery</span>
          </div>
          <div className="flex items-center gap-2 md:justify-center">
            <Gift className="w-5 h-5 text-pink-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-300">Free Premium Accessories</span>
          </div>
          <div className="flex items-center gap-2 md:justify-center">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-300">24/7 WhatsApp Ordering</span>
          </div>
        </div>

      </div>
    </section>
  );
}
