/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Heart, Eye, ZoomIn } from "lucide-react";
import { Product, Review } from "../types";
import { locales } from "../locales";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  lang: "en" | "ar";
  currency: string;
  exchangeRate: number;
  onAddToCart: (product: Product, size: string, color: any, qty: number) => void;
  onAddToWishlist: (product: Product) => void;
  isWishlisted: boolean;
  allProducts: Product[];
  onQuickView: (product: Product) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  lang,
  currency,
  exchangeRate,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  allProducts,
  onQuickView,
  addToast
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotateIndex, setRotateIndex] = useState(0);

  // Zoom feature state & handlers
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
    transform: "scale(1)"
  });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)"
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - left) / width) * 100;
      const y = ((touch.clientY - top) / height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setZoomStyle({
        transformOrigin: `${clampedX}% ${clampedY}%`,
        transform: "scale(2.5)"
      });
    }
  };

  const handleTouchStart = () => {
    setIsZoomed(true);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

  // Review writing state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  if (!product) return null;

  // Initialize defaults
  if (!selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  const isRtl = lang === "ar";
  const t = locales[lang];

  const formatPrice = (priceUSD: number) => {
    const converted = Math.round(priceUSD * exchangeRate);
    return `${converted} ${currency}`;
  };

  const name = isRtl ? product.name_ar : product.name_en;
  const longDesc = isRtl ? product.long_desc_ar : product.long_desc_en;
  const categoryLabel = isRtl ? product.category_ar : product.category_en;
  const material = isRtl ? product.material_ar : product.material_en;
  const shipping = isRtl ? product.shipping_ar : product.shipping_en;
  const returnPolicy = isRtl ? product.returnPolicy_ar : product.returnPolicy_en;

  const currentPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock <= 0;

  // Find similar products
  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast(lang === "ar" ? "يرجى كتابة تعليق مراجعة مناسب" : "Please enter a valid review comment", "error");
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      userName: lang === "ar" ? "عميل فيج النخبة" : "Vogue Elite Customer",
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split("T")[0]
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewComment("");
    addToast(lang === "ar" ? "تم نشر مراجعتك بنجاح. شكراً لك!" : "Review submitted successfully. Thank you!", "success");
  };

  const mergedReviews = [...reviewsList, ...product.reviews];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-none shadow-2xl overflow-hidden my-8"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 dark:bg-neutral-950/80 hover:bg-[#f9f9f9] dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 rounded-none p-2 border border-neutral-200 dark:border-neutral-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image gallery + 360 Slider */}
          <div className="p-6 md:p-8 bg-[#fdfdfd] dark:bg-neutral-950/40 flex flex-col justify-between border-r border-neutral-150 dark:border-neutral-900">
            <div className="flex-grow flex flex-col items-center justify-center relative">
              {/* Image zoom stage */}
              <div 
                className={`w-full aspect-[3/4] rounded-none overflow-hidden bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 shadow-sm flex items-center justify-center relative ${!is360Mode ? "cursor-zoom-in" : ""}`}
                onMouseMove={is360Mode ? undefined : handleMouseMove}
                onMouseEnter={is360Mode ? undefined : handleMouseEnter}
                onMouseLeave={is360Mode ? undefined : handleMouseLeave}
                onTouchStart={is360Mode ? undefined : handleTouchStart}
                onTouchMove={is360Mode ? undefined : handleTouchMove}
                onTouchEnd={is360Mode ? undefined : handleTouchEnd}
              >
                {is360Mode ? (
                  <img
                    src={product.images[rotateIndex % product.images.length]}
                    alt={`${name} 360 View`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                ) : (
                  <>
                    <img
                      src={product.images[activeImageIndex]}
                      alt={name}
                      referrerPolicy="no-referrer"
                      style={zoomStyle}
                      className="w-full h-full object-cover transition-transform duration-150 ease-out select-none pointer-events-none"
                    />
                    
                    {/* Visual luxury overlay/helper */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between pointer-events-none z-10">
                      <div className="bg-black/70 dark:bg-neutral-900/80 text-[8px] font-mono font-bold tracking-widest text-neutral-200 uppercase py-1 px-2 border border-white/10 flex items-center gap-1 shadow-sm backdrop-blur-[2px]">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse inline-block" />
                        {isRtl ? "خامة فاخرة" : "LUXURIOUS TEXTURE"}
                      </div>
                      
                      <div className="bg-black/70 dark:bg-neutral-900/80 text-[8px] font-bold tracking-widest text-neutral-100 uppercase py-1 px-2 border border-white/10 flex items-center gap-1 shadow-sm backdrop-blur-[2px]">
                        <ZoomIn className="w-3 h-3 text-amber-500" />
                        <span>
                          {isZoomed 
                            ? (isRtl ? "تكبير ٢.٥ ضعف" : "PAN TO INSPECT • 2.5X") 
                            : (isRtl ? "افحص التفاصيل (مرر)" : "HOVER TO INSPECT TEXTURE")}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 360 view control */}
              <div className="w-full flex flex-col items-center gap-1.5 mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setIs360Mode(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-none uppercase tracking-widest border transition-all cursor-pointer ${
                      !is360Mode
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-850"
                    }`}
                  >
                    {lang === "ar" ? "معرض الصور" : "Standard view"}
                  </button>
                  <button
                    onClick={() => {
                      setIs360Mode(true);
                      setRotateIndex(0);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-none uppercase tracking-widest border transition-all cursor-pointer ${
                      is360Mode
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-850"
                    }`}
                  >
                    {lang === "ar" ? "رؤية ٣٦٠ درجة" : "360° interactive view"}
                  </button>
                </div>

                {is360Mode && (
                  <div className="w-full px-8 mt-2.5">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={rotateIndex}
                      onChange={(e) => setRotateIndex(parseInt(e.target.value))}
                      className="w-full accent-neutral-800 dark:accent-neutral-200 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-none cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500 text-center uppercase tracking-widest mt-1">
                      {lang === "ar" ? "اسحب لتدوير القطعة" : "Slide to rotate apparel"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {!is360Mode && product.images.length > 1 && (
              <div className="flex gap-2 justify-center mt-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-none overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? "border-neutral-900 dark:border-white scale-105" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: product info */}
          <div className="p-6 md:p-8 flex flex-col justify-between text-neutral-900 dark:text-neutral-100">
            <div>
              {/* Breadcrumb & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest">
                  {product.brand} • {categoryLabel}
                </span>
                <div className="flex items-center gap-1.5 bg-[#f9f9f9] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 px-2.5 py-1 rounded-none text-xs">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-neutral-450 dark:text-neutral-500">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-xl md:text-2xl font-serif font-extrabold tracking-wide text-neutral-900 dark:text-neutral-100 mb-1 uppercase">
                {name}
              </h1>
              <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
                {t.sku}: {product.sku}
              </p>

              {/* Pricing section */}
              <div className="flex items-baseline gap-3 mb-6 bg-[#f9f9f9] dark:bg-neutral-950/80 p-3 rounded-none border border-neutral-200 dark:border-neutral-850 w-fit">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
                      -{product.discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-2">
                  {lang === "ar" ? "الوصف" : "Overview"}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed text-justify">
                  {longDesc}
                </p>
              </div>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-2 flex items-center gap-1.5">
                    <span>{t.color}:</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-extrabold text-xs">
                      {selectedColor ? (isRtl ? selectedColor.name_ar : selectedColor.name_en) : ""}
                    </span>
                  </h3>
                  <div className="flex gap-2.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-6.5 h-6.5 rounded-none border transition-transform cursor-pointer hover:scale-110 ${
                          selectedColor?.hex === color.hex ? "border-neutral-900 dark:border-white scale-110 ring-2 ring-neutral-200 dark:ring-neutral-800" : "border-neutral-300 dark:border-neutral-800"
                        }`}
                        title={isRtl ? color.name_ar : color.name_en}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-2">
                    {t.size}: <span className="text-neutral-900 dark:text-neutral-100 font-extrabold">{selectedSize}</span>
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 h-10 px-3 text-xs font-bold rounded-none border transition-all cursor-pointer ${
                          selectedSize === size
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                            : "bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-850 hover:border-black dark:hover:border-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Spec Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 px-3 rounded-none border border-neutral-200 dark:border-neutral-850 bg-[#fdfdfd] dark:bg-neutral-950/40 mb-6">
                <div>
                  <span className="text-[10px] uppercase text-neutral-450 dark:text-neutral-500 tracking-wider font-bold block">{t.material}</span>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{material}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-450 dark:text-neutral-500 tracking-wider font-bold block">{t.weight}</span>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{product.weight_kg} kg</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3 mb-8 border-t border-neutral-150 dark:border-neutral-900 pt-4 text-neutral-600 dark:text-neutral-300">
                <div className="flex gap-2.5">
                  <Truck className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                  <p className="text-xs">{shipping}</p>
                </div>
                <div className="flex gap-2.5">
                  <RefreshCw className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                  <p className="text-xs">{returnPolicy}</p>
                </div>
              </div>

              {/* Purchase Quantities & Actions */}
              {!isOutOfStock ? (
                <div className="flex gap-4 mb-8">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 rounded-none p-1 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-neutral-450 hover:text-black dark:text-neutral-400 dark:hover:text-white font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-neutral-450 hover:text-black dark:text-neutral-400 dark:hover:text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, selectedSize, selectedColor, quantity);
                      addToast(t.addedToCart, "success");
                    }}
                    className="flex-grow bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToWishlist(product);
                    }}
                    className={`p-3.5 rounded-none border transition-colors cursor-pointer ${
                      isWishlisted
                        ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/60"
                        : "bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-450 hover:text-black dark:hover:text-white border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`} />
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 dark:bg-red-950/30 dark:border-red-900/40 p-4 rounded-none text-center mb-8">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">
                    {t.outOfStock}
                  </p>
                </div>
              )}
            </div>

            {/* Related Products Widget */}
            {similarProducts.length > 0 && (
              <div className="border-t border-neutral-150 dark:border-neutral-900 pt-6 mb-8">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-4">
                  {t.similarProducts}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {similarProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onQuickView(p)}
                      className="group cursor-pointer bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-none p-2 flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-none mb-2 bg-[#f5f5f5] dark:bg-neutral-900">
                        <img
                          src={p.images[0]}
                          alt={p.name_en}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="text-[11px] font-bold tracking-wide text-neutral-800 dark:text-neutral-200 line-clamp-1 mb-1 group-hover:text-neutral-950 dark:group-hover:text-white">
                        {isRtl ? p.name_ar : p.name_en}
                      </h4>
                      <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-450 block">
                        {formatPrice(p.discountPrice || p.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Reviews Section */}
            <div className="border-t border-neutral-150 dark:border-neutral-900 pt-6">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-4 flex items-center gap-1.5">
                <span>{t.reviews}</span>
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-2.5 py-0.5 rounded-none font-bold">
                  {mergedReviews.length}
                </span>
              </h3>

              {/* Form to submit reviews */}
              <form onSubmit={handleReviewSubmit} className="bg-[#f9f9f9] dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-4 rounded-none mb-6 space-y-3.5">
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                  {t.writeReview}
                </p>
                <div>
                  <label className="block text-[10px] uppercase text-neutral-450 dark:text-neutral-500 tracking-wider font-bold mb-1">
                    {t.yourRating}
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-yellow-500 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? "fill-yellow-500" : "text-neutral-300 dark:text-neutral-700"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-neutral-450 dark:text-neutral-500 tracking-wider font-bold mb-1">
                    {t.yourComment}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب رأيك الصادق في جودة هذه القطعة..." : "Describe the material, sizing, and overall quality..."}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-none cursor-pointer transition-colors"
                >
                  {t.submitReview}
                </button>
              </form>

              {/* Reviews listing */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {mergedReviews.length === 0 ? (
                  <p className="text-xs text-neutral-450 dark:text-neutral-500 text-center py-4">
                    {lang === "ar" ? "لا توجد مراجعات لهذه القطعة حتى الآن" : "No reviews submitted for this premium piece yet."}
                  </p>
                ) : (
                  mergedReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-neutral-150 dark:border-neutral-900/60 pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-neutral-850 dark:text-neutral-200">{rev.userName}</span>
                        <span className="text-[10px] text-neutral-450 dark:text-neutral-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-200 dark:text-neutral-800"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
