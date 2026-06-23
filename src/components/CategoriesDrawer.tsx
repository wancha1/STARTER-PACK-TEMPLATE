import { useCart } from "../context/CartContext";
import { 
  X, 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2, 
  Headphones, 
  ChevronRight, 
  Sparkles, 
  BadgePercent, 
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const JUMIA_CATEGORIES = [
  {
    name: "Phones",
    label: "Smartphones & Tablets",
    icon: Smartphone,
    color: "from-amber-500 to-orange-500 text-orange-500",
    badge: "Hot",
    subcategories: ["Apple iPhones", "Samsung Galaxy", "TECNO & Infinix", "Redmi & Xiaomi", "Tablet Deals"],
    popularBrands: ["Apple", "Samsung", "TECNO", "Infinix", "Xiaomi"],
    tagline: "Up to 2-Year official local warranties"
  },
  {
    name: "Laptops",
    label: "Computing & Business",
    icon: Laptop,
    color: "from-blue-500 to-indigo-500 text-blue-500",
    badge: "Pro",
    subcategories: ["Apple MacBooks", "HP EliteBooks", "Dell Latitudes", "Lenovo ThinkPads", "Office Software"],
    popularBrands: ["Apple", "HP", "Dell", "Lenovo", "Microsoft"],
    tagline: "Preloaded licensed Microsoft Office"
  },
  {
    name: "TVs & Audio",
    label: "Smart screens & Sound",
    icon: Tv,
    color: "from-purple-500 to-pink-500 text-purple-500",
    badge: "-12%",
    subcategories: ["4K Smart TVs", "Home Theater Audio", "Soundbars & Bass", "Digital Protectors", "Wall Mounts"],
    popularBrands: ["Sony", "Samsung", "LG", "Hisense", "JBL"],
    tagline: "Free concrete wall mounting setup"
  },
  {
    name: "Gaming",
    label: "Consoles & Controllers",
    icon: Gamepad2,
    color: "from-red-500 to-rose-500 text-red-500",
    badge: "New",
    subcategories: ["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Wireless Controllers", "Nintendo Switch"],
    popularBrands: ["Sony", "Microsoft", "Nintendo", "Logitech"],
    tagline: "12-Month swap/replacement guarantee"
  },
  {
    name: "Accessories",
    label: "Caretags & Chargers",
    icon: Headphones,
    color: "from-emerald-500 to-teal-500 text-emerald-500",
    badge: "Deal",
    subcategories: ["Superfast Chargers", "Wireless Earbuds", "Screen Protectors", "Power Banks", "Cables & Adapters"],
    popularBrands: ["Anker", "Apple", "Samsung", "Oraimo", "Baseus"],
    tagline: "100% Genuine charging accessories"
  }
];

export default function CategoriesDrawer() {
  const { 
    isCategoriesOpen, 
    setIsCategoriesOpen, 
    activeCategory, 
    setActiveCategory, 
    setGlobalSearchTerm 
  } = useCart();

  const [expandedCat, setExpandedCat] = useState<string | null>("Phones");

  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName);
    setGlobalSearchTerm("");
    setIsCategoriesOpen(false);
    
    // Smooth scroll to catalogs grid
    setTimeout(() => {
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const handleSelectSubcategory = (catName: string, subName: string) => {
    setActiveCategory(catName);
    // Strip brand prefixes or general tags to generate clean search queries
    const searchQuery = subName.replace(/Apple |Samsung |HP |Dell |TECNO & |Redmi & /i, "");
    setGlobalSearchTerm(searchQuery);
    setIsCategoriesOpen(false);

    setTimeout(() => {
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const handleSelectBrand = (catName: string, brandName: string) => {
    setActiveCategory(catName);
    setGlobalSearchTerm(brandName);
    setIsCategoriesOpen(false);

    setTimeout(() => {
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {isCategoriesOpen && (
        <div className="fixed inset-0 z-55 overflow-hidden" id="categories-drawer-wrapper">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCategoriesOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-[#070719] border-r border-gray-200 dark:border-white/10 shadow-2xl flex flex-col pt-6 pointer-events-auto text-left"
            >
              {/* Header */}
              <div className="px-6 pb-5 border-b border-gray-150 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-black text-slate-900 dark:text-white leading-tight">Jumia Departments</h2>
                    <p className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest leading-none mt-1">
                      Quick Browse Category Directory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCategoriesOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close Categories"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Layout: Scrollable Navigation Sections */}
              <div className="flex-1 overflow-y-auto flex">
                
                {/* Left Side: Departments Root */}
                <div className="w-[110px] sm:w-[130px] border-r border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-slate-950/20 py-2 shrink-0">
                  {JUMIA_CATEGORIES.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = expandedCat === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setExpandedCat(cat.name)}
                        className={`w-full flex flex-col items-center gap-1.5 py-4 px-2 border-l-3 transition-all cursor-pointer relative ${
                          isSelected
                            ? "border-orange-500 bg-white dark:bg-[#09091f]/50 text-orange-500 font-extrabold"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-slate-900/30"
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? "bg-orange-50 dark:bg-orange-950/30 text-orange-500" : "bg-gray-100 dark:bg-slate-800"}`}>
                          <IconComp className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-tight text-center truncate max-w-full">
                          {cat.name}
                        </span>
                        {cat.badge && (
                          <span className="absolute top-2 right-2 text-[8px] px-1 py-0.2 bg-red-500 text-white rounded-full font-bold scale-75">
                            {cat.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Detailed Expandable Category Submenu */}
                <div className="flex-1 p-5 overflow-y-auto space-y-6">
                  {JUMIA_CATEGORIES.map((cat) => {
                    if (expandedCat !== cat.name) return null;
                    return (
                      <div key={cat.name} className="space-y-6 animate-fade-in">
                        {/* Title Segment */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                            <span>Browse Department</span>
                          </div>
                          <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                            {cat.label}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans italic mt-1">
                            {cat.tagline}
                          </p>
                        </div>

                        {/* Top Offer Promo banner card */}
                        <div 
                          onClick={() => handleSelectCategory(cat.name)}
                          className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/40 cursor-pointer transition-all flex items-center justify-between group select-none"
                        >
                          <div className="text-left">
                            <span className="text-[9px] font-mono font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                              APEX LIVE OFFER
                            </span>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                              Shop All {cat.name} Deals
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Subcategories list */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-3.5 h-3.5 text-orange-500" />
                            <h4 className="text-xs font-mono uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-350">
                              Popular Categories
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {cat.subcategories.map((sub) => (
                              <button
                                key={sub}
                                onClick={() => handleSelectSubcategory(cat.name, sub)}
                                className="w-full py-2.5 px-3.5 rounded-xl border border-gray-150 dark:border-white/5 hover:border-orange-500/30 bg-gray-50/50 dark:bg-slate-900/30 text-slate-650 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/20 dark:hover:bg-orange-950/10 text-xs font-semibold flex items-center justify-between cursor-pointer transition-all"
                              >
                                <span>{sub}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Brand directory */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                            <h4 className="text-xs font-mono uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-350">
                              Official Brand Hubs
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.popularBrands.map((brand) => (
                              <button
                                key={brand}
                                onClick={() => handleSelectBrand(cat.name, brand)}
                                className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-all"
                              >
                                {brand}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Sticky Footer dispatch note */}
              <div className="p-6 border-t border-gray-150 dark:border-white/10 bg-gray-50 dark:bg-slate-950/50 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <BadgePercent className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Jumia Super Week Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  Fast logistics and escrow payment on delivery. All goods are tested at Apex Plot 24, Juba Road.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
