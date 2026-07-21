/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { locales } from "../locales";
import { AppUser } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ar";
  onLoginSuccess: (user: AppUser) => void;
  addToast: (msg: string, type: "success" | "error") => void;
}

export default function AuthModal({ isOpen, onClose, lang, onLoginSuccess, addToast }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const t = locales[lang];
  const isRtl = lang === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      if (!email || !password) {
        addToast(lang === "ar" ? "يرجى تعبئة كافة الحقول" : "Please fill in all fields", "error");
        return;
      }
      // Check for Admin simulation
      const isAdmin = email.toLowerCase().includes("admin");
      const user: AppUser = {
        id: isAdmin ? "admin-id" : "user-101",
        name: isAdmin ? "Sartorial Director" : name || email.split("@")[0],
        email: email,
        phone: phone || "+966 50 123 4567",
        role: isAdmin ? "admin" : "customer",
        addresses: []
      };
      onLoginSuccess(user);
      addToast(
        lang === "ar" 
          ? `أهلاً بك، ${user.name}! تم تسجيل الدخول بنجاح.` 
          : `Welcome, ${user.name}! Signed in successfully.`,
        "success"
      );
      onClose();
    } else if (mode === "register") {
      if (!name || !email || !password) {
        addToast(lang === "ar" ? "يرجى تعبئة الحقول الأساسية" : "Please fill in all required fields", "error");
        return;
      }
      const user: AppUser = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
        phone: phone,
        role: "customer",
        addresses: []
      };
      onLoginSuccess(user);
      addToast(
        lang === "ar"
          ? "تهانينا! تم إنشاء حسابك الفاخر بنجاح."
          : "Congratulations! Your luxury profile was created successfully.",
        "success"
      );
      onClose();
    } else {
      // Forgot password
      if (!email) {
        addToast(lang === "ar" ? "يرجى كتابة البريد الإلكتروني" : "Please write your email address", "error");
        return;
      }
      addToast(
        lang === "ar"
          ? "تم إرسال رابط استعادة كلمة المرور لبريدك الإلكتروني."
          : "A secure password reset link has been dispatched to your email.",
        "success"
      );
      setMode("login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-[#141211] border border-neutral-200 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-none shadow-2xl p-8"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-xl font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-2">
            {mode === "login" ? t.login : mode === "register" ? t.register : t.forgotPassword}
          </h2>
          <p className="text-xs text-neutral-450 dark:text-neutral-400 tracking-wider">
            {mode === "login"
              ? (lang === "ar" ? "ادخل إلى عالم الأناقة الفخمة" : "Access your bespoke wardrobe")
              : mode === "register"
              ? (lang === "ar" ? "انضم للحصول على مميزات النخبة" : "Join the exclusive insider circle")
              : (lang === "ar" ? "استعد صلاحية الدخول لحسابك" : "Request credentials reset")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">
                {t.fullName}
              </label>
              <div className="relative flex items-center">
                <User className={`absolute w-4 h-4 text-neutral-400 dark:text-neutral-500 ${isRtl ? "right-3" : "left-3"}`} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: عبد الله العتيبي" : "e.g., Alexander McQueen"}
                  className={`w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-none py-2.5 text-sm outline-none transition-colors ${
                    isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">
              {t.email}
            </label>
            <div className="relative flex items-center">
              <Mail className={`absolute w-4 h-4 text-neutral-400 dark:text-neutral-500 ${isRtl ? "right-3" : "left-3"}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip@vogue.com"
                className={`w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-none py-2.5 text-sm outline-none transition-colors ${
                  isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
              />
            </div>
            {mode === "login" && (
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                {lang === "ar" ? "نصيحة: استخدم بريداً يحتوي على 'admin' لتجربة لوحة التحكم" : "Tip: Use an email with 'admin' to try the Admin Suite"}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">
                {t.phone}
              </label>
              <div className="relative flex items-center">
                <Phone className={`absolute w-4 h-4 text-neutral-400 dark:text-neutral-500 ${isRtl ? "right-3" : "left-3"}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className={`w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-none py-2.5 text-sm outline-none transition-colors ${
                    isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  }`}
                />
              </div>
            </div>
          )}

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold">
                  {lang === "ar" ? "كلمة المرور" : "Password"}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white underline decoration-neutral-200 dark:decoration-neutral-800"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className={`absolute w-4 h-4 text-neutral-400 dark:text-neutral-500 ${isRtl ? "right-3" : "left-3"}`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-none py-2.5 text-sm outline-none transition-colors ${
                    isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  }`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black font-bold uppercase tracking-widest py-3 text-xs rounded-none transition-colors cursor-pointer mt-4 flex items-center justify-center gap-2"
          >
            <span>{mode === "login" ? t.login : mode === "register" ? t.register : t.forgotPassword}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-widest font-medium">
            {t.orWith}
          </span>
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onLoginSuccess({
                id: "google-user",
                name: "Google VIP User",
                email: "google.vip@gmail.com",
                role: "customer",
                addresses: []
              });
              addToast(lang === "ar" ? "تم تسجيل الدخول بواسطة Google بنجاح" : "Signed in with Google successfully", "success");
              onClose();
            }}
            className="flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 hover:bg-[#f9f9f9] dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 py-2.5 rounded-none text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="font-extrabold text-rose-600">G</span> Google
          </button>
          <button
            onClick={() => {
              onLoginSuccess({
                id: "fb-user",
                name: "Facebook VIP User",
                email: "fb.vip@facebook.com",
                role: "customer",
                addresses: []
              });
              addToast(lang === "ar" ? "تم تسجيل الدخول بواسطة Facebook بنجاح" : "Signed in with Facebook successfully", "success");
              onClose();
            }}
            className="flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 hover:bg-[#f9f9f9] dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 py-2.5 rounded-none text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="font-extrabold text-blue-600">f</span> Facebook
          </button>
        </div>

        <div className="text-center mt-6">
          {mode === "login" ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {lang === "ar" ? "ليس لديك حساب؟" : "New to Vogue?"}{" "}
              <button
                onClick={() => setMode("register")}
                className="text-neutral-900 dark:text-neutral-100 hover:underline font-bold"
              >
                {t.register}
              </button>
            </p>
          ) : (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode("login")}
                className="text-neutral-900 dark:text-neutral-100 hover:underline font-bold"
              >
                {t.login}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
