import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  MessageSquare, 
  BadgeCheck, 
  Zap, 
  Laptop, 
  Clock, 
  Smartphone, 
  Tv, 
  Gamepad2, 
  Headphones, 
  Shield, 
  HelpCircle, 
  Gift, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  Trophy, 
  TrendingUp, 
  Plane, 
  Truck,
  Heart,
  ChevronRight
} from "lucide-react";
import { BUSINESS_INFO, PRODUCTS } from "../data";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

// Local Shipping Rate Calculations for Uganda & Lira
const SHIPPINGS = [
  { id: "lira-town", name: "Lira Town (Market, Ojwina, Blue Quarters)", price: "1,500 UGX", time: "Within 30-45 mins", status: "🔵 Express Dispatch", riders: 5 },
  { id: "lira-uni", name: "Lira University Campus / Bar", price: "2,500 UGX", time: "Within 45-60 mins", status: "🟢 Active Rider Nearby", riders: 3 },
  { id: "apac-route", name: "Apac / Akokoro / Dokolo Route Carriers", price: "8,000 UGX", time: "Same-Day Bus Handover", status: "🟡 Daily Bus Handover", riders: 2 },
  { id: "gulu-hi", name: "Gulu Road / Lira Medical Field Area", price: "2,000 UGX", time: "Within 45 mins", status: "🔵 Express Dispatch", riders: 4 },
  { id: "kla-coach", name: "Kampala Executive Coach Bus Parcel Hub", price: "10,000 UGX", time: "Overnight Delivery (Pickup AM)", status: "🟢 TransUganda Dispatch", riders: 7 }
];

// Featured Top Flash Sale Items loaded in FOMO block
const FLASH_DEALS = [
  {
    id: "galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra (AI)",
    originalPrice: 5800000,
    dealPrice: 5100000,
    stockLeft: 3,
    totalStock: 12,
    percentClaimed: 75,
    tag: "AI FLAGSHIP",
    desc: "Unsealed and tested box, full warranty"
  },
  {
    id: "iphone-15-pro-max",
    name: "Apple iPhone 15 Pro Max (Titanium)",
    originalPrice: 6400000,
    dealPrice: 5750000,
    stockLeft: 2,
    totalStock: 8,
    percentClaimed: 75,
    tag: "LOWEST PRICE",
    desc: "Sealed box, genuine Apple Store stock"
  }
];

