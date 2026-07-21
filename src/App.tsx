/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Settings,
  Mail,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertOctagon
} from "lucide-react";

import { locales } from "./locales";
import { initialProducts, mockCoupons } from "./productsData";
import { Product, CartItem, Order, Coupon, AppUser, Toast } from "./types";

// Modular Component Imports
import Notifications from "./components/Notifications";
import AuthModal from "./components/AuthModal";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutWizard from "./components/CheckoutWizard";
import AIStylist from "./components/AIStylist";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  // --- Persistent Storage State ---
  const [lang, setLang] = useState<"en" | "ar">(() => {
    return (localStorage.getItem("vogue_lang") as "en" | "ar") || "en";
  });

  const [currency, setCurrency] = useState<"USD" | "EUR" | "SAR" | "AED" | "EGP">(() => {
    return (localStorage.getItem("vogue_currency") as any) || (lang === "ar" ? "SAR" : "USD");
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("vogue_theme") as "light" | "dark") || "dark";
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("vogue_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("vogue_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("vogue_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("vogue_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("vogue_coupons");
    return saved ? JSON.parse(saved) : mockCoupons;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("vogue_user");
    return saved ? JSON.parse(saved) : null;
  });

  // --- UI Layout State ---
  const [activeView, setActiveView] = useState<
    "home" | "shop" | "cart" | "checkout" | "wishlist" | "orders" | "profile" | "admin" | "stylist" | "contact" | "about" | "faq" | "privacy" | "terms" | "error"
  >("home");

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Search, suggestions & history state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("vogue_search_history");
    return saved ? JSON.parse(saved) : ["wool overcoat", "blazer", "satin dress", "leather bag"];
  });

  // Filter sidebar state (Shop page)
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriceMax, setFilterPriceMax] = useState<number>(450);
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  const [filterSorting, setFilterSorting] = useState<string>("latest");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // --- Effects for LocalStorage Syncing ---
  useEffect(() => {
    localStorage.setItem("vogue_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("vogue_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("vogue_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("vogue_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vogue_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("vogue_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("vogue_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("vogue_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("vogue_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("vogue_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("vogue_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // --- Currency Exchange calculations relative to USD ---
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    SAR: 3.75,
    AED: 3.67,
    EGP: 48.0
  };

  const currentRate = exchangeRates[currency];

  const t = locales[lang];
  const isRtl = lang === "ar";

  const formatPrice = (priceUSD: number) => {
    const converted = Math.round(priceUSD * currentRate);
    return `${converted} ${currency}`;
  };

  // --- Toast Manager ---
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Cart Actions ---
  const handleAddToCart = (product: Product, size: string, color: any, qty: number = 1) => {
    const existingIdx = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor?.hex === color?.hex
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { product, selectedSize: size, selectedColor: color, quantity: qty }]);
    }
    addToast(t.addedToCart, "success");
  };

  const handleUpdateQty = (idx: number, qty: number) => {
    const updated = [...cart];
    updated[idx].quantity = qty;
    setCart(updated);
  };

  const handleRemoveItem = (idx: number) => {
    const item = cart[idx];
    setCart(cart.filter((_, i) => i !== idx));
    addToast(
      lang === "ar"
        ? `تمت إزالة ${isRtl ? item.product.name_ar : item.product.name_en} من الحقيبة`
        : `Removed ${item.product.name_en} from bag`,
      "info"
    );
  };

  // --- Wishlist Actions ---
  const handleAddToWishlist = (product: Product) => {
    const isSaved = wishlist.some((p) => p.id === product.id);
    if (isSaved) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
      addToast(
        lang === "ar" ? "تمت إزالة القطعة من المفضلة" : "Removed garment from wishlist",
        "info"
      );
    } else {
      setWishlist([...wishlist, product]);
      addToast(t.addedToWishlist, "success");
    }
  };

  // --- Product Management (Admin additions) ---
  const handleAddProduct = (prod: Product) => {
    setProducts([prod, ...products]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    // Also remove from cart/wishlist if it was deleted
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    // Also update in cart/wishlist
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updatedProd.id ? { ...item, product: updatedProd } : item
      )
    );
    setWishlist((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  // --- Order Actions ---
  const handleAddOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // --- Coupon additions ---
  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons([coupon, ...coupons]);
  };

  // --- Search actions ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!searchHistory.includes(searchQuery.trim().toLowerCase())) {
      setSearchHistory([searchQuery.trim().toLowerCase(), ...searchHistory.slice(0, 5)]);
    }
    setActiveView("shop");
    setIsSearchFocused(false);
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    if (!searchHistory.includes(term.toLowerCase())) {
      setSearchHistory([term.toLowerCase(), ...searchHistory.slice(0, 5)]);
    }
    setActiveView("shop");
    setIsSearchFocused(false);
  };

  // --- Shop Filtration logic ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_ar.includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesPrice = (p.discountPrice || p.price) <= filterPriceMax;
    const matchesSize = filterSize === "all" || p.sizes.includes(filterSize);
    const matchesColor = filterColor === "all" || p.colors.some((c) => c.name_en.toLowerCase() === filterColor);

    return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
  });

  // --- Shop Sorting logic ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.discountPrice || a.price;
    const bPrice = b.discountPrice || b.price;

    if (filterSorting === "price-asc") return aPrice - bPrice;
    if (filterSorting === "price-desc") return bPrice - aPrice;
    if (filterSorting === "best") return b.rating - a.rating;
    return b.id.localeCompare(a.id); // default newest (latest ID)
  });

  const featuredList = products.filter((p) => p.featured);
  const bestSellersList = products.filter((p) => p.bestSeller);
  const newArrivalsList = products.filter((p) => p.newArrival);
  const flashSaleList = products.filter((p) => p.flashSale);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast(
      lang === "ar"
        ? "شكراً لانضمامك! سوف نرسل لك دعوتك الحصرية لتسوق المجموعات قريباً."
        : "Thank you for subscribing! Your exclusive private collection invitation is on its way.",
      "success"
    );
    setNewsletterEmail("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveCoupon(null);
    setActiveView("home");
    addToast(lang === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully", "info");
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col justify-between ${
        theme === "dark" ? "bg-[#141211] text-neutral-100" : "bg-[#f9f9f9] text-neutral-900"
      }`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Notifications Portal */}
      <Notifications toasts={toasts} removeToast={removeToast} lang={lang} />

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        onLoginSuccess={setCurrentUser}
        addToast={addToast}
      />

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lang={lang}
        currency={currency}
        exchangeRate={currentRate}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            addToast(lang === "ar" ? "يرجى تسجيل الدخول أولاً لإتمام طلبك الفاخر" : "Please sign in to place your luxury order", "info");
          } else {
            setActiveView("checkout");
          }
        }}
        activeCoupon={activeCoupon}
        onApplyCoupon={setActiveCoupon}
        addToast={addToast}
      />

      {/* Product Detail Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            lang={lang}
            currency={currency}
            exchangeRate={currentRate}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isWishlisted={wishlist.some((p) => p.id === selectedProduct.id)}
            allProducts={products}
            onQuickView={setSelectedProduct}
            addToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* HEADER SECTION (Mega Menu + Navigation rails) */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          theme === "dark" ? "bg-[#141211]/85 border-neutral-900" : "bg-white/85 border-neutral-150"
        }`}
      >
        {/* Top utility bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-400 dark:text-neutral-500 border-b border-neutral-200/10 dark:border-neutral-900/40">
          <div className="flex gap-4">
            <span className="hidden sm:inline">{lang === "ar" ? "شحن مجاني للطلبات فوق $١٥٠" : "Complimentary Luxury Delivery above $150"}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Switcher */}
            <div className="flex items-center gap-1.5 relative group">
              <Globe className="w-3.5 h-3.5" />
              <span className="cursor-pointer hover:text-black dark:hover:text-white flex items-center gap-1">
                {currency} <ChevronDown className="w-3 h-3" />
              </span>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 p-2 rounded-none shadow-md flex flex-col gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                {(["USD", "EUR", "SAR", "AED", "EGP"] as any).map((curr: any) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-950 px-3 py-1.5 rounded-none text-left transition-colors cursor-pointer text-[9px] text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === "en" ? "العربية" : "ENGLISH"}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Primary Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-neutral-500 hover:text-black dark:hover:text-white p-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <a
              href="#"
              onClick={() => {
                setActiveView("home");
                setSearchQuery("");
              }}
              className="text-lg font-black tracking-[0.3em] uppercase text-neutral-900 dark:text-neutral-100 font-serif hover:opacity-80 transition-opacity"
            >
              {t.appName}
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-black text-neutral-500 dark:text-neutral-400">
            <button
              onClick={() => {
                setActiveView("home");
                setSearchQuery("");
              }}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                activeView === "home" ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5" : ""
              }`}
            >
              {lang === "ar" ? "الرئيسية" : "Studio"}
            </button>
            <button
              onClick={() => {
                setFilterCategory("all");
                setActiveView("shop");
              }}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                activeView === "shop" && filterCategory === "all" ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5" : ""
              }`}
            >
              {lang === "ar" ? "المتجر الكامل" : "Collections"}
            </button>
            <button
              onClick={() => {
                setFilterCategory("men");
                setActiveView("shop");
              }}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                activeView === "shop" && filterCategory === "men" ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5" : ""
              }`}
            >
              {t.men}
            </button>
            <button
              onClick={() => {
                setFilterCategory("women");
                setActiveView("shop");
              }}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                activeView === "shop" && filterCategory === "women" ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5" : ""
              }`}
            >
              {t.women}
            </button>
            <button
              onClick={() => {
                setFilterCategory("kids");
                setActiveView("shop");
              }}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                activeView === "shop" && filterCategory === "kids" ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5" : ""
              }`}
            >
              {t.kids}
            </button>
            <button
              onClick={() => setActiveView("stylist")}
              className={`hover:text-black dark:hover:text-white transition-colors text-amber-600 dark:text-amber-500 font-extrabold flex items-center gap-1 cursor-pointer ${
                activeView === "stylist" ? "text-amber-600 dark:text-amber-550 border-b border-amber-600 pb-0.5" : ""
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-600 dark:fill-amber-550" />
              <span>{t.aiStylist}</span>
            </button>
          </nav>

          {/* Icon Controls */}
          <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300">
            {/* Search Bar popup stage */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-48 focus-within:w-64 transition-all duration-300">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-[10px] rounded-none py-1.5 pl-8 pr-3 outline-none transition-all font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5" />

              {/* Instant Search Suggestions Box */}
              {isSearchFocused && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 rounded-none shadow-md p-4 z-50 flex flex-col gap-3">
                  {searchHistory.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider font-extrabold pb-1.5 border-b border-neutral-200 dark:border-neutral-900 mb-2">{t.searchHistory}</p>
                      <div className="flex gap-2 flex-wrap">
                        {searchHistory.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handlePopularSearchClick(item)}
                            className="bg-[#f5f5f5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 hover:border-black dark:hover:border-white text-neutral-700 dark:text-neutral-300 text-[9px] px-2.5 py-1 rounded-none cursor-pointer transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[9px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider font-extrabold pb-1.5 border-b border-neutral-200 dark:border-neutral-900 mb-2">{t.popularSearches}</p>
                    <div className="flex gap-2 flex-wrap">
                      {["blazer", "cashmere", "overcoat", "sneakers"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handlePopularSearchClick(term)}
                          className="bg-[#f5f5f5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 hover:border-black dark:hover:border-white text-neutral-700 dark:text-neutral-300 text-[9px] px-2.5 py-1 rounded-none cursor-pointer transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Profile trigger */}
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  if (currentUser) {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer p-1 ${
                  isProfileDropdownOpen ? "text-amber-500 dark:text-amber-400" : ""
                }`}
                aria-label="User Profile Menu"
              >
                <User className="w-4 h-4" />
              </button>
              
              {isProfileDropdownOpen && currentUser && (
                <>
                  {/* Backdrop click catcher */}
                  <div 
                    className="fixed inset-0 z-40 bg-transparent cursor-default" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto top-full mt-2.5 bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 p-3 rounded-none shadow-lg flex flex-col gap-1.5 z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2 pb-2 border-b border-neutral-100 dark:border-neutral-900/60 mb-1">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-black text-start">
                        {isRtl ? "مرحباً بك" : "WELCOME"}
                      </p>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 font-bold truncate max-w-[150px] mt-0.5 text-start">
                        {currentUser.name}
                      </p>
                    </div>

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveView("admin");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-start px-2 py-2 rounded-none text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors"
                      >
                        {t.adminDashboard}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setActiveView("orders");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-start px-2 py-2 rounded-none text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors"
                    >
                      {t.myOrders}
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveView("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-start px-2 py-2 rounded-none text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-colors"
                    >
                      {t.profile}
                    </button>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="hover:bg-rose-50 dark:hover:bg-rose-950/20 text-red-600 dark:text-red-400 text-start px-2 py-2 rounded-none text-[10px] uppercase font-bold tracking-widest cursor-pointer border-t border-neutral-100 dark:border-neutral-900/60 mt-1.5 transition-colors"
                    >
                      {t.logout}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView("wishlist")}
              className="relative hover:text-black dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white dark:bg-white dark:text-black font-black text-[8px] rounded-none w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-black dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white dark:bg-white dark:text-black font-black text-[8px] rounded-none w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-900 bg-white/95 dark:bg-[#141211]/95 p-6 space-y-4 flex flex-col uppercase text-xs tracking-wider font-extrabold text-neutral-900 dark:text-neutral-100">
            <button
              onClick={() => {
                setActiveView("home");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-neutral-500 text-start"
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </button>
            <button
              onClick={() => {
                setFilterCategory("all");
                setActiveView("shop");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-neutral-500 text-start"
            >
              {lang === "ar" ? "المتجر الكامل" : "Shop Collections"}
            </button>
            <button
              onClick={() => {
                setFilterCategory("men");
                setActiveView("shop");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-neutral-500 text-start"
            >
              {t.men}
            </button>
            <button
              onClick={() => {
                setFilterCategory("women");
                setActiveView("shop");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-neutral-500 text-start"
            >
              {t.women}
            </button>
            <button
              onClick={() => {
                setFilterCategory("kids");
                setActiveView("shop");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-neutral-500 text-start"
            >
              {t.kids}
            </button>
            <button
              onClick={() => {
                setActiveView("stylist");
                setIsMobileMenuOpen(false);
              }}
              className="text-amber-600 dark:text-amber-500 hover:text-amber-500 text-start"
            >
              ✦ {t.aiStylist}
            </button>
          </div>
        )}
      </header>

      {/* PRIMARY VIEWS SWITCH ORCHESTRATION */}
      <main className="flex-grow">
        {activeView === "home" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16 pb-16"
          >
            {/* HERO BANNER SLIDESHOW */}
            <div className="relative h-[70vh] w-full overflow-hidden bg-stone-950 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920"
                alt="Runway High Fashion model banner"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/60" />

              <div className="relative z-10 text-center max-w-2xl px-6 space-y-6">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[11px] font-bold uppercase tracking-[0.4em] text-stone-300 block"
                >
                  {lang === "ar" ? "أزياء عالمية راقية ومحدودة" : "Luxury Runway Selections"}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="text-3xl md:text-5xl font-extrabold tracking-widest text-stone-100 font-serif leading-tight"
                >
                  {t.heroTitle}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs md:text-sm text-stone-400 font-medium max-w-lg mx-auto leading-relaxed"
                >
                  {t.heroSubtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setActiveView("shop");
                    }}
                    className="bg-stone-100 hover:bg-white text-stone-950 font-bold uppercase tracking-widest py-3.5 px-8 rounded-lg text-xs cursor-pointer transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>{t.shopNow}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4 animate-pulse" /> : <ArrowRight className="w-4 h-4 animate-pulse" />}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* INTRO CATEGORY CLUSTERS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-stone-500 mb-8 text-center sm:text-start">
                {t.categories}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { id: "women", label_en: "Women's Collection", label_ar: "التشكيلة النسائية", img: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400" },
                  { id: "men", label_en: "Men's Apparel", label_ar: "الأزياء الرجالية", img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=400" },
                  { id: "kids", label_en: "Kids' Outfits", label_ar: "ملابس الأطفال", img: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=400" },
                  { id: "accessories", label_en: "Luxury Accessories", label_ar: "إكسسوارات فاخرة", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400" }
                ].map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setFilterCategory(cat.id);
                      setActiveView("shop");
                    }}
                    className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-950 cursor-pointer shadow-lg border border-stone-900/10 hover:shadow-xl transition-all"
                  >
                    <img
                      src={cat.img}
                      alt={cat.label_en}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-stone-100 flex items-center justify-between gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {isRtl ? cat.label_ar : cat.label_en}
                      </span>
                      {isRtl ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED APPAREL (Grid showcasing pieces) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-8 border-b border-stone-900/10 pb-4">
                <h2 className="text-lg font-black uppercase tracking-widest text-stone-100">
                  {t.featuredProducts}
                </h2>
                <button
                  onClick={() => {
                    setFilterCategory("all");
                    setActiveView("shop");
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer border-b border-stone-800 pb-0.5"
                >
                  <span>{lang === "ar" ? "تصفح كل التشكيلة" : "Browse entire catalogue"}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredList.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    lang={lang}
                    currency={currency}
                    exchangeRate={currentRate}
                    onQuickView={setSelectedProduct}
                    onAddToCart={(prod, sz, cl) => handleAddToCart(prod, sz, cl)}
                    onAddToWishlist={handleAddToWishlist}
                    isWishlisted={wishlist.some((it) => it.id === p.id)}
                  />
                ))}
              </div>
            </div>

            {/* INSTANT PROMOTION SECTION (Banners, discounts) */}
            <div className="bg-stone-900 border-y border-stone-850 py-12 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl text-center md:text-start">
                  <span className="text-[10px] bg-red-950 border border-red-900 text-red-300 font-bold uppercase px-3 py-1 rounded-full tracking-widest inline-block">
                    {lang === "ar" ? "تخفيضات كبرى محدودة" : "Exclusive Flash Sale Offer"}
                  </span>
                  <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest text-stone-100 font-serif">
                    {lang === "ar" ? "احصل على خصم ٢٠٪ فوري" : "Acquire 20% Off Your Sartorial Order"}
                  </h2>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {lang === "ar"
                      ? "استخدم الكوبون الفاخر الخاص بنا للاستفادة بخصم فوري ٢٠٪ لجميع الملابس الشتوية والبدلات وفساتين السهرة الراقية."
                      : "Apply our premier discount voucher to receive immediate price reductions across our tailoring, coats, and luxury knitwear catalog."}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="border-2 border-dashed border-stone-800 bg-stone-950 px-8 py-4 rounded-xl text-center shadow-lg">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold block mb-1">Coupon Code</span>
                    <strong className="text-lg font-black font-mono tracking-widest text-stone-100">VOGUE20</strong>
                  </div>
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setActiveView("shop");
                      addToast(lang === "ar" ? "تم نسخ الكود! تصفح الكتالوج الآن" : "Voucher code copied! Browse collections.", "success");
                    }}
                    className="bg-stone-100 hover:bg-white text-stone-950 font-bold uppercase tracking-widest py-2 px-5 rounded-lg text-[10px] transition-colors cursor-pointer"
                  >
                    {lang === "ar" ? "نسخ الكود وتسوق الآن" : "Copy Code & Shop Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* BRANDS PARADE */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold text-center mb-8">Featured Sartorial Maisons</p>
              <div className="flex gap-8 justify-around items-center flex-wrap opacity-40">
                {["VOGUE MAISON", "ATELIER VOGUE", "VOGUE JEWELRY", "VOGUE ACCENTS", "VOGUE LEATHERCRAFT"].map((b) => (
                  <span key={b} className="text-xs font-black tracking-[0.3em] uppercase">{b}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SHOP CATALOGUE VIEW (Listing products with filters sidebar) */}
        {activeView === "shop" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-stone-900 border border-stone-800/80 p-5 rounded-2xl h-fit">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest">{t.filterBy}</h3>
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setFilterPriceMax(450);
                      setFilterSize("all");
                      setFilterColor("all");
                      setSearchQuery("");
                      addToast(lang === "ar" ? "تم تصفير الفلاتر" : "Filters cleared", "info");
                    }}
                    className="text-[10px] uppercase font-bold text-stone-400 hover:text-white border-b border-stone-700 hover:border-white cursor-pointer pb-0.5"
                  >
                    {lang === "ar" ? "إعادة تعيين" : "Reset"}
                  </button>
                </div>

                {/* Categories filtering */}
                <div className="space-y-2">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-extrabold">{t.categories}</p>
                  <div className="flex flex-col gap-1.5 text-xs text-stone-300">
                    {[
                      { id: "all", label_en: "All Collections", label_ar: "جميع المجموعات" },
                      { id: "men", label_en: "Men", label_ar: "رجال" },
                      { id: "women", label_en: "Women", label_ar: "نساء" },
                      { id: "kids", label_en: "Kids", label_ar: "أطفال" },
                      { id: "shoes", label_en: "Shoes", label_ar: "أحذية" },
                      { id: "bags", label_en: "Bags", label_ar: "حقائب" },
                      { id: "accessories", label_en: "Accessories", label_ar: "إكسسوارات" },
                      { id: "activewear", label_en: "Activewear", label_ar: "ملابس رياضية" }
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setFilterCategory(c.id)}
                        className={`text-start px-2 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold ${
                          filterCategory === c.id
                            ? "bg-stone-950 text-white font-extrabold"
                            : "hover:bg-stone-950/40 text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        {isRtl ? c.label_ar : c.label_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2 border-t border-stone-850 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-extrabold">{t.priceRange}</p>
                    <span className="text-[11px] font-bold font-mono text-stone-200">
                      {Math.round(filterPriceMax * currentRate)} {currency}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="450"
                    step="10"
                    value={filterPriceMax}
                    onChange={(e) => setFilterPriceMax(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-950 rounded-lg accent-stone-300 cursor-pointer"
                  />
                </div>

                {/* Sizes Filter */}
                <div className="space-y-2 border-t border-stone-850 pt-4">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-extrabold">{t.size}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", "XS", "S", "M", "L", "XL", "XXL", "One Size"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFilterSize(sz)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                          filterSize === sz
                            ? "bg-stone-100 text-stone-950 border-stone-100"
                            : "bg-stone-950 text-stone-400 border-stone-850 hover:border-stone-700 hover:text-white"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Filter */}
                <div className="space-y-2 border-t border-stone-850 pt-4">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-extrabold">{t.color}</p>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "camel", "black", "grey", "white", "green", "blue", "tan", "pink"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setFilterColor(col)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                          filterColor === col
                            ? "bg-stone-100 text-stone-950 border-stone-100"
                            : "bg-stone-950 text-stone-400 border-stone-850 hover:border-stone-700"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Products Area */}
              <div className="flex-grow space-y-6">
                {/* Sorting options bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
                  <p className="text-xs text-stone-400 font-bold tracking-wide">
                    {lang === "ar" ? "تم العثور على" : "Showing"} <span className="text-stone-100 font-black">{sortedProducts.length}</span> {t.items}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase text-stone-500 tracking-wider font-extrabold">{t.sortBy}</span>
                    <select
                      value={filterSorting}
                      onChange={(e) => setFilterSorting(e.target.value)}
                      className="bg-stone-950 border border-stone-850 text-stone-300 text-xs rounded-lg px-3 py-1.5 outline-none font-semibold focus:border-stone-600 transition-colors cursor-pointer"
                    >
                      <option value="latest">{t.sortLatest}</option>
                      <option value="price-asc">{t.sortPriceAsc}</option>
                      <option value="price-desc">{t.sortPriceDesc}</option>
                      <option value="best">{t.sortBest}</option>
                    </select>
                  </div>
                </div>

                {sortedProducts.length === 0 ? (
                  <div className="bg-stone-900 border border-stone-800 p-12 rounded-2xl text-center max-w-md mx-auto space-y-4">
                    <AlertOctagon className="w-10 h-10 text-stone-600 mx-auto stroke-[1.5]" />
                    <p className="text-xs text-stone-400 leading-normal">{t.noProductsFound}</p>
                    <button
                      onClick={() => {
                        setFilterCategory("all");
                        setFilterPriceMax(450);
                        setFilterSize("all");
                        setFilterColor("all");
                        setSearchQuery("");
                      }}
                      className="bg-stone-100 hover:bg-white text-stone-950 font-bold uppercase tracking-widest px-5 py-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                    >
                      {lang === "ar" ? "تصفير الفلاتر" : "Clear All Filters"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        lang={lang}
                        currency={currency}
                        exchangeRate={currentRate}
                        onQuickView={setSelectedProduct}
                        onAddToCart={(p, sz, cl) => handleAddToCart(p, sz, cl)}
                        onAddToWishlist={handleAddToWishlist}
                        isWishlisted={wishlist.some((it) => it.id === p.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECURE CHECKOUT PROCESS VIEW */}
        {activeView === "checkout" && (
          <CheckoutWizard
            cart={cart}
            lang={lang}
            currency={currency}
            exchangeRate={currentRate}
            activeCoupon={activeCoupon}
            onClearCart={() => setCart([])}
            onAddOrder={handleAddOrder}
            addToast={addToast}
            onGoToOrders={() => setActiveView("orders")}
          />
        )}

        {/* WISHLIST SAVED APPARELS VIEW */}
        {activeView === "wishlist" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6"
          >
            <h1 className="text-base font-black uppercase tracking-widest text-stone-100 border-b border-stone-850 pb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span>{t.wishlist} ({wishlist.length})</span>
            </h1>

            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-stone-900 border border-stone-850 max-w-md mx-auto rounded-2xl space-y-4">
                <Heart className="w-12 h-12 text-stone-850 mx-auto stroke-[1.5]" />
                <p className="text-xs text-stone-400">
                  {lang === "ar" ? "قائمة أمنياتك فارغة حالياً" : "Your luxury wishlist is currently empty."}
                </p>
                <button
                  onClick={() => setActiveView("shop")}
                  className="bg-stone-100 hover:bg-white text-stone-950 font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    lang={lang}
                    currency={currency}
                    exchangeRate={currentRate}
                    onQuickView={setSelectedProduct}
                    onAddToCart={(prod, sz, cl) => handleAddToCart(prod, sz, cl)}
                    onAddToWishlist={handleAddToWishlist}
                    isWishlisted={true}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* RECENT USER ORDERS & TRACKING VIEWS */}
        {activeView === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6"
          >
            <h1 className="text-base font-black uppercase tracking-widest text-stone-100 border-b border-stone-850 pb-4">
              {t.myOrders} ({orders.length})
            </h1>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-stone-900 border border-stone-850 rounded-2xl space-y-4 max-w-md mx-auto">
                <ShoppingBag className="w-12 h-12 text-stone-850 mx-auto stroke-[1.5]" />
                <p className="text-xs text-stone-400">
                  {lang === "ar" ? "لا توجد معاملات جارية أو منتهية بحسابك" : "You have no registered purchases in our files."}
                </p>
                <button
                  onClick={() => setActiveView("shop")}
                  className="bg-stone-100 hover:bg-white text-stone-950 font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                >
                  {t.shopNow}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-stone-900 border border-stone-850 rounded-2xl shadow-xl overflow-hidden">
                    {/* Order header information */}
                    <div className="bg-stone-950 p-4 border-b border-stone-850 flex flex-col sm:flex-row justify-between gap-3 sm:items-center text-xs">
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider font-extrabold block text-[9px]">{t.orderNumber}</span>
                        <strong className="text-stone-200 font-mono text-sm">{ord.id}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider font-extrabold block text-[9px]">{lang === "ar" ? "تاريخ تسجيل الطلب" : "Purchase Date"}</span>
                        <span className="text-stone-300 font-mono font-medium">{ord.date}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider font-extrabold block text-[9px]">{t.orderStatus}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-stone-900 border border-stone-800 text-stone-300">
                          {ord.status === "pending" ? t.statusPending : ord.status === "processing" ? t.statusProcessing : ord.status === "shipped" ? t.statusShipped : ord.status === "out-for-delivery" ? t.statusOutForDelivery : ord.status === "delivered" ? t.statusDelivered : t.statusCancelled}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider font-extrabold block text-[9px]">{t.total}</span>
                        <strong className="text-stone-100 font-mono text-sm">{formatPrice(ord.total)}</strong>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="p-5 divide-y divide-stone-850/60">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <img src={it.product.images[0]} alt={it.product.name_en} className="w-10 h-13 rounded object-cover border border-stone-800 bg-stone-950 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-stone-200">{isRtl ? it.product.name_ar : it.product.name_en}</p>
                              <p className="text-[10px] text-stone-500 mt-0.5">Size: {it.selectedSize} | {isRtl ? it.selectedColor?.name_ar : it.selectedColor?.name_en}</p>
                            </div>
                          </div>
                          <span className="text-xs text-stone-300 font-mono font-bold">Qty: {it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order tracking indicator */}
                    <div className="bg-stone-950/40 p-4 border-t border-stone-850/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <span className="text-stone-500 font-bold uppercase tracking-wider block text-[9px]">{lang === "ar" ? "رقم التتبع الدولي" : "International Tracking Reference"}</span>
                        <span className="font-mono text-stone-200 font-bold">{ord.trackingNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 font-bold uppercase tracking-wider block text-[9px]">{t.shippingMethod}</span>
                        <span className="text-stone-300 font-medium">{isRtl ? ord.shippingMethod.name_ar : ord.shippingMethod.name_en}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ACCOUNT PROFILE VIEW */}
        {activeView === "profile" && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6"
          >
            <h1 className="text-base font-black uppercase tracking-widest text-stone-100 border-b border-stone-850 pb-4">
              {t.profile}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card details */}
              <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-950 border-2 border-stone-800 flex items-center justify-center text-stone-300 font-bold text-lg mx-auto shadow-inner">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-100">{currentUser.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{currentUser.email}</p>
                </div>
                <div className="pt-4 border-t border-stone-850/60 flex justify-center gap-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-stone-950 border-stone-800 text-stone-400">
                    Role: {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Editable detail fields */}
              <div className="md:col-span-2 bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-stone-400 font-extrabold pb-3 border-b border-stone-850">
                  {t.editProfile}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-1.5">{t.fullName}</label>
                      <input
                        type="text"
                        defaultValue={currentUser.name}
                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 text-stone-100 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-1.5">{t.phone}</label>
                      <input
                        type="tel"
                        defaultValue={currentUser.phone || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 text-stone-100 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-1.5">{t.email}</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-white dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 text-neutral-500 rounded-none p-2.5 text-xs outline-none cursor-not-allowed opacity-60"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => addToast(lang === "ar" ? "تم حفظ التعديلات بنجاح" : "Credentials altered successfully", "success")}
                      className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold uppercase tracking-widest py-2.5 px-6 rounded-none text-xs cursor-pointer transition-colors"
                    >
                      {lang === "ar" ? "حفظ التعديلات" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* GEMINI AI PERSONAL STYLIST VIEW */}
        {activeView === "stylist" && (
          <AIStylist
            lang={lang}
            currentCart={cart}
            wishlist={wishlist}
            allProducts={products}
            onQuickView={setSelectedProduct}
            currency={currency}
            exchangeRate={currentRate}
          />
        )}

        {/* ADMIN BACKEND SUITE VIEW */}
        {activeView === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            lang={lang}
            currency={currency}
            exchangeRate={currentRate}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            addToast={addToast}
          />
        )}

        {/* COMPLIANCE PAGES - FAQ */}
        {activeView === "faq" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-neutral-700 dark:text-neutral-300 text-xs text-justify"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-widest text-center mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-4">{t.faqs}</h1>
            <div className="space-y-4">
              {[
                {
                  q_en: "Are your clothing items organic and certified?",
                  q_ar: "هل خامات الملابس طبيعية وعضوية معتمدة؟",
                  a_en: "Yes, our luxury items are crafted using GOTS-certified organic cotton, premium mulberry silks, and fine Italian wool blends to ensure absolute luxury and safety.",
                  a_ar: "نعم، يتم استخدام قطن عضوي نقي حاصل على شهادة GOTS الدولية، بالإضافة لحرير التوت الإيطالي الطبيعي وصوف الميرينو الفاخر لضمان الأمان والتميز المطلق."
                },
                {
                  q_en: "What shipping couriers do you partner with?",
                  q_ar: "ما هي شركات الشحن المتعاقد معها للتوصيل؟",
                  a_en: "We partner exclusively with premium international express couriers like DHL Express, FedEx, and Aramex to ensure fast, secure door-to-door luxury shipping.",
                  a_ar: "نتعامل حصرياً مع كبرى شركات التوصيل السريع والفاخر مثل دي إتش إل إكسبريس، فيديكس، وأرامكس لضمان وصول شحنتك بسلامة تامة وبأقصى سرعة لباب منزلك."
                },
                {
                  q_en: "How can I return an apparel piece if the size does not fit?",
                  q_ar: "كيف يمكنني إرجاع قطعة ملابس في حال عدم ملاءمة المقاس؟",
                  a_en: "Simply open your personal purchase profile or contact our concierge client advisor. We offer complimentary 30-day return shipping for all unworn garments with intact security tags.",
                  a_ar: "ببساطة توجه لسجل طلباتك الفاخرة أو تواصل مباشرة مع المنسقين لدينا. نوفر شحناً مجانياً سهلاً للإرجاع خلال ٣٠ يوماً من الاستلام بشرط عدم استخدام المنتج والاحتفاظ بالغلاف الأصلي."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 p-5 rounded-none shadow-none">
                  <h3 className="font-extrabold text-neutral-900 dark:text-neutral-100 mb-2 leading-relaxed text-sm">
                    {isRtl ? faq.q_ar : faq.q_en}
                  </h3>
                  <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {isRtl ? faq.a_ar : faq.a_en}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMPLIANCE PAGES - About Us */}
        {activeView === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-neutral-700 dark:text-neutral-300 text-xs text-justify leading-relaxed"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-widest text-center mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-4">{t.aboutUs}</h1>
            <p>
              {isRtl
                ? "تأسست دار 'فيج' للأزياء الراقية بهدف صياغة نمط حياة فاخر وعصري يعكس أصالة الفخمة وبساطة التصميم الحديث. نؤمن بضرورة الحفاظ على التقاليد المتبعة في خياطة الملابس مع دمج التقنيات المستحدثة لمنح عملائنا تجربة تسوق لا تضاهى."
                : "Established in Milan and expanded globally, VOGUE Haute Couture is a curated sanctuary of luxury fashion design. We specialize in uniting legacy craftsmanship with highly innovative technical fibers to deliver an uncompromised experience of beauty and modern minimalism."}
            </p>
            <p>
              {isRtl
                ? "يتم تصميم كافة موديلاتنا بمسؤولية كاملة بمصانعنا في إيطاليا وبإشراف نخبة من كبار المصممين، ملتزمين باستخدام طاقة خضراء ومواد معاد تدويرها وصديقة للبيئة بنسبة ١٠٠٪."
                : "Every pattern is designed responsibly at our ateliers in Italy and crafted meticulously by master tailors. We are strictly committed to sourcing organic, biodegradable fibers and promoting sustainable, circular luxury across our entire supply chain."}
            </p>
          </motion.div>
        )}

        {/* COMPLIANCE PAGES - Contact */}
        {activeView === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-4 py-12 space-y-8"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <div className="text-center max-w-lg mx-auto">
              <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-widest border-b border-neutral-200 dark:border-neutral-900 pb-4 mb-3">{t.contactUs}</h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                {isRtl
                  ? "تواصل مع منسقي الموضة وخدمة النخبة لدينا للحصول على استشارة فورية لطلبيتك أو تعديل مقاساتك."
                  : "Reach our private client concierge advisors for bespoke tailoring advice, bulk sizing options, or logistics support."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 p-6 rounded-none shadow-none space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 uppercase text-xs tracking-wider">{lang === "ar" ? "المقر الرئيسي والدعم" : "Studio Offices & Support"}</h3>
                <p><strong>Riyadh Olaya Ateliers:</strong> King Fahd Road, Olaya Tower, Level 42, Riyadh, Saudi Arabia.</p>
                <p><strong>Email Concierge:</strong> elite.advisor@vogue.com</p>
                <p><strong>Vogue VIP Phone:</strong> +966 50 123 4567</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast(lang === "ar" ? "تم تسجيل رسالتك بنجاح. سيتواصل معك المنسق قريباً" : "Your inquiry has been received. Advisor will reach out shortly.", "success");
                }}
                className="bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 p-6 rounded-none shadow-none space-y-4"
              >
                <div>
                  <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1 font-bold">Your Name</label>
                  <input required type="text" className="w-full bg-[#f9f9f9] dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1 font-bold">Email</label>
                  <input required type="email" className="w-full bg-[#f9f9f9] dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1 font-bold">Inquiry Details</label>
                  <textarea required rows={3} className="w-full bg-[#f9f9f9] dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none" />
                </div>
                <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest py-3 text-xs rounded-none cursor-pointer transition-colors hover:opacity-90">
                  {lang === "ar" ? "إرسال رسالة للمنسقين" : "Dispatch Inquiry"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* COMPLIANCE PAGES - Privacy Policy */}
        {activeView === "privacy" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-neutral-700 dark:text-neutral-300 text-xs text-justify leading-relaxed"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-widest text-center mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-4">{t.privacyPolicy}</h1>
            <p>
              {isRtl
                ? "تعتبر خصوصية بياناتك الائتمانية والشخصية من أهم ركائز الثقة بدار 'فيج'. نلتزم بحماية كافة البيانات المدخلة ولا يتم تداولها أو استخدامها خارج نطاق معالجة وتغليف وتوصيل طلباتك الفاخرة."
                : "At VOGUE, your client privacy is our absolute priority. This document describes our strict policies regarding the secure processing, encryption, and temporary retrieval of purchase data across payment gateways."}
            </p>
            <p>
              {isRtl
                ? "نستخدم كوكيز آمنة وجلسات مشفرة بالكامل بالخوادم لمنع تسريب أي معلومات أو بيانات مرتبطة ببطاقتك المصرفية."
                : "We utilize highly secure cookies and SSL servers to guarantee absolute protection for your financial profiles and credit card details."}
            </p>
          </motion.div>
        )}

        {/* COMPLIANCE PAGES - Terms and Conditions */}
        {activeView === "terms" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-neutral-700 dark:text-neutral-300 text-xs text-justify leading-relaxed"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-widest text-center mb-8 border-b border-neutral-200 dark:border-neutral-900 pb-4">{t.termsConditions}</h1>
            <p>
              {isRtl
                ? "يرجى قراءة الشروط والأحكام بدقة قبل البدء بشراء منتجاتنا الفاخرة. كافة المنتجات المعروضة بالكتالوج خاضعة لتحديثات مستمرة في مستويات المخزون والأسعار المعروضة وتخفيضاتها."
                : "Please review these client terms meticulously prior to purchasing. All apparel items displayed in our catalogue are subject to real-time inventory alterations, seasonal pricing revisions, and flash sales adjustments."}
            </p>
            <p>
              {isRtl
                ? "جميع المحتويات، الصور، التصميمات، والشعارات المعروضة هي ملكية حصرية لعلامتنا التجارية ويُمنع نسخها تجارياً بالكامل."
                : "All designs, visuals, brand trademarks, and markdown advice listed in this application represent our proprietary intellectual property and are strictly protected globally."}
            </p>
          </motion.div>
        )}

        {/* ERROR DISPLAY SYSTEM */}
        {activeView === "error" && (
          <div className="max-w-md mx-auto py-24 text-center space-y-6 px-6">
            <AlertOctagon className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
            <h1 className="text-2xl font-serif font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              {lang === "ar" ? "عذراً! حدث خطأ فني غير متوقع" : "Sartorial Exception Encountered"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed text-justify">
              {lang === "ar"
                ? "لم نتمكن من معالجة المعاملة بالشكل الصحيح. قد يكون ذلك بسبب تعطل خادم الدفع، أو نفاد كمية القطعة المحددة، أو فقدان الاتصال بالشبكة الآمنة."
                : "We were unable to successfully authorize your luxury action. This could be due to transactional delays, unexpected out-of-stock levels, or server connection drops."}
            </p>
            <button
              onClick={() => setActiveView("home")}
              className="bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest py-3 px-8 rounded-none text-xs cursor-pointer transition-colors hover:opacity-90"
            >
              {lang === "ar" ? "العودة للرئيسية" : "Return to Studio Home"}
            </button>
          </div>
        )}
      </main>

      {/* FOOTER SECTION (Newsletter circle, links, compliance, copyright) */}
      <footer
        className={`border-t ${
          theme === "dark" ? "bg-[#141211] border-neutral-900 text-neutral-400" : "bg-white border-neutral-200 text-neutral-600"
        }`}
      >
        {/* Newsletter Circle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-neutral-200/50 dark:border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
              {t.newsletterTitle}
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              {t.newsletterSubtitle}
            </p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md w-full mx-auto md:mx-0 md:ms-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="vip.client@luxury.com"
              className="flex-grow bg-[#f9f9f9] dark:bg-[#1a1817] border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-xs rounded-none px-4 py-2.5 outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest py-2.5 px-6 rounded-none text-[10px] shrink-0 transition-colors cursor-pointer hover:opacity-90"
            >
              {t.subscribe}
            </button>
          </form>
        </div>

        {/* Footer Nav Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs leading-normal">
          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-black text-neutral-900 dark:text-neutral-100 tracking-widest">{lang === "ar" ? "المجموعات الفاخرة" : "LUXURY APPAREL"}</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setFilterCategory("men"); setActiveView("shop"); }} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.men}</button>
              <button onClick={() => { setFilterCategory("women"); setActiveView("shop"); }} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.women}</button>
              <button onClick={() => { setFilterCategory("kids"); setActiveView("shop"); }} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.kids}</button>
              <button onClick={() => { setFilterCategory("activewear"); setActiveView("shop"); }} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.activewear}</button>
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-black text-neutral-900 dark:text-neutral-100 tracking-widest">{lang === "ar" ? "المستشار الذكي" : "INTELLIGENT AI"}</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveView("stylist")} className="hover:text-amber-500 dark:hover:text-amber-400 text-amber-600 dark:text-amber-550 text-start font-bold cursor-pointer transition-colors">✦ {t.aiStylist}</button>
              <button onClick={() => setActiveView("faq")} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.faqs}</button>
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-black text-neutral-900 dark:text-neutral-100 tracking-widest">{lang === "ar" ? "عن الدار والشركة" : "HERITAGE & COMPANY"}</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveView("about")} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.aboutUs}</button>
              <button onClick={() => setActiveView("contact")} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.contactUs}</button>
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-black text-neutral-900 dark:text-neutral-100 tracking-widest">{lang === "ar" ? "الأمان والسياسات" : "COMPLIANCE & LEGAL"}</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveView("privacy")} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.privacyPolicy}</button>
              <button onClick={() => setActiveView("terms")} className="hover:text-black dark:hover:text-white text-start cursor-pointer transition-colors">{t.termsConditions}</button>
            </div>
          </div>
        </div>

        {/* Brand Copyright */}
        <div className="bg-[#f5f5f5] dark:bg-[#0c0a0a] py-6 border-t border-neutral-200 dark:border-neutral-900 text-center text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-600">
          <p>© {new Date().getFullYear()} {t.appName} HAUTE COUTURE. ALL RIGHTS RESERVED WORLDWIDE.</p>
        </div>
      </footer>
    </div>
  );
}
