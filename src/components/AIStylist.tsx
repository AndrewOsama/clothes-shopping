/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquareCode, ArrowRight, ArrowLeft, RotateCw } from "lucide-react";
import { locales } from "../locales";
import { CartItem, Product } from "../types";

interface AIStylistProps {
  lang: "en" | "ar";
  currentCart: CartItem[];
  wishlist: Product[];
  allProducts: Product[];
  onQuickView: (product: Product) => void;
  currency: string;
  exchangeRate: number;
}

export default function AIStylist({
  lang,
  currentCart,
  wishlist,
  allProducts,
  onQuickView,
  currency,
  exchangeRate
}: AIStylistProps) {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stylistResponse, setStylistResponse] = useState<string | null>(null);
  const [suggestedSKUs, setSuggestedSKUs] = useState<string[]>([]);

  const isRtl = lang === "ar";
  const t = locales[lang];

  // Sartorial Inspiration chips
  const inspirationChips = isRtl
    ? [
        { label: "زفاف صيفي مسائي في الرياض", prompt: "اقترح لي إطلالة فاخرة وباردة لحفل زفاف صيفي مسائي في الرياض" },
        { label: "أسلوب باريس الكلاسيكي المريح", prompt: "أريد تنسيق قطع رجالية مريحة على الطراز الباريسي الكلاسيكي الفخم" },
        { label: "إطلالة شاطئية بملابس الكتان الراقية", prompt: "ما هي أفضل توليفة لملابس الكتان الراقية للرجال لقضاء عطلة على البحر؟" },
        { label: "ملابس طبقات شتوية كشمير وصوف", prompt: "كيف أنسق معطف الصوف مع كنزة الكشمير النسائية في طبقات شتوية دافئة وراقية؟" }
      ]
    : [
        { label: "Riyadh Summer Evening Wedding", prompt: "Suggest a sleek, luxurious, and breathable look for a summer evening wedding in Riyadh" },
        { label: "Parisian Minimalist Runway Vibe", prompt: "Design a luxurious, understated Parisian runway aesthetic for an elite dinner" },
        { label: "Premium Coastal Linen Combo", prompt: "What is the perfect premium linen combination for an elite seaside resort weekend?" },
        { label: "Cashmere & Wool Warm Winter Layering", prompt: "How can I pair the wool overcoat with the cashmere sweater for premium winter layers?" }
      ];

  const handleInspirationClick = (promptText: string) => {
    setUserInput(promptText);
  };

  const handleConsultStylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setStylistResponse(null);
    setSuggestedSKUs([]);

    try {
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: userInput,
          language: lang,
          currentCart: currentCart.map((item) => ({ sku: item.product.sku, name: item.product.name_en })),
          wishlistProducts: wishlist.map((p) => p.sku)
        })
      });

      const data = await response.json();
      if (data.success) {
        setStylistResponse(data.text);

        // Simple Regex to extract SKUs from text to display quick-action recommendations
        const skuRegex = /VG-[A-Z]-[A-Z]{3}-\d{2}/g;
        const matches = data.text.match(skuRegex) || [];
        // Remove duplicates
        const uniqueSKUs = Array.from(new Set(matches)) as string[];
        setSuggestedSKUs(uniqueSKUs);
      } else {
        setStylistResponse(isRtl ? data.message_ar : data.message_en);
      }
    } catch (err) {
      console.error(err);
      setStylistResponse(
        isRtl
          ? "فشل الاتصال بالمنسق الذكي. يرجى التأكد من تشغيل خادم التطبيق وإدخال مفتاح GEMINI_API_KEY بنجاح."
          : "Failed to connect to AI Stylist. Ensure the backend server is running and GEMINI_API_KEY is configured."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Map extracted SKUs back to actual products
  const recommendedProducts = allProducts.filter((p) => suggestedSKUs.includes(p.sku));

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto rounded-none shadow-sm">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
          {t.aiStylist}
        </h1>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-relaxed">
          {t.aiStylistDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Prompt input & chips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-250 flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-neutral-400" />
              <span>{lang === "ar" ? "ابدأ الاستشارة الفورية" : "Sartorial Consultation Inquiry"}</span>
            </h2>

            {/* Inspiration Chips */}
            <div className="space-y-2">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                {lang === "ar" ? "نماذج ملهمة للتجربة:" : "Sartorial Inspiration Templates:"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {inspirationChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInspirationClick(chip.prompt)}
                    className="bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-850 hover:border-black dark:hover:border-white px-3 py-1.5 rounded-none text-[10px] font-medium transition-colors cursor-pointer text-start leading-tight"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Prompt Form */}
            <form onSubmit={handleConsultStylistSubmit} className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t.aiStylistPlaceholder}
                rows={4}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 rounded-none p-4 text-xs outline-none transition-colors leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 font-bold uppercase tracking-widest py-3 px-6 rounded-none text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-30 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.aiStylistThinking}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.aiStylistPrompt}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Response Text Screen */}
          <AnimatePresence>
            {stylistResponse && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 pb-3 border-b border-neutral-200 dark:border-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
                  <span>{t.aiStylistResponse}</span>
                </h3>

                <div className="text-neutral-800 dark:text-neutral-300 text-xs leading-relaxed space-y-4 whitespace-pre-wrap text-justify">
                  {/* Clean presentation for Markdown text */}
                  {stylistResponse}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Suggested Products */}
        <div className="space-y-6">
          <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm h-fit">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-4 flex items-center justify-between">
              <span>{lang === "ar" ? "القطع الموصى بها" : "Sartorial Recommendations"}</span>
              <span className="text-[10px] bg-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 rounded-none font-mono">{recommendedProducts.length}</span>
            </h3>

            {recommendedProducts.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto stroke-[1] mb-3" />
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal">
                  {lang === "ar"
                    ? "عند استشارة المنسق الذكي، سوف تظهر القطع الحقيقية الموصى بها للشراء السريع هنا."
                    : "When you consult the AI Stylist, real shop apparel recommendations will appear here for fast preview."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedProducts.map((p) => {
                  const nameStr = isRtl ? p.name_ar : p.name_en;
                  const priceStr = `${Math.round((p.discountPrice || p.price) * exchangeRate)} ${currency}`;

                  return (
                    <div
                      key={p.id}
                      onClick={() => onQuickView(p)}
                      className="group cursor-pointer flex gap-3 p-3 rounded-none bg-white dark:bg-[#181615] border border-neutral-200 dark:border-neutral-900 hover:border-black dark:hover:border-white transition-all shadow-sm"
                    >
                      <img
                        src={p.images[0]}
                        alt={nameStr}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover rounded-none bg-neutral-100 dark:bg-neutral-950 shrink-0 border border-neutral-150 dark:border-neutral-900"
                      />
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div>
                          <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">{nameStr}</p>
                          <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">{p.brand}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-mono text-neutral-800 dark:text-neutral-300">{priceStr}</span>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1 border-b border-transparent group-hover:border-black dark:group-hover:border-white pb-0.5">
                            {t.quickView}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