export default function Hero() {
  const { activeCategory, setActiveCategory, setSelectedQuickViewProduct, setGlobalSearchTerm } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeStr, setTimeStr] = useState("05:14:22");
  const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);

  // Interactive Tabbed Hub control state
  const [activeTab, setActiveTab] = useState<"spin" | "flash" | "shipping">("spin");

  // Lucky Spin state management
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Live Shipping Planner state
  const [selectedRegion, setSelectedRegion] = useState("lira-town");
  const currentShipping = SHIPPINGS.find(s => s.id === selectedRegion) || SHIPPINGS[0];

  // Live Flash Ticker stopwatch countdown
  const [flashTime, setFlashTime] = useState({ h: 2, m: 45, s: 12 });

  useEffect(() => {
    // Show current local Lira City time
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

  // Flash sales continuous countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 3, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load spin state from local storage so clients stay locked to their rewards
  useEffect(() => {
    const savedPrize = localStorage.getItem("solo_spin_prize");
    const savedCoupon = localStorage.getItem("solo_spin_coupon");
    if (savedPrize && savedCoupon) {
      setSpinResult(savedPrize);
      setCouponCode(savedCoupon);
    }
  }, []);

  // Premium blue/purple/indigo sliding promotions
  const slides = [
    {
      title: "🔥 APEX SUPERWEEK SALE",
      tagline: "Genuine Flagship Phones Up to -15%",
      description: "Discover verified genuine sealed Apple iPhones, official Samsung Galaxy flagships, and fast-charging accessories. Delivered same-day in Lira with corporate warranty cards.",
      accentText: "Apex Phone Super Week",
      cta: "Explore Apex Phone Deals",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      color: "from-amber-600 to-red-650",
      badge: "SEALED GENUINE STOCK"
    },
    {
      title: "💻 APEX COMPUTER BUNDLES",
      tagline: "Ultra speed Apple Silicon MacBooks",
      description: "Empower your corporate office, agency, or study hub. High-performance metal business laptops pre-packaged with official office suites and premium carrying cases.",
      accentText: "Save up to 600K UGX",
      cta: "Browse Apex Computers",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      color: "from-blue-600 to-indigo-700",
      badge: "OFFICIAL LOCAL WARRANTY"
    },
    {
      title: "📺 SOLO'S SMART SHOWCASE",
      tagline: "4K Frameless Smart TVs & Audio Systems",
      description: "Redefine your living room with ultra-slim bezel 4K displays and heavy-bass soundbars. Includes digital surge protectors and complementary wall mount brackets.",
      accentText: "Limited Store Stock",
      cta: "View Home Screens",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80",
      color: "from-purple-600 to-indigo-800",
      badge: "FREE PREMIUM WALL MOUNT"
    }
  ];

  // Auto-rotate carousel slides like Jumia's main page slider
  useEffect(() => {
    if (isSpinning) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length, isSpinning]);

  const handleWhatsAppConsultation = (customProductText = "") => {
    const defaultMsg = encodeURIComponent(
      customProductText 
        ? `Hi ${BUSINESS_INFO.name}! I am browsing your online storefront and want to secure stock availability for: ${customProductText}`
        : `Hello ${BUSINESS_INFO.name}! 👋 I am browsing your online electronics catalog. I want to secure a flagship device with express doorstep Lira delivery!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${defaultMsg}`, "_blank");
  };

  const JUMIA_CATEGORIES = [
    {
      name: "Phones",
      label: "Smartphones & Tablets",
      icon: Smartphone,
      color: "from-amber-500 to-orange-500",
      badge: "Hot",
      subcategories: ["Apple iPhones", "Samsung Galaxy", "TECNO & Infinix", "Redmi & Xiaomi", "Tablet Deals"],
      popularBrands: ["Apple", "Samsung", "TECNO", "Infinix", "Xiaomi"],
      tagline: "Up to 2-Year official local warranties"
    },
    {
      name: "Laptops",
      label: "Computing & Business",
      icon: Laptop,
      color: "from-blue-500 to-indigo-500",
      badge: "Pro",
      subcategories: ["Apple MacBooks", "HP EliteBooks", "Dell Latitudes", "Lenovo ThinkPads", "Office Software"],
      popularBrands: ["Apple", "HP", "Dell", "Lenovo", "Microsoft"],
      tagline: "Preloaded licensed Microsoft Office"
    },
    {
      name: "TVs & Audio",
      label: "Smart screens & Sound",
      icon: Tv,
      color: "from-purple-500 to-pink-500",
      badge: "-12%",
      subcategories: ["4K Smart TVs", "Home Theater Audio", "Soundbars & Bass", "Digital Protectors", "Wall Mounts"],
      popularBrands: ["Sony", "Samsung", "LG", "Hisense", "JBL"],
      tagline: "Free concrete wall mounting setup"
    },
    {
      name: "Gaming",
      label: "Consoles & Controllers",
      icon: Gamepad2,
      color: "from-red-500 to-rose-500",
      badge: "New",
      subcategories: ["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Wireless Controllers", "Nintendo Switch"],
      popularBrands: ["Sony", "Microsoft", "Nintendo", "Logitech"],
      tagline: "12-Month swap/replacement guarantee"
    },
    {
      name: "Accessories",
      label: "Caretags & Chargers",
      icon: Headphones,
      color: "from-emerald-500 to-teal-500",
      badge: "Deal",
      subcategories: ["Superfast Chargers", "Wireless Earbuds", "Screen Protectors", "Power Banks", "Cables & Adapters"],
      popularBrands: ["Anker", "Apple", "Samsung", "Oraimo", "Baseus"],
      tagline: "100% Genuine charging accessories"
    }
  ];

  const handleCategoryChoice = (categoryName: string) => {
    setActiveCategory(categoryName);
    setGlobalSearchTerm("");
    setActiveHoverCategory(null);
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubcategoryChoice = (categoryName: string, subcategoryName: string) => {
    setActiveCategory(categoryName);
    const searchQuery = subcategoryName.replace(/Apple |Samsung |HP |Dell |TECNO & |Redmi & /i, "");
    setGlobalSearchTerm(searchQuery);
    setActiveHoverCategory(null);
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBrandChoice = (categoryName: string, brandName: string) => {
    setActiveCategory(categoryName);
    setGlobalSearchTerm(brandName);
    setActiveHoverCategory(null);
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Lucky Spin Wheel sector configurations
  const prizes = [
    { text: "Free Fast Charger Cable 🔌", coupon: "SOLO-FAST-CABLE" },
    { text: "UGX 50,000 Accessory Discount 🎟️", coupon: "SOLO-50K-VOUCH" },
    { text: "Free Lira Express Logistics 🚚", coupon: "SOLO-FREE-DELIV" },
    { text: "Premium Screen Glass Protector 🛡️", coupon: "SOLO-GLASS-PROT" },
    { text: "UGX 100K smart accessory coupon 🎁", coupon: "SOLO-100K-COUP" },
    { text: "15% off soundbars & bluetooth 🎧", coupon: "SOLO-15-AUDIO" }
  ];

  const spinWheel = () => {
    if (isSpinning || spinResult) return;
    setIsSpinning(true);
    
    // Choose random slice (0 to 5)
    const size = prizes.length;
    const randomSlot = Math.floor(Math.random() * size);
    
    // Calculate final degrees (multiple full rotations + offset)
    const degPerSlice = 360 / size;
    const targetDeg = (360 * 7) + (randomSlot * degPerSlice);
    setRotation(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      // Map correctly to landed slot depending on clockwise offset
      const prizeObj = prizes[randomSlot];
      setSpinResult(prizeObj.text);
      setCouponCode(prizeObj.coupon);
      localStorage.setItem("solo_spin_prize", prizeObj.text);
      localStorage.setItem("solo_spin_coupon", prizeObj.coupon);
    }, 3600);
  };

  // Reset helper so clients can retry playing (optional playability but retains high engagement)
  const resetSpinGame = () => {
    localStorage.removeItem("solo_spin_prize");
    localStorage.removeItem("solo_spin_coupon");
    setSpinResult(null);
    setCouponCode(null);
    setRotation(0);
  };

  // Forward users details to WhatsApp to redeem digital coupon
  const handleClaimPrizeWhatsApp = (prize: string, code: string) => {
    const formattedText = encodeURIComponent(
      `Hello Apex Phones & Electronics! \n\n🎰 I just played your interactive Daily Wheel on your website and won: *${prize}*!\n🎫 My custom security coupon code is: [${code}].\n\nI want to look at your live smartphones/accessories and claim this prize along with my order!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${formattedText}`, "_blank");
  };

  // Triggers specs drawer popover inside Services component for ultimate seamless buy cycle
  const handleFeaturedClick = (productId: string) => {
    const target = PRODUCTS.find(p => p.id === productId);
    if (target) {
      setSelectedQuickViewProduct(target);
    } else {
      // Fallback scroll
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Formats WhatsApp dispatch simulation
  const handlePreBookLogistics = () => {
    const msgText = encodeURIComponent(
      `Hello Apex Phones! 👋 I simulated delivery logistics to *${currentShipping.name}* which estimates: \n- Cost: ${currentShipping.price}\n- Time: ${currentShipping.time}.\n\nPlease secure stock dispatch and let me know how I can pay using secure MTN/Airtel cash exchange!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${msgText}`, "_blank");
  };

  return (
    <section
      id="hero"
      className="relative pt-24 md:pt-32 pb-12 bg-bg-primary overflow-hidden"
    >
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-[-5%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* State-of-the-art interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative">
          
          {/* 1. Left Sidebar: Jumia-style Categories Directory */}
          <div 
            className="hidden lg:col-span-3 lg:flex flex-col glass-panel glass-panel-hover rounded-2xl p-4 text-left justify-between min-h-[460px] relative"
            onMouseLeave={() => setActiveHoverCategory(null)}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-widest font-bold block mb-3.5 px-2">
                🏠 DEPARTMENTS
              </span>
              {JUMIA_CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = activeCategory === cat.name;
                const isHovered = activeHoverCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChoice(cat.name)}
                    onMouseEnter={() => setActiveHoverCategory(cat.name)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer text-left group border ${
                      isHovered || isSelected 
                        ? "bg-orange-50/80 dark:bg-orange-950/25 border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-450 font-bold" 
                        : "text-slate-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-slate-900/40 border-transparent"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isHovered || isSelected ? "bg-orange-100/80 dark:bg-orange-950/60 text-orange-600 dark:text-orange-450" : "bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold leading-tight">{cat.name}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">{cat.label}</div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isHovered || isSelected ? "text-orange-500 dark:text-orange-400 translate-x-0.5" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 pt-4 mt-4 px-2 select-none">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                <span className="text-[9px] font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Verified Local Security
                </span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                100% Genuine electronics. Escrow-protected local pay upon physical examination.
              </p>
            </div>

            {/* Desktop Megamenu Flyout (Rendered next to Left Sidebar) */}
            <AnimatePresence>
              {activeHoverCategory && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-[101%] top-0 bottom-0 w-[420px] bg-white dark:bg-[#070719] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-40 flex flex-col justify-between text-left"
                >
                  {JUMIA_CATEGORIES.map((cat) => {
                    if (cat.name !== activeHoverCategory) return null;
                    return (
                      <div key={cat.name} className="h-full flex flex-col justify-between">
                        <div className="space-y-6">
                          {/* Title segment */}
                          <div>
                            <span className="text-[9px] font-mono font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-0.5">
                              DEPARTMENT HUB
                            </span>
                            <h4 className="text-lg font-display font-black text-slate-900 dark:text-white">
                              {cat.label}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans italic">
                              {cat.tagline}
                            </p>
                          </div>

                          {/* Subcategories list */}
                          <div className="space-y-2.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                              Popular Categories
                            </span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub}
                                  onClick={() => handleSubcategoryChoice(cat.name, sub)}
                                  className="w-full text-left py-2 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-900/45 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center justify-between cursor-pointer"
                                >
                                  <span>{sub}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Brand hubs */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                              Official Brands
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.popularBrands.map((brand) => (
                                <button
                                  key={brand}
                                  onClick={() => handleBrandChoice(cat.name, brand)}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/20 dark:hover:bg-orange-950/20 text-slate-700 dark:text-slate-350 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors"
                                >
                                  {brand}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Direct link */}
                        <button
                          onClick={() => handleCategoryChoice(cat.name)}
                          className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/10"
                        >
                          <span>Explore All {cat.name} Deals</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Middle Column: Jumia-style Main Promotion Banner Carousel */}
          <div className="col-span-1 lg:col-span-9 relative bg-neutral-900 border border-gray-250 shadow-md rounded-2xl overflow-hidden min-h-[380px] md:min-h-[460px] flex flex-col justify-end p-6 md:p-8 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-0 flex items-center justify-center"
              >
                {/* Image overlay backdrop with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <img
                  src={slides[currentSlide].image}
                  className="w-full h-full object-cover opacity-35 select-none pointer-events-none"
                  alt=""
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 max-w-xl space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 text-[8px] font-mono font-extrabold bg-blue-600 text-white rounded uppercase tracking-wider">
                  {slides[currentSlide].badge}
                </span>
                <span className="px-2 py-0.5 text-[8px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 rounded uppercase tracking-wider">
                  SOLO'S STOCKS
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {slides[currentSlide].title}
                </span>
                <h2 className="text-2xl sm:text-3.5xl md:text-4xl font-display font-extrabold text-white leading-tight tracking-tight">
                  {slides[currentSlide].tagline}
                </h2>
              </div>

              <p className="text-slate-300 text-xs font-light leading-relaxed font-sans">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1.5">
                <button
                  onClick={() => handleWhatsAppConsultation(slides[currentSlide].title + " - " + slides[currentSlide].tagline)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-500/10"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>{slides[currentSlide].cta}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleCategoryChoice(JUMIA_CATEGORIES[currentSlide % JUMIA_CATEGORIES.length].name)}
                  className="px-4 py-2.5 rounded-xl text-[11px] font-semibold text-slate-300 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all text-center"
                >
                  Quick Department
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute right-4 bottom-4 z-10 flex gap-1 bg-black/40 backdrop-blur-sm py-1 px-2.5 rounded-full border border-white/5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? "bg-blue-500 scale-125 w-3.5" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Jumia-style Mobile Circular Category Quick-Link Row */}
        <div className="mt-8 pt-6 border-t border-gray-150/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-4 px-1 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                🛒 Fast Categories (Jumia Style)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider animate-pulse">
              100% Genuine
            </span>
          </div>

          <div className="flex items-start gap-4 overflow-x-auto pb-3.5 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {JUMIA_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChoice(cat.name)}
                  className="flex flex-col items-center text-center shrink-0 snap-start select-none group cursor-pointer w-20"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                    isSelected
                      ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                      : "bg-gray-150/40 dark:bg-slate-900/30 text-slate-700 dark:text-slate-350 border border-gray-200/50 dark:border-white/5 hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-105"
                  }`}>
                    {/* Hot Badges */}
                    {cat.name === "Phones" && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[7px] font-mono font-black text-white bg-red-500 rounded-full scale-90 tracking-tight uppercase">Hot</span>
                    )}
                    {cat.name === "Laptops" && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[7px] font-mono font-black text-white bg-blue-500 rounded-full scale-90 tracking-tight uppercase">Pro</span>
                    )}
                    {cat.name === "TVs & Audio" && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[7px] font-mono font-black text-white bg-purple-500 rounded-full scale-90 tracking-tight uppercase">New</span>
                    )}
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold mt-2 truncate max-w-full ${
                    isSelected ? "text-orange-500 dark:text-orange-400" : "text-slate-700 dark:text-slate-400 group-hover:text-orange-500"
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
