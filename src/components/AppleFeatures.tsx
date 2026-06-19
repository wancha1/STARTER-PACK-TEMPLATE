import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2, 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  BadgeCheck, 
  CheckCircle, 
  Zap, 
  Scale, 
  RefreshCw, 
  Trophy, 
  ChevronRight, 
  X, 
  Cpu, 
  HardDrive, 
  Compass,
  DollarSign,
  MessageSquare
} from "lucide-react";
import { PRODUCTS, BUSINESS_INFO } from "../data";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

// Questions for the Apple-style "Which Flagship is Right for You?" Wizard
interface QuizAnswer {
  purpose: string;
  eco: string;
  budget: "low" | "medium" | "high";
}

// Old device appraisal configurations
const TRADE_IN_BRANDS = [
  { name: "Apple iPhone 14 / Pro Series", baseValue: 2400000 },
  { name: "Apple iPhone 13 / Pro Series", baseValue: 1800000 },
  { name: "Apple iPhone 11 / 12 Series", baseValue: 1100000 },
  { name: "Samsung Galaxy S22 / S23 Ultra", baseValue: 2100000 },
  { name: "Samsung Galaxy Note / S21 Series", baseValue: 1200000 },
  { name: "Older iPhone (X/XS/XR/8)", baseValue: 600000 },
  { name: "Premium HP / Dell Core i7 Laptop", baseValue: 1300000 },
  { name: "HP / Lenovo Standard Student Laptop", baseValue: 700000 },
  { name: "Huawei / Xiaomi Android Flagship", baseValue: 900000 },
  { name: "Techno / Infinix / Itel Phone", baseValue: 350000 }
];

