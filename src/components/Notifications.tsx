/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationsProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
  lang: "en" | "ar";
}

export default function Notifications({ toasts, removeToast, lang }: NotificationsProps) {
  const isRtl = lang === "ar";

  return (
    <div
      className={`fixed top-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 ${
        isRtl ? "left-0 sm:left-5" : "right-0 sm:right-5"
      }`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-3 p-4 rounded-none shadow-md border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-white dark:bg-[#141211] border-neutral-250 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100"
                : toast.type === "error"
                ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200"
                : "bg-white dark:bg-[#141211] border-neutral-250 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-xs uppercase tracking-widest font-bold flex-grow leading-normal">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
