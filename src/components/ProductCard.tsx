/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Star, Eye, ShoppingBag, Heart } from "lucide-react";
import { Product } from "../types";
import { locales } from "../locales";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  lang: "en" | "ar";
  currency: string;
  exchangeRate: number;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: any) => void;
  onAddToWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  lang,
  currency,
  exchangeRate,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  isWishlisted
}: ProductCardProps) {
  const isRtl = lang === "ar";
  const t = locales[lang];

  const formatPrice = (priceUSD: number) => {
    const converted = Math.round(priceUSD * exchangeRate);
    return `${converted} ${currency}`;
  };

  const name = isRtl ? product.name_ar : product.name_en;
  const shortDesc = isRtl ? product.short_desc_ar : product.short_desc_en;

  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col justify-between overflow-hidden bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-100 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-none hover:shadow-xl transition-all duration-300"
    >
      {/* Badges Overlay */}
      <div className={`absolute top-3 z-10 flex flex-col gap-1.5 ${isRtl ? "right-3" : "left-3"}`}>
        {product.discountPercent && (
          <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
            -{product.discountPercent}%
          </span>
        )}
        {product.newArrival && (
          <span className="bg-black text-white dark:bg-white dark:text-black text-[9px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
            {t.newArrivals}
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black text-[9px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
            {t.bestSellers}
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-neutral-400 text-white dark:bg-neutral-600 text-[9px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
            {t.outOfStock}
          </span>
        )}
      </div>

      {/* Wishlist Button Overlay */}
      <button
        onClick={() => onAddToWishlist(product)}
        className={`absolute top-3 z-10 p-2 bg-white/95 dark:bg-neutral-900/95 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors shadow-sm cursor-pointer border border-neutral-100 dark:border-neutral-800 ${
          isRtl ? "left-3" : "right-3"
        }`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-all ${
            isWishlisted ? "fill-red-600 text-red-600 scale-110" : "text-neutral-500 hover:text-neutral-950"
          }`}
        />
      </button>

      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-950">
        <img
          src={product.images[0]}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
        />

        {/* Hover Action Menu */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2 bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            {t.quickView}
          </button>
          {!isOutOfStock && (
            <button
              onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
              className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              {t.addToCart}
            </button>
          )}
        </div>
      </div>

      {/* Product Description details */}
      <div className="p-4 flex flex-col flex-grow bg-white dark:bg-[#141211]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-neutral-800 fill-neutral-800 dark:text-neutral-200 dark:fill-neutral-200 shrink-0" />
            <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300">{product.rating}</span>
          </div>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity line-clamp-1 mb-1 cursor-pointer" onClick={() => onQuickView(product)}>
          {name}
        </h3>

        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed mb-4 flex-grow">
          {shortDesc}
        </p>

        {/* Price & Actions Row */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900">
          <div className="flex items-baseline gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-[10px] text-neutral-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors underline underline-offset-4"
          >
            {t.quickView}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