export default function AppleFeatures() {
  const { addToCart, setSelectedQuickViewProduct, compareList, toggleCompare, clearCompare } = useCart();

  // Active Main Subcategory inside Apple Hub
  const [activeSubSection, setActiveSubSection] = useState<"matcher" | "tradein" | "compare">("matcher");

  // --- 1. QUIZ MATCHER STATE ---
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>({
    purpose: "creative",
    eco: "apple",
    budget: "high"
  });
  const [quizResult, setQuizResult] = useState<any>(null);
  const [matchScore, setMatchScore] = useState(100);

  // --- 2. TRADE-IN STATE ---
  const [tradeBrandIndex, setTradeBrandIndex] = useState(0);
  const [tradeCondition, setTradeCondition] = useState<"flawless" | "good" | "fair">("good");
  const [selectedTargetProduct, setSelectedTargetProduct] = useState(PRODUCTS[0].id);

  // --- 3. COMPARISON PANEL STATE ---
  const [compareCompId1, setCompareCompId1] = useState(PRODUCTS[0].id);
  const [compareCompId2, setCompareCompId2] = useState(PRODUCTS[1].id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Run matching logic when quiz completed
  const processMatch = () => {
    let bestProduct = PRODUCTS[0];
    let topScore = 0;

    PRODUCTS.forEach((product) => {
      let score = 50; // baseline score

      // 1. Purpose Match
      if (quizAnswers.purpose === "creative") {
        if (product.category === "Phones" && (product.id.includes("pro-max") || product.id.includes("s24"))) score += 30;
        if (product.id.includes("macbook")) score += 20;
      } else if (quizAnswers.purpose === "office") {
        if (product.category === "Laptops") score += 30;
        if (product.id.includes("s24") || product.id.includes("pro-max")) score += 15;
      } else if (quizAnswers.purpose === "gaming") {
        if (product.category === "Gaming") score += 40;
        if (product.id.includes("macbook") || product.id.includes("s24")) score += 15;
      } else if (quizAnswers.purpose === "media") {
        if (product.category === "TVs & Audio" || product.id.includes("airpods")) score += 45;
      }

      // 2. Ecosystem Match
      if (quizAnswers.eco === "apple") {
        if (product.name.toLowerCase().includes("apple") || product.name.toLowerCase().includes("macbook") || product.name.toLowerCase().includes("airpods") || product.name.toLowerCase().includes("iphone")) {
          score += 25;
        }
      } else if (quizAnswers.eco === "android") {
        if (product.name.toLowerCase().includes("samsung") || product.name.toLowerCase().includes("galaxy")) {
          score += 25;
        }
      }

      // 3. Price Budget Match
      if (quizAnswers.budget === "low") {
        if (product.price <= 2000000) score += 30;
        else if (product.price <= 4000000) score += 10;
        else score -= 25; // too expensive
      } else if (quizAnswers.budget === "medium") {
        if (product.price > 2000000 && product.price <= 5000000) score += 30;
        else if (product.price <= 2000000) score += 15;
        else score -= 10;
      } else if (quizAnswers.budget === "high") {
        if (product.price > 5000000) score += 30;
        else if (product.price > 3000000) score += 15;
      }

      if (score > topScore) {
        topScore = score;
        bestProduct = product;
      }
    });

    // Constrain score between 88% and 99% for professional clean indexing
    const finalScore = Math.min(Math.max(bestProduct ? topScore : 90, 88), 99);
    setQuizResult(bestProduct);
    setMatchScore(finalScore);
    setQuizStep(4);
  };

  // Calculate Appraisal trade value
  const calcTradeAppraisal = () => {
    const brand = TRADE_IN_BRANDS[tradeBrandIndex];
    let value = brand.baseValue;

    if (tradeCondition === "flawless") {
      value = value * 1.05;
    } else if (tradeCondition === "fair") {
      value = value * 0.70;
    }

    return Math.round(value);
  };

  const getProductImg = (prodId: string) => {
    if (prodId.includes("iphone")) return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80";
    if (prodId.includes("macbook")) return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80";
    if (prodId.includes("s24")) return "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80";
    if (prodId.includes("ps5")) return "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80";
    if (prodId.includes("tv")) return "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80";
    return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80";
  };

  // Compile trade whatsapp
  const handleSendTradeWhatsApp = () => {
    const appraisalVal = calcTradeAppraisal();
    const brandName = TRADE_IN_BRANDS[tradeBrandIndex].name;
    const targetProduct = PRODUCTS.find(p => p.id === selectedTargetProduct) || PRODUCTS[0];
    const cashDifference = Math.max(targetProduct.price - appraisalVal, 0);

    const text = encodeURIComponent(
      `Hello Apex Electronics! 👋\n\nI just used your *Apple-Style Trade-In Appraisal* online tool.\n\n📱 My Old Device: ${brandName}\n💎 Cosmetic Condition: ${tradeCondition.toUpperCase()}\n💰 Estimated Trade Estimate: ${formatCurrency(appraisalVal)}\n\n⭐ Target Upgrade: ${targetProduct.name} (${formatCurrency(targetProduct.price)})\n💸 Estimated Cash to top up: ${formatCurrency(cashDifference)}\n\nPlease let me know when your Lira safe courier can do the visual inspection and handshake swap!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${text}`, "_blank");
  };

  // Quick specs match details
  const compProduct1 = PRODUCTS.find(p => p.id === compareCompId1) || PRODUCTS[0];
  const compProduct2 = PRODUCTS.find(p => p.id === compareCompId2) || PRODUCTS[1];

  return (
    <section id="apple-experience" className="py-20 bg-[#fcfcfd] text-slate-800 relative border-t border-gray-200/80 overflow-hidden">
      
      {/* Dynamic Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-style Display Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-mono font-bold uppercase text-blue-600 tracking-widest block">
            THE INTEGRATED PREMIUM LAB
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
            Designed to match you perfectly.
          </h2>
          <p className="text-slate-600 text-sm font-light max-w-xl mx-auto">
            Choose a responsive applet below to match your workflow budget, calculate trade-ins, or align tech specs side-by-side.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="inline-flex p-1.5 rounded-[1.5rem] bg-gray-100 border border-gray-200 gap-1 mt-6">
            <button
              onClick={() => setActiveSubSection("matcher")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSubSection === "matcher" 
                  ? "bg-slate-900 text-white font-bold shadow-sm" 
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              🎯 Which is Right for You?
            </button>
            <button
              onClick={() => setActiveSubSection("tradein")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSubSection === "tradein" 
                  ? "bg-slate-900 text-white font-bold shadow-sm" 
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              🔄 Apple-Style Trade In
            </button>
            <button
              onClick={() => setActiveSubSection("compare")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSubSection === "compare" 
                  ? "bg-slate-900 text-white font-bold shadow-sm" 
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              📊 Specs Benchmarker
            </button>
          </div>
        </div>

        {/* Content Renderers */}
        <div className="mt-10">
          
          {/* ===================================== */}
          {/* 1. WHICH MODEL IS RIGHT FOR YOU QUIZ */}
          {/* ===================================== */}
          {activeSubSection === "matcher" && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-[3rem] p-6 md:p-12 text-left relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-8 text-xs font-mono text-slate-400 font-bold">
                <span className={`w-2.5 h-2.5 rounded-full ${quizStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <span className={`h-0.5 w-8 ${quizStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${quizStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <span className={`h-0.5 w-8 ${quizStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${quizStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <span className="ml-2 uppercase tracking-widest text-[9px] text-slate-500">STEP {quizStep === 4 ? "COMPLETE" : `${quizStep} OF 3`}</span>
              </div>

              {/* Quiz Step 1: Purpose Choice */}
              {quizStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">What is your principal daily workload?</h3>
                    <p className="text-slate-500 text-xs mt-1">We optimize performance indices based on your priority focus.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "creative", label: "PRO PHOTOGRAPHY & CREATIVE", desc: "Heavy HDR cameras, raw file editing, ProRes video capture, social content design.", icon: "📸" },
                      { id: "office", label: "PRODUCTIVITY, DESIGN & STUDY", desc: "Long spreadsheets, multi-task browser, compiling code, office documents package.", icon: "💼" },
                      { id: "gaming", label: "EXTREME MOBILE & CONSOLE GAMING", desc: "Action frames, ultra refresh rate, heavy graphic loading, responsive controllers.", icon: "🎮" },
                      { id: "media", label: "ENTERTAINMENT & AUDIO FIDELITY", desc: "Symphonic bass sound, crystal HDR screens, immersive spatial noise cancellation.", icon: "📺" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, purpose: opt.id });
                          setQuizStep(2);
                        }}
                        className={`p-6 rounded-2xl border text-left transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer ${
                          quizAnswers.purpose === opt.id ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/35" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="text-3xl mb-3">{opt.icon}</div>
                        <div className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">{opt.label}</div>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1.5 font-light">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Step 2: Ecosystem Choice */}
              {quizStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Which operating platform do you favor?</h3>
                    <p className="text-slate-500 text-xs mt-1">Pick your ideal software flow to integrate perfectly with current gear.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "apple", label: "APPLE iOS / macOS", desc: "Seamless Apple cloud, A-series silicon luxury, Apple Watch syncing, premium titanium longevity.", icon: "🍎" },
                      { id: "android", label: "SAMSUNG / ANDROID AI", desc: "Galaxy AI circle-to-search, complete stylus integration, expandable layouts, deep visual customization.", icon: "🤖" },
                      { id: "neutral", label: "ANY GENUINE SYSTEM", desc: "No operating framework bias. Match strictly based on price-to-performance ratio.", icon: "💻" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, eco: opt.id });
                          setQuizStep(3);
                        }}
                        className={`p-6 rounded-2xl border text-left transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer ${
                          quizAnswers.eco === opt.id ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/35" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="text-3xl mb-3">{opt.icon}</div>
                        <div className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">{opt.label}</div>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1.5 font-light">{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setQuizStep(1)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-800 cursor-pointer mt-4 inline-block"
                  >
                    ← Back to Previous Step
                  </button>
                </div>
              )}

              {/* Quiz Step 3: Budget Range */}
              {quizStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Select your desired investment tier</h3>
                    <p className="text-slate-400 text-xs mt-1">Find models matching your strict payment limits perfectly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "low", label: "ENTRY BUDGET TIER", desc: "Genuine accessories, smart screens, or entry flagships under 2,000,000 UGX.", icon: "💸" },
                      { id: "medium", label: "BALANCED POWERHOUSE", desc: "Sought-after corporate notebook or heavy smartphone flagships between 2M - 4M UGX.", icon: "⚡" },
                      { id: "high", label: "PREMIUM FLAGSHIP LUXURY", desc: "Ultra titanium Pro Max series, Apple Silicon MacBooks, or AI chipsets over 4M UGX.", icon: "🏆" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          const updated = { ...quizAnswers, budget: opt.id as any };
                          setQuizAnswers(updated);
                          // We trigger calculation immediately
                          setTimeout(() => {
                            let bestProduct = PRODUCTS[0];
                            let topScore = 0;

                            PRODUCTS.forEach((product) => {
                              let score = 50;
                              if (updated.purpose === "creative") {
                                if (product.category === "Phones" && (product.id.includes("pro-max") || product.id.includes("s24"))) score += 30;
                                if (product.id.includes("macbook")) score += 20;
                              } else if (updated.purpose === "office") {
                                if (product.category === "Laptops") score += 30;
                                if (product.id.includes("s24") || product.id.includes("pro-max")) score += 15;
                              } else if (updated.purpose === "gaming") {
                                if (product.category === "Gaming") score += 40;
                                if (product.id.includes("macbook") || product.id.includes("s24")) score += 15;
                              } else if (updated.purpose === "media") {
                                if (product.category === "TVs & Audio" || product.id.includes("airpods")) score += 45;
                              }

                              if (updated.eco === "apple") {
                                if (product.name.toLowerCase().includes("apple") || product.name.toLowerCase().includes("macbook") || product.name.toLowerCase().includes("airpods") || product.name.toLowerCase().includes("iphone")) score += 25;
                              } else if (updated.eco === "android") {
                                if (product.name.toLowerCase().includes("samsung") || product.name.toLowerCase().includes("galaxy")) score += 25;
                              }

                              if (updated.budget === "low") {
                                if (product.price <= 2000000) score += 30;
                                else if (product.price <= 4000000) score += 10;
                                else score -= 25;
                              } else if (updated.budget === "medium") {
                                if (product.price > 2000000 && product.price <= 5000000) score += 30;
                                else if (product.price <= 2000000) score += 15;
                                else score -= 10;
                              } else if (updated.budget === "high") {
                                if (product.price > 5000000) score += 30;
                                else if (product.price > 3000000) score += 15;
                              }

                              if (score > topScore) {
                                topScore = score;
                                bestProduct = product;
                              }
                            });

                            const finalScore = Math.min(Math.max(bestProduct ? topScore : 90, 88), 99);
                            setQuizResult(bestProduct);
                            setMatchScore(finalScore);
                            setQuizStep(4);
                          }, 100);
                        }}
                        className={`p-6 rounded-2xl border text-left transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer ${
                          quizAnswers.budget === opt.id ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/35" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="text-3xl mb-3">{opt.icon}</div>
                        <div className="text-xs font-mono font-bold tracking-wider text-slate-850 uppercase">{opt.label}</div>
                        <p className="text-[11px] text-slate-500 leading-normal mt-1.5 font-light">{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setQuizStep(2)}
                      className="text-xs font-mono text-slate-500 hover:text-slate-850 cursor-pointer"
                    >
                      ← Back to Previous Step
                    </button>
                    <button
                      onClick={processMatch}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold font-mono tracking-wider text-white uppercase flex items-center gap-1.5"
                    >
                      <span>Analyze Matching Core</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Step 4: Final Match result */}
              {quizStep === 4 && quizResult && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Result Title */}
                  <div className="border-b border-gray-250 pb-6">
                    <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>Optimized System Selection</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">We found your perfect flagship.</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Matched with <strong className="text-blue-600 font-mono font-black">{matchScore}% confidence</strong> based on technical priority mapping.
                    </p>
                  </div>

                  {/* Dynamic Result Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50 border border-gray-250 p-6 md:p-8 rounded-[2rem]">
                    
                    {/* Image indicator */}
                    <div className="col-span-1 md:col-span-4 relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                      <img 
                        src={getProductImg(quizResult.id)} 
                        alt={quizResult.name} 
                        className="w-40 md:w-56 h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
                      />
                    </div>

                    {/* Meta Specifications details */}
                    <div className="col-span-1 md:col-span-8 text-left space-y-4">
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[8px] font-mono font-extrabold bg-blue-600 text-white rounded uppercase tracking-wider">
                            {quizResult.badge || "RECOMMENDED"}
                          </span>
                          <span className="px-2.5 py-0.5 text-[8px] font-mono font-bold bg-gray-100 text-slate-600 border border-gray-250/80 rounded uppercase tracking-wider">
                            {quizResult.category} Series
                          </span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
                          {quizResult.name}
                        </h4>
                      </div>

                      <p className="text-slate-600 text-xs font-light leading-relaxed">
                        {quizResult.description}
                      </p>

                      {/* Hard specs ticks block */}
                      <div className="grid grid-cols-2 gap-2 pb-4">
                        {quizResult.specs.map((sp: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-mono">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{sp}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-2 border-t border-gray-200/80 pt-4">
                        <span className="text-[10px] text-slate-500 font-mono">APEX DEALS PRICE:</span>
                        <span className="text-lg font-mono text-emerald-600 font-black">{formatCurrency(quizResult.price)}</span>
                        {quizResult.originalPrice && (
                          <span className="text-xs text-slate-400 font-mono line-through">{formatCurrency(quizResult.originalPrice)}</span>
                        )}
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            addToCart(quizResult, 1);
                          }}
                          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-[11px] font-mono font-bold uppercase rounded-xl text-white tracking-widest hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                          + Add to Cart
                        </button>
                        <button
                          onClick={() => setSelectedQuickViewProduct(quizResult)}
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-[11px] font-mono font-semibold uppercase rounded-xl text-slate-700 tracking-wider transition-colors"
                        >
                          Specs Overview
                        </button>
                        <button
                          onClick={() => {
                            setQuizStep(1);
                            setQuizResult(null);
                          }}
                          className="px-3.5 py-3 text-[11px] text-slate-500 hover:text-slate-800 font-mono uppercase cursor-pointer"
                        >
                          ⟲ Reset Quiz
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ===================================== */}
          {/* 2. APPLE-STYLE TRADE-IN APPRAISALS */}
          {activeSubSection === "tradein" && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-[3rem] p-6 md:p-12 text-left relative overflow-hidden shadow-sm">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Inputs Setup Left Panel */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-mono text-xs font-bold uppercase tracking-widest mb-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      <span>Apex Trade-In Value appraiser</span>
                    </div>
                    <h3 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight">
                      Turn your vintage hardware into immediate discounts.
                    </h3>
                    <p className="text-slate-600 text-xs font-light font-sans leading-relaxed mt-2">
                      Trade in your current smartphone, laptop, or tablet. Receive secure valuation credit in Lira, and top-up only the difference for a brand new verified flagship. Same-day logistics courier handles device handshakes at your doorstep!
                    </p>
                  </div>

                  <div className="space-y-4">
                    
                    {/* 1. Device Brand Select */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block mb-1.5">
                        Select device currently in your hand:
                      </label>
                      <select
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-300 hover:border-emerald-500/40 text-slate-850 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                        value={tradeBrandIndex}
                        onChange={(e) => setTradeBrandIndex(Number(e.target.value))}
                      >
                        {TRADE_IN_BRANDS.map((b, idx) => (
                          <option key={idx} value={idx}>
                            {b.name} (Estimated ~{formatCurrency(b.baseValue)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Condition Select Buttons */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block mb-1.5">
                        Assess condition honestly:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "flawless", label: "Flawless / Mint", desc: "No scratches, fully intact battery, active buttons", icon: "⭐" },
                          { id: "good", label: "Good / Used", desc: "Slight daily pocket scuffs, perfect screens", icon: "👍" },
                          { id: "fair", label: "Fair / Cracked", desc: "Visible back scratches, screen minor chips, working OS", icon: "🔧" }
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setTradeCondition(c.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all hover:bg-gray-50 cursor-pointer flex flex-col justify-between ${
                              tradeCondition === c.id 
                                ? "border-emerald-500 bg-emerald-50/50" 
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <span className="text-base mb-1">{c.icon}</span>
                            <span className="text-[10px] font-bold text-slate-900 leading-tight block">{c.label}</span>
                            <span className="text-[8px] text-slate-500 leading-none mt-1">{c.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Target Upgrade Item */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block mb-1.5">
                        Select target upgrade gadget:
                      </label>
                      <select
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-300 hover:border-emerald-500/40 text-slate-850 text-xs rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                        value={selectedTargetProduct}
                        onChange={(e) => setSelectedTargetProduct(e.target.value)}
                      >
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatCurrency(p.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Appraisal Calculation Results Right Panel */}
                <div className="lg:col-span-15 lg:col-span-5">
                  <div className="bg-gray-50 border border-gray-205 p-6 md:p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/3 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Appraisal Summary</span>
                      <span className="px-2 py-0.5 text-[8px] font-mono font-bold bg-emerald-100 border border-emerald-200 text-emerald-700 rounded uppercase">
                        Active Estimate
                      </span>
                    </div>

                    {/* Core Calculations representation */}
                    <div className="space-y-3 font-mono text-xs text-left">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Upgrade device:</span>
                        <span className="text-slate-950 text-right truncate font-medium max-w-[150px]">
                          {PRODUCTS.find(p => p.id === selectedTargetProduct)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-200">
                        <span className="text-slate-500">Trade-in Appraisal:</span>
                        <span className="text-emerald-605 text-emerald-600 font-bold">-{formatCurrency(calcTradeAppraisal())}</span>
                      </div>
                      
                      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center mt-4 shadow-sm">
                        <span className="text-[10px] text-slate-600 font-sans tracking-wide block mb-1">Estimated Cash to Top-up</span>
                        <span className="text-2xl font-mono text-emerald-600 font-black block">
                          {formatCurrency(Math.max((PRODUCTS.find(p => p.id === selectedTargetProduct)?.price || 0) - calcTradeAppraisal(), 0))}
                        </span>
                      </div>
                    </div>

                    {/* Bullet Info indicators */}
                    <div className="space-y-2.5 text-[10px] text-slate-600 text-left font-sans">
                      <div className="flex items-start gap-2">
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Doorstep courier examination - fast handshake delivery.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Immediate professional smartphone file transfer in Lira City.</span>
                      </div>
                    </div>

                    {/* WhatsApp CTA Action */}
                    <button
                      onClick={handleSendTradeWhatsApp}
                      className="w-full py-4 rounded-xl font-bold font-mono text-[11px] tracking-widest uppercase text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/5 hover:shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-50" />
                      <span>Request Trade Appraisal</span>
                    </button>

                    <div className="text-center font-mono text-[8px] text-slate-400">
                      * Values estimated on standard Lira market metrics. Final price finalized face-to-face.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===================================== */}
          {/* 3. INTERACTIVE HIGH-END BENCHMARKER    */}
          {/* ===================================== */}
          {activeSubSection === "compare" && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-[3rem] p-6 md:p-12 text-left shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 mb-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-600 font-bold block">SPECS POWER BENCHMARK</span>
                  <h3 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight leading-none mt-1">
                    Compare Flagships Side-by-Side.
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Verify chips, dimensions, and specifications side by side just like standard Apple benchmarks.
                  </p>
                </div>

                {/* Pickers Row selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 block mb-1 font-bold uppercase tracking-wider">CHOOSE FIRST PRODUCT:</label>
                    <select
                      className="w-full py-2.5 px-3 bg-white border border-gray-300 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-purple-500 cursor-pointer outline-none"
                      value={compareCompId1}
                      onChange={(e) => setCompareCompId1(e.target.value)}
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 block mb-1 font-bold uppercase tracking-wider">CHOOSE SECOND PRODUCT:</label>
                    <select
                      className="w-full py-2.5 px-3 bg-white border border-gray-300 text-slate-800 text-xs rounded-xl focus:ring-1 focus:ring-purple-500 cursor-pointer outline-none"
                      value={compareCompId2}
                      onChange={(e) => setCompareCompId2(e.target.value)}
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Benchmarker Grid Matrix display tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product 1 column layout card */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-xs">
                  
                  {/* Item header */}
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                    <img 
                      src={getProductImg(compProduct1.id)} 
                      alt={compProduct1.name} 
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                    <div>
                      <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest">{compProduct1.category}</span>
                      <h4 className="text-sm font-bold text-slate-900 font-display leading-snug">{compProduct1.name}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-600 mt-1 block">{formatCurrency(compProduct1.price)}</span>
                    </div>
                  </div>

                  {/* Benchmark Bars & details */}
                  <div className="space-y-4">
                    
                    {/* Performance Index score */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-550 text-slate-600 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-500" /> SOC Microarchitecture:</span>
                        <span className="text-purple-600 font-bold">{compProduct1.id.includes("pro-max") || compProduct1.id.includes("m3") ? "Elite 3nm Silicon" : "Sub-4nm Fast Speed"}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" 
                          style={{ width: compProduct1.id.includes("pro-max") || compProduct1.id.includes("m3") ? "95%" : "85%" }}
                        />
                      </div>
                    </div>

                    {/* Storage Options */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-600 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-sky-500" /> Internal Memory capacity:</span>
                        <span className="text-sky-600 font-semibold">{compProduct1.storages?.join(" / ") || "Base stock"}</span>
                      </div>
                    </div>

                    {/* Primary characteristics Specs bullets array list */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-150">
                      <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Hardware Blueprint Highlights:</span>
                      {compProduct1.specs.map((sp: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cart Trigger */}
                    <button
                      onClick={() => addToCart(compProduct1, 1)}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold font-mono tracking-wider uppercase text-slate-700 border border-transparent rounded-xl transition-all cursor-pointer"
                    >
                      + Add {compProduct1.name.split(" ")[0]} To Cart
                    </button>

                  </div>
                </div>

                {/* Product 2 column layout card */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-xs">
                  
                  {/* Item header */}
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                    <img 
                      src={getProductImg(compProduct2.id)} 
                      alt={compProduct2.name} 
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                    <div>
                      <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest">{compProduct2.category}</span>
                      <h4 className="text-sm font-bold text-slate-900 font-display leading-snug">{compProduct2.name}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-600 mt-1 block">{formatCurrency(compProduct2.price)}</span>
                    </div>
                  </div>

                  {/* Benchmark Bars & details */}
                  <div className="space-y-4">
                    
                    {/* Performance Index score */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-650 text-slate-650 text-slate-600 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-500" /> SOC Microarchitecture:</span>
                        <span className="text-purple-600 font-bold">{compProduct2.id.includes("pro-max") || compProduct2.id.includes("m3") ? "Elite 3nm Silicon" : "Sub-4nm Fast Speed"}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" 
                          style={{ width: compProduct2.id.includes("pro-max") || compProduct2.id.includes("m3") ? "95%" : "85%" }}
                        />
                      </div>
                    </div>

                    {/* Storage Options */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-600 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-sky-500" /> Internal Memory capacity:</span>
                        <span className="text-sky-600 font-semibold">{compProduct2.storages?.join(" / ") || "Base stock"}</span>
                      </div>
                    </div>

                    {/* Primary characteristics Specs bullets array list */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-150">
                      <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Hardware Blueprint Highlights:</span>
                      {compProduct2.specs.map((sp: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cart Trigger */}
                    <button
                      onClick={() => addToCart(compProduct2, 1)}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold font-mono tracking-wider uppercase text-slate-700 border border-transparent rounded-xl transition-all cursor-pointer"
                    >
                      + Add {compProduct2.name.split(" ")[0]} To Cart
                    </button>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
