/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { CartItem, Coupon } from "../types";
import { locales } from "../locales";
import { mockCoupons } from "../productsData";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lang: "en" | "ar";
  currency: string;
  exchangeRate: number;
  onUpdateQty: (idx: number, qty: number) => void;
  onRemoveItem: (idx: number) => void;
  onCheckout: () => void;
  activeCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  lang,
  currency,
  exchangeRate,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  activeCoupon,
  onApplyCoupon,
  addToast
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");

  if (!isOpen) return null;

  const isRtl = lang === "ar";
  const t = locales[lang];

  const formatPrice = (priceUSD: number) => {
    const converted = Math.round(priceUSD * exchangeRate);
    return `${converted} ${currency}`;
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;

  const taxAmount = discountedSubtotal * 0.15; // 15% VAT
  const shippingCost = subtotal > 150 ? 0 : 15; // Free shipping over 150

  const grandTotal = discountedSubtotal + taxAmount + shippingCost;

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const matched = mockCoupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (matched) {
      if (subtotal < matched.minSpend) {
        addToast(
          lang === "ar"
            ? `الحد الأدنى للاستفادة من هذا الكود هو ${formatPrice(matched.minSpend)}`
            : `Minimum spend of ${formatPrice(matched.minSpend)} is required for this code`,
          "error"
        );
        return;
      }
      onApplyCoupon({
        code: matched.code,
        discountPercent: matched.discountPercent,
        minSpend: matched.minSpend,
        description_en: matched.description_en,
        description_ar: matched.description_ar
      });
      addToast(t.couponApplied, "success");
    } else {
      addToast(t.invalidCoupon, "error");
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponCode("");
    addToast(lang === "ar" ? "تمت إزالة كود الخصم" : "Discount code removed", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      {/* Background Mask Clickout */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: isRtl ? "-100%" : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: isRtl ? "-100%" : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`relative w-full max-w-md h-full bg-white dark:bg-[#141211] border-neutral-100 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl flex flex-col justify-between z-10 ${
          isRtl ? "border-r text-right mr-auto" : "border-l text-left ml-auto"
        }`}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            <h2 className="text-sm font-bold tracking-widest uppercase">
              {t.cart} ({cart.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors p-2 rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-[1]" />
              <p className="text-xs text-neutral-500 tracking-wider">
                {t.cartEmpty}
              </p>
              <button
                onClick={onClose}
                className="text-xs uppercase font-bold tracking-widest text-black dark:text-white border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-6 py-2.5 rounded-none transition-all cursor-pointer"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                const itemName = isRtl ? item.product.name_ar : item.product.name_en;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-3 rounded-none bg-[#f9f9f9] dark:bg-[#181615] border border-neutral-100 dark:border-neutral-900"
                  >
                    {/* Item Image */}
                    <div className="w-18 h-24 rounded-none overflow-hidden bg-neutral-100 dark:bg-neutral-950 shrink-0">
                      <img src={item.product.images[0]} alt={itemName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>

                    {/* Item Description */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {itemName}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                          {item.product.brand}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 px-2 py-0.5 rounded-none text-neutral-600 dark:text-neutral-300">
                            {t.size}: <strong className="font-bold text-neutral-900 dark:text-neutral-100">{item.selectedSize}</strong>
                          </span>
                          {item.selectedColor && (
                            <span className="flex items-center gap-1.5 text-[10px] bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 px-2 py-0.5 rounded-none text-neutral-600 dark:text-neutral-300">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-neutral-300 block"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span>{isRtl ? item.selectedColor.name_ar : item.selectedColor.name_en}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity adjusting & removing */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-none p-0.5">
                          <button
                            onClick={() => onUpdateQty(idx, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white font-bold cursor-pointer text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(idx, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white font-bold cursor-pointer text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {formatPrice(itemPrice * item.quantity)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer calculations */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 bg-[#f9f9f9] dark:bg-[#0c0a0a] space-y-4">
            {/* Promo code Form */}
            <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                disabled={!!activeCoupon}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={activeCoupon ? activeCoupon.code : t.couponPlaceholder}
                className={`flex-grow bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 rounded-none px-3 py-2 text-xs outline-none uppercase font-bold tracking-wider ${
                  activeCoupon ? "opacity-60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950" : ""
                }`}
              />
              {activeCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/60 dark:hover:bg-red-950 dark:text-red-400 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  {lang === "ar" ? "حذف" : "Remove"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  {t.applyCoupon}
                </button>
              )}
            </form>

            {activeCoupon && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1">
                ✓ {isRtl ? activeCoupon.description_ar : activeCoupon.description_en}
              </p>
            )}

            {/* Calculations Log */}
            <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800/80 pb-4">
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{t.subtotal}</span>
                <span className="font-mono font-bold">{formatPrice(subtotal)}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>{t.discount} (-{discountPercent}%)</span>
                  <span className="font-mono font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{t.tax}</span>
                <span className="font-mono font-bold">{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{t.shipping}</span>
                <span className="font-mono font-bold">{shippingCost === 0 ? (lang === "ar" ? "مجاني" : "Complimentary") : formatPrice(shippingCost)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{t.total}</span>
              <span className="text-base font-black font-mono text-neutral-900 dark:text-neutral-100">{formatPrice(grandTotal)}</span>
            </div>

            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 py-3.5 rounded-none text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{t.checkout}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
