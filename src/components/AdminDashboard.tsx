/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Box,
  PlusCircle,
  Tag,
  Settings,
  ArrowRight,
  ArrowLeft,
  CircleDollarSign,
  ClipboardList,
  Edit,
  Trash2,
  Save,
  Undo
} from "lucide-react";
import { Product, Order, Coupon, AppUser } from "../types";
import { locales } from "../locales";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdminDashboardProps {
  lang: "en" | "ar";
  currency: string;
  exchangeRate: number;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: any) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function AdminDashboard({
  lang,
  currency,
  exchangeRate,
  products,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  orders,
  onUpdateOrderStatus,
  coupons,
  onAddCoupon,
  addToast
}: AdminDashboardProps) {
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "coupons">("overview");

  // Add Product Form State
  const [newProductNameEn, setNewProductNameEn] = useState("");
  const [newProductNameAr, setNewProductNameAr] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(120);
  const [newProductCategory, setNewProductCategory] = useState<any>("men");
  const [newProductStock, setNewProductStock] = useState(25);
  const [newProductImage, setNewProductImage] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(100);

  const isRtl = lang === "ar";
  const t = locales[lang];

  const formatPrice = (priceUSD: number) => {
    const converted = Math.round(priceUSD * exchangeRate);
    return `${converted} ${currency}`;
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setNewProductNameEn(prod.name_en);
    setNewProductNameAr(prod.name_ar);
    setNewProductPrice(prod.price);
    setNewProductCategory(prod.category);
    setNewProductStock(prod.stock);
    setNewProductImage(prod.images[0] || "");
    
    addToast(
      lang === "ar" ? "تم تحميل بيانات المنتج في نموذج التعديل" : "Product loaded into editor form",
      "info"
    );
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProductNameEn("");
    setNewProductNameAr("");
    setNewProductPrice(120);
    setNewProductCategory("men");
    setNewProductStock(25);
    setNewProductImage("");
  };

  // Computations for Analytics Card
  const totalSalesVal = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersVal = orders.length;
  const activeCustomersCount = Array.from(new Set(orders.map((o) => o.billingAddress.email))).length;

  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Chart Data preparation (Recharts)
  const chartData = isRtl
    ? [
        { name: "فبراير", sales: 12000 },
        { name: "مارس", sales: 19000 },
        { name: "أبريل", sales: 15000 },
        { name: "مايو", sales: 28000 },
        { name: "يونيو", sales: 32000 },
        { name: "يوليو", sales: 45000 }
      ]
    : [
        { name: "Feb", sales: 12000 },
        { name: "Mar", sales: 19000 },
        { name: "Apr", sales: 15000 },
        { name: "May", sales: 28000 },
        { name: "Jun", sales: 32000 },
        { name: "Jul", sales: 45000 }
      ];

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductNameEn || !newProductNameAr || !newProductImage) {
      addToast(lang === "ar" ? "يرجى ملء جميع الحقول للمنتج" : "Please fill in all product fields", "error");
      return;
    }

    if (editingProduct) {
      const updatedProd: Product = {
        ...editingProduct,
        category: newProductCategory,
        category_en: newProductCategory.toUpperCase(),
        category_ar: newProductCategory === "men" ? "رجال" : newProductCategory === "women" ? "نساء" : newProductCategory === "kids" ? "أطفال" : newProductCategory === "shoes" ? "أحذية" : newProductCategory === "bags" ? "حقائب" : newProductCategory === "accessories" ? "إكسسوارات" : "ملابس رياضية",
        name_en: newProductNameEn,
        name_ar: newProductNameAr,
        price: newProductPrice,
        stock: newProductStock,
        images: [newProductImage, ...editingProduct.images.slice(1)]
      };

      onUpdateProduct(updatedProd);
      addToast(
        lang === "ar"
          ? `تم تعديل القطعة ${newProductNameAr} بنجاح`
          : `Updated apparel ${newProductNameEn} successfully`,
        "success"
      );
      handleCancelEdit();
      return;
    }

    const skuCode = `VG-${newProductCategory[0].toUpperCase()}-ADD-${Math.floor(10 + Math.random() * 89)}`;

    const addedProd: Product = {
      id: `added-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      sku: skuCode,
      brand: "Vogue Maison",
      category: newProductCategory,
      category_en: newProductCategory.toUpperCase(),
      category_ar: newProductCategory === "men" ? "رجال" : newProductCategory === "women" ? "نساء" : newProductCategory === "kids" ? "أطفال" : newProductCategory === "shoes" ? "أحذية" : newProductCategory === "bags" ? "حقائب" : newProductCategory === "accessories" ? "إكسسوارات" : "ملابس رياضية",
      name_en: newProductNameEn,
      name_ar: newProductNameAr,
      short_desc_en: "Exquisite new selection.",
      short_desc_ar: "تشكيلة حصرية مضافة حديثاً.",
      long_desc_en: "Crafted to meet the absolute highest standards of design.",
      long_desc_ar: "صممت بعناية لتطابق أعلى معايير التصاميم العالمية الفخمة.",
      price: newProductPrice,
      rating: 5.0,
      reviewsCount: 1,
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name_en: "Noir Black", name_ar: "أسود داكن", hex: "#111111" }],
      material_en: "100% Organic Fibers",
      material_ar: "١٠٠٪ ألياف طبيعية عضوية",
      weight_kg: 0.5,
      stock: newProductStock,
      images: [newProductImage],
      shipping_en: "Complimentary Delivery",
      shipping_ar: "توصيل سريع مجاني",
      returnPolicy_en: "30-day return",
      returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً",
      reviews: []
    };

    onAddProduct(addedProd);
    addToast(
      lang === "ar"
        ? `تمت إضافة القطعة ${newProductNameAr} للكتالوج بنجاح`
        : `Added apparel ${newProductNameEn} successfully`,
      "success"
    );

    // Reset Form
    handleCancelEdit();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const addedCoupon: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: newCouponPercent,
      minSpend: newCouponMin,
      description_en: `${newCouponPercent}% off luxury items on spend above $${newCouponMin}`,
      description_ar: `خصم ${newCouponPercent}٪ للمشتريات فوق ${newCouponMin} دولار`
    };

    onAddCoupon(addedCoupon);
    addToast(
      lang === "ar"
        ? `تم تفعيل كود الخصم الجديد ${addedCoupon.code}`
        : `Activated new discount voucher ${addedCoupon.code}`,
      "success"
    );
    setNewCouponCode("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 space-y-8" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Dashboard Nav bar tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f9f9f9] dark:bg-[#141211] p-4 rounded-none border border-neutral-150 dark:border-neutral-900">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-neutral-500 animate-spin" style={{ animationDuration: "12s" }} />
          <h1 className="text-xs font-extrabold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">
            {t.adminDashboard}
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: "overview", label: lang === "ar" ? "نظرة عامة" : "Metrics Overview" },
            { id: "products", label: lang === "ar" ? "المنتجات" : "Catalogue Product" },
            { id: "orders", label: lang === "ar" ? "الطلبات" : "Order Dispatch" },
            { id: "coupons", label: lang === "ar" ? "الكوبونات" : "Discounts Manager" }
          ].map((tabBtn) => (
            <button
              key={tabBtn.id}
              onClick={() => setTab(tabBtn.id as any)}
              className={`px-4 py-2 rounded-none text-xs font-bold tracking-wide uppercase transition-all cursor-pointer ${
                tab === tabBtn.id
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-450 border border-neutral-200 dark:border-neutral-850 hover:border-black dark:hover:border-white"
              }`}
            >
              {tabBtn.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Analytics Cards Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-5 rounded-none flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-550 tracking-wider font-bold block">{t.totalSales}</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">{formatPrice(totalSalesVal)}</span>
              </div>
            </div>

            <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-5 rounded-none flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-550 tracking-wider font-bold block">{t.totalOrders}</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">{totalOrdersVal}</span>
              </div>
            </div>

            <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-5 rounded-none flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-550 tracking-wider font-bold block">{t.totalCustomers}</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">{activeCustomersCount}</span>
              </div>
            </div>

            <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-5 rounded-none flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 flex items-center justify-center text-amber-600 dark:text-amber-500">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-550 tracking-wider font-bold block">{lang === "ar" ? "نقص المخزون" : "Critical Stock Warnings"}</span>
                <span className="text-lg font-black font-mono text-neutral-900 dark:text-neutral-100">{lowStockCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-500" />
                <span>{t.salesAnalytics}</span>
              </h3>
              <div className="w-full h-80 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "0px", color: "#111" }} />
                    <Line type="monotone" dataKey="sales" stroke="#111111" strokeWidth={3.5} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Micro Stocks list */}
            <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 mb-4">
                {t.inventoryStatus}
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {products.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200 dark:border-neutral-900 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">{isRtl ? p.name_ar : p.name_en}</p>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase">{p.sku}</span>
                    </div>
                    <span className={`font-mono font-bold px-3 py-1 rounded-none text-[10px] uppercase border ${
                      p.stock <= 5
                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400"
                        : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300"
                    }`}>
                      {p.stock} Qty
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "products" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Add / Edit Product Form */}
          <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm h-fit">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-5 flex items-center gap-2">
              {editingProduct ? (
                <>
                  <Edit className="w-4 h-4 text-amber-500" />
                  <span>{lang === "ar" ? "تعديل قطعة الملابس" : "Edit Luxury Garment"}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-neutral-500" />
                  <span>{lang === "ar" ? "إضافة قطعة ملابس جديدة" : "Add Luxury Garment"}</span>
                </>
              )}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Apparel Name (EN)</label>
                <input
                  type="text"
                  required
                  value={newProductNameEn}
                  onChange={(e) => setNewProductNameEn(e.target.value)}
                  placeholder="e.g. Silk Evening Blazer"
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">اسم المنتج (العربية)</label>
                <input
                  type="text"
                  required
                  value={newProductNameAr}
                  onChange={(e) => setNewProductNameAr(e.target.value)}
                  placeholder="مثال: بليزر سهرة حريري فاخر"
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Collection Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                >
                  <option value="men">Men's Apparel</option>
                  <option value="women">Women's Apparel</option>
                  <option value="kids">Kids' Collection</option>
                  <option value="shoes">Shoes Collection</option>
                  <option value="bags">Bags & Leather</option>
                  <option value="accessories">Accessories</option>
                  <option value="activewear">Activewear</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Fashion Image URL</label>
                <input
                  type="text"
                  required
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    editingProduct
                      ? "bg-amber-650 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-450 dark:text-neutral-950"
                      : "bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black"
                  }`}
                >
                  {editingProduct
                    ? (lang === "ar" ? "حفظ التعديلات الفاخرة" : "Save Haute Changes")
                    : (lang === "ar" ? "نشر القطعة بالكتالوج" : "Publish Premium Apparel")}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-350 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    {lang === "ar" ? "إلغاء التعديل" : "Cancel Edit"}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Catalog Listing */}
          <div className="lg:col-span-2 bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-5">
              {t.productManagement} ({products.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {products.map((p) => (
                <div key={p.id} className="flex gap-3 p-3 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 items-stretch">
                  <img
                    src={p.images[0]}
                    alt={p.name_en}
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 object-cover rounded-none bg-neutral-100 dark:bg-neutral-900 shrink-0 border border-neutral-150 dark:border-neutral-900"
                  />
                  <div className="flex-grow flex flex-col justify-between py-0.5 text-xs">
                    <div>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">{isRtl ? p.name_ar : p.name_en}</p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase">{p.sku} • {p.brand}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-extrabold text-neutral-750 dark:text-neutral-300 font-mono">{formatPrice(p.price)}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase">Stock: {p.stock}</span>
                    </div>
                  </div>
                  
                  {/* Action Panel for each Product Card */}
                  <div className="flex flex-col gap-2 justify-center pl-2.5 border-l border-neutral-200 dark:border-neutral-900/60 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2.5">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className={`p-1.5 transition-colors cursor-pointer rounded-none border ${
                        editingProduct?.id === p.id
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-300 dark:border-amber-900/50"
                          : "bg-[#fafafa] dark:bg-[#1c1a19] text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-amber-500 hover:border-amber-200"
                      }`}
                      title={lang === "ar" ? "تعديل" : "Edit"}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteProduct(p.id);
                        addToast(
                          lang === "ar" 
                            ? `تمت إزالة القطعة ${isRtl ? p.name_ar : p.name_en} من الكتالوج` 
                            : `Removed garment ${p.name_en} from catalog`, 
                          "info"
                        );
                        if (editingProduct?.id === p.id) {
                          handleCancelEdit();
                        }
                      }}
                      className="p-1.5 bg-[#fafafa] dark:bg-[#1c1a19] text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:text-rose-500 hover:border-rose-200 transition-colors cursor-pointer rounded-none"
                      title={lang === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm"
        >
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-450 font-extrabold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-6 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-neutral-500" />
            <span>{t.recentOrders} ({orders.length})</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" style={{ direction: isRtl ? "rtl" : "ltr" }}>
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-900 text-neutral-500 dark:text-neutral-450 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-3 px-4">{t.orderNumber}</th>
                  <th className="py-3 px-4">{lang === "ar" ? "التاريخ" : "Date"}</th>
                  <th className="py-3 px-4">{t.fullName}</th>
                  <th className="py-3 px-4">{t.total}</th>
                  <th className="py-3 px-4">{t.orderStatus}</th>
                  <th className="py-3 px-4 text-center">{lang === "ar" ? "الإجراءات" : "Dispatch Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-neutral-400">
                      {lang === "ar" ? "لا توجد معاملات جارية حالياً" : "No active transactions listed."}
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="border-b border-neutral-150 dark:border-neutral-900/60 hover:bg-white dark:hover:bg-neutral-950/20 text-neutral-700 dark:text-neutral-300">
                      <td className="py-3.5 px-4 font-bold font-mono text-neutral-900 dark:text-neutral-100">{ord.id}</td>
                      <td className="py-3.5 px-4 font-mono">{ord.date}</td>
                      <td className="py-3.5 px-4 font-bold">{ord.billingAddress.fullName}</td>
                      <td className="py-3.5 px-4 font-extrabold font-mono text-neutral-900 dark:text-neutral-100">{formatPrice(ord.total)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-none text-[9px] font-bold uppercase border ${
                          ord.status === "delivered"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300"
                            : ord.status === "cancelled"
                            ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/65 dark:text-red-300"
                            : ord.status === "shipped"
                            ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-300"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                        }`}>
                          {ord.status === "pending" ? t.statusPending : ord.status === "processing" ? t.statusProcessing : ord.status === "shipped" ? t.statusShipped : ord.status === "out-for-delivery" ? t.statusOutForDelivery : ord.status === "delivered" ? t.statusDelivered : t.statusCancelled}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            onUpdateOrderStatus(ord.id, e.target.value as any);
                            addToast(
                              lang === "ar"
                                ? `تم تحديث حالة الطلب ${ord.id} بنجاح`
                                : `Updated order ${ord.id} status successfully`,
                              "success"
                            );
                          }}
                          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-none px-2.5 py-1 text-[10px] outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out-for-delivery">Courier Out</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === "coupons" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Add Coupon form */}
          <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm h-fit">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-neutral-500" />
              <span>{lang === "ar" ? "إنشاء كود خصم جديد" : "Create Promo Code"}</span>
            </h3>

            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Voucher Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. ULTRAVIP50"
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none uppercase font-bold tracking-wider"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCouponPercent}
                    onChange={(e) => setNewCouponPercent(parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Min Spend ($)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                {lang === "ar" ? "تفعيل كود الخصم" : "Activate Voucher Code"}
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-2 bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold pb-3 border-b border-neutral-200 dark:border-neutral-900 mb-5">
              {lang === "ar" ? "أكواد الخصم الفعالة بالنظام" : "Active System Discount Vouchers"} ({coupons.length})
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {coupons.map((c) => (
                <div key={c.code} className="flex justify-between items-center p-4 rounded-none bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900">
                  <div>
                    <span className="bg-[#f5f5f5] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-none text-xs font-black font-mono text-neutral-800 dark:text-neutral-100 tracking-wider">
                      {c.code}
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
                      {isRtl ? c.description_ar : c.description_en}
                    </p>
                  </div>
                  <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                    -{c.discountPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
