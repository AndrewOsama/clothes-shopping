/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Check, CreditCard, Shield, Truck, MapPin, Receipt, ArrowRight, ArrowLeft } from "lucide-react";
import { CartItem, Coupon, Address, ShippingMethod, Order } from "../types";
import { locales } from "../locales";
import { mockShippingMethods } from "../productsData";

interface CheckoutWizardProps {
  cart: CartItem[];
  lang: "en" | "ar";
  currency: string;
  exchangeRate: number;
  activeCoupon: Coupon | null;
  onClearCart: () => void;
  onAddOrder: (order: Order) => void;
  addToast: (msg: string, type: "success" | "error") => void;
  onGoToOrders: () => void;
}

export default function CheckoutWizard({
  cart,
  lang,
  currency,
  exchangeRate,
  activeCoupon,
  onClearCart,
  onAddOrder,
  addToast,
  onGoToOrders
}: CheckoutWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(mockShippingMethods[0]);
  const [paymentMethod, setPaymentMethod] = useState("visa");

  // Payment Credentials State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [walletPhone, setWalletPhone] = useState(""); // STC pay

  // Final Order State
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);

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
  const shippingCost = selectedShipping.cost;

  const grandTotal = discountedSubtotal + taxAmount + shippingCost;

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName || !email || !phone || !city || !street || !postalCode) {
        addToast(lang === "ar" ? "يرجى تعبئة جميع بيانات العنوان المطلوبة" : "Please fill in all address details", "error");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (paymentMethod === "visa" || paymentMethod === "stripe" || paymentMethod === "mastercard" || paymentMethod === "mada") {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
          addToast(lang === "ar" ? "يرجى تعبئة كافة بيانات بطاقتك الائتمانية بأمان" : "Please fill in all credit card details securely", "error");
          return;
        }
      } else if (paymentMethod === "stcpay") {
        if (!walletPhone) {
          addToast(lang === "ar" ? "يرجى كتابة رقم الجوال المرتبط بـ STC Pay" : "Please input phone number linked to STC Pay", "error");
          return;
        }
      }
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1 && step < 5) {
      setStep((step - 1) as any);
    }
  };

  const handlePlaceOrderSubmit = () => {
    const billingAddress: Address = { fullName, email, phone, country, city, street, postalCode };
    const orderId = "VOG-" + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = "TRK-" + Math.floor(50000000 + Math.random() * 49999999);

    const orderObj: Order = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      items: [...cart],
      billingAddress,
      shippingAddress: billingAddress,
      shippingMethod: selectedShipping,
      paymentMethod,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      shippingCost,
      total: grandTotal,
      status: "pending",
      trackingNumber
    };

    onAddOrder(orderObj);
    setFinalOrder(orderObj);
    onClearCart();
    setStep(5);
    addToast(lang === "ar" ? "تم تسجيل طلبك الفاخر بنجاح!" : "Your luxury order was placed successfully!", "success");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Step Indicators */}
      {step < 5 && (
        <div className="flex justify-between items-center mb-8 bg-[#f9f9f9] dark:bg-[#141211] p-4 rounded-none border border-neutral-150 dark:border-neutral-900 max-w-xl mx-auto overflow-x-auto gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <span
                className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-bold ${
                  step === s
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : step > s
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-450"
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest ${
                  step === s ? "text-neutral-900 dark:text-neutral-100 font-extrabold" : "text-neutral-400 dark:text-neutral-500 font-medium"
                }`}
              >
                {s === 1 ? t.stepBilling : s === 2 ? t.shippingMethod : s === 3 ? t.stepPayment : t.stepReview}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-4 shadow-sm"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>{t.stepBilling}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.fullName}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abdulrahman"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vip@vogue.com"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.phone}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.country}</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  >
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Egypt">Egypt</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.city}</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Riyadh / Dubai"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.postalCode}</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="12211"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-neutral-450 dark:text-neutral-400 uppercase tracking-widest font-bold mb-1.5">{t.street}</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Olaya District, King Fahd Road"
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-4 shadow-sm"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-500" />
                <span>{t.shippingMethod}</span>
              </h2>

              <div className="space-y-3">
                {mockShippingMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-4 rounded-none border transition-all cursor-pointer ${
                      selectedShipping.id === m.id
                        ? "bg-white dark:bg-neutral-950 border-black dark:border-white text-neutral-900 dark:text-white"
                        : "bg-white/40 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-900 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping.id === m.id}
                        onChange={() => setSelectedShipping(m)}
                        className="accent-black dark:accent-white"
                      />
                      <div>
                        <p className={`text-xs font-bold ${selectedShipping.id === m.id ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                          {isRtl ? m.name_ar : m.name_en}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          {lang === "ar" ? "مدة التوصيل:" : "Delivery within:"} {isRtl ? m.duration_ar : m.duration_en}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold font-mono">
                      {m.cost === 0 ? (lang === "ar" ? "مجاني" : "Complimentary") : formatPrice(m.cost)}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-5 shadow-sm"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-500" />
                <span>{t.stepPayment}</span>
              </h2>

              <div className="grid grid-cols-3 gap-2 pb-2 overflow-x-auto shrink-0">
                {[
                  { id: "visa", label: "Visa / MasterCard" },
                  { id: "mada", label: "Mada" },
                  { id: "stcpay", label: "STC Pay" },
                  { id: "paypal", label: "PayPal" },
                  { id: "applepay", label: "Apple Pay" },
                  { id: "cod", label: "Cash On Delivery" }
                ].map((pay) => (
                  <button
                    key={pay.id}
                    onClick={() => setPaymentMethod(pay.id)}
                    className={`p-3 rounded-none border text-[10px] uppercase tracking-widest font-bold transition-all text-center cursor-pointer shrink-0 ${
                      paymentMethod === pay.id
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-850 hover:border-neutral-400"
                    }`}
                  >
                    {pay.label}
                  </button>
                ))}
              </div>

              {/* Visa / MasterCard / Mada card layout */}
              {(paymentMethod === "visa" || paymentMethod === "mada" || paymentMethod === "mastercard") && (
                <div className="space-y-4 pt-2">
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-5 rounded-none space-y-3 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-150 dark:border-neutral-900">
                      <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Secure Bank Card Gate</span>
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g., Alexander McQueen"
                        className="w-full bg-[#f9f9f9] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2 text-xs outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-[#f9f9f9] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2 text-xs outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#f9f9f9] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2 text-xs outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Security Code (CVV)</label>
                        <input
                          type="text"
                          required
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#f9f9f9] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2 text-xs outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STC Pay layout */}
              {paymentMethod === "stcpay" && (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-5 rounded-none space-y-3">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">STC Pay Digital Wallet Connection</span>
                  <div>
                    <label className="block text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full bg-[#f9f9f9] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100 rounded-none p-2.5 text-xs outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    {lang === "ar" ? "سوف تستقبل رسالة نصية لتأكيد الخصم الفوري في التطبيق" : "You will receive an OTP request shortly to authorize this payment."}
                  </p>
                </div>
              )}

              {/* Cash On Delivery */}
              {paymentMethod === "cod" && (
                <div className="bg-white dark:bg-neutral-950/20 border border-neutral-200 dark:border-neutral-900 p-4 rounded-none">
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {lang === "ar"
                      ? "الدفع عند الاستلام متاح لعنوانك الفاخر. سيقوم مندوب التوصيل بالتحقق وتلقي المبلغ الإجمالي نقداً أو بالشبكة عند التسليم."
                      : "Cash on delivery is fully supported for your luxury shipping address. Our courier agent will accept card or cash payment upon delivery."}
                  </p>
                </div>
              )}

              {/* Apple / Google / Paypal */}
              {(paymentMethod === "applepay" || paymentMethod === "paypal") && (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-6 rounded-none text-center space-y-3">
                  <Shield className="w-8 h-8 text-neutral-400 dark:text-neutral-650 mx-auto" />
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 font-bold uppercase tracking-widest">
                    Secure Instant Redirect Schema Ready
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    {lang === "ar" ? "يتم توجيهك بأمان لبوابة الدفع لإتمام الإجراء في خطوة واحدة" : "Bypasses form entry and authorizes securely in one transaction."}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none space-y-5 shadow-sm"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-200 dark:border-neutral-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-neutral-500" />
                <span>{t.stepReview}</span>
              </h2>

              <div className="space-y-4">
                {/* Delivery details verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 p-4 rounded-none">
                    <p className="text-[10px] uppercase text-neutral-450 dark:text-neutral-500 font-bold tracking-widest mb-1.5">
                      {lang === "ar" ? "عنوان التوصيل والفواتير" : "Bespoke Delivery Address"}
                    </p>
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{fullName}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{email}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{phone}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">{street}, {city}, {postalCode}, {country}</p>
                  </div>
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 p-4 rounded-none flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-neutral-450 dark:text-neutral-500 font-bold tracking-widest mb-1.5">
                        {lang === "ar" ? "طريقة الشحن والدفع" : "Sartorial Courier & Billing"}
                      </p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{isRtl ? selectedShipping.name_ar : selectedShipping.name_en}</p>
                      <p className="text-[11px] text-neutral-500 mt-1">{lang === "ar" ? "المدة المتوقعة:" : "Estimated duration:"} {isRtl ? selectedShipping.duration_ar : selectedShipping.duration_en}</p>
                    </div>
                    <div className="pt-2 border-t border-neutral-150 dark:border-neutral-900 mt-2">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                        {lang === "ar" ? "طريقة الدفع المحددة:" : "Authorized gateway:"} <span className="text-neutral-900 dark:text-neutral-100 font-extrabold uppercase">{paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Summary list */}
                <div className="border border-neutral-150 dark:border-neutral-900 bg-white/40 dark:bg-neutral-950/20 p-4 rounded-none space-y-3">
                  <p className="text-[10px] uppercase text-neutral-450 dark:text-neutral-550 font-bold tracking-widest">
                    {lang === "ar" ? "القطع المطلوبة" : "Apparel Catalogue Items"}
                  </p>
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-neutral-700 dark:text-neutral-300 pb-2 border-b border-neutral-200 dark:border-neutral-900 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{isRtl ? item.product.name_ar : item.product.name_en}</span>
                        <span className="text-neutral-450 dark:text-neutral-500 text-[10px] block mt-0.5">
                          {t.size}: {item.selectedSize} | {isRtl ? item.selectedColor?.name_ar : item.selectedColor?.name_en}
                        </span>
                      </div>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
                        {item.quantity} x {formatPrice(item.product.discountPrice || item.product.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && finalOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-8 rounded-none shadow-sm text-center space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-850 text-emerald-600 dark:text-emerald-400 rounded-none flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-1">
                  {t.orderSuccess}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-450 max-w-md mx-auto">
                  {t.orderSuccessDesc}
                </p>
              </div>

              {/* Order reference and tracking */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-white dark:bg-neutral-950 p-4 rounded-none border border-neutral-150 dark:border-neutral-900">
                <div>
                  <span className="text-[9px] uppercase text-neutral-400 dark:text-neutral-500 tracking-widest font-bold block">{t.orderNumber}</span>
                  <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-100">{finalOrder.id}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-neutral-400 dark:text-neutral-500 tracking-widest font-bold block">{lang === "ar" ? "رقم التتبع" : "Courier Tracking"}</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{finalOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Live Tracking Stages indicator */}
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-none border border-neutral-150 dark:border-neutral-900 text-left">
                <p className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-bold tracking-widest text-center mb-6">
                  {lang === "ar" ? "مؤشر تتبع الطلب الفوري" : "Live Shipment tracking indicator"}
                </p>
                <div className="flex justify-between items-center max-w-md mx-auto relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-900 -translate-y-1/2 z-0"></div>
                  {[
                    { id: "pending", label_en: "Placed", label_ar: "تم الطلب" },
                    { id: "processing", label_en: "Packaging", label_ar: "جاري التجهيز" },
                    { id: "shipped", label_en: "Shipped", label_ar: "تم الشحن" },
                    { id: "delivered", label_en: "Delivered", label_ar: "تم التسليم" }
                  ].map((stg, sIdx) => {
                    // simulate active state
                    const isActive = sIdx === 0; // "pending" is current
                    const isDone = false;

                    return (
                      <div key={stg.id} className="flex flex-col items-center gap-2 z-10">
                        <span
                          className={`w-6.5 h-6.5 rounded-none flex items-center justify-center text-[10px] font-bold border ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white ring-4 ring-neutral-150 dark:ring-neutral-900"
                              : isDone
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-[#f5f5f5] dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800"
                          }`}
                        >
                          {sIdx + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                          {isRtl ? stg.label_ar : stg.label_en}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={onGoToOrders}
                  className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black font-bold uppercase tracking-widest py-3 px-6 rounded-none text-xs cursor-pointer transition-colors"
                >
                  {t.myOrders}
                </button>
              </div>
            </motion.div>
          )}

          {/* Stepper Wizard Controls */}
          {step < 5 && (
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border ${
                  step === 1
                    ? "opacity-30 pointer-events-none border-neutral-150 dark:border-neutral-900 text-neutral-400"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950"
                }`}
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{lang === "ar" ? "السابق" : "Back"}</span>
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black flex items-center gap-2 px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                >
                  <span>{lang === "ar" ? "التالي" : "Proceed"}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrderSubmit}
                  className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black flex items-center gap-2 px-8 py-3.5 rounded-none text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                >
                  <span>{t.placeOrder}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column Checkout summary cards */}
        {step < 5 && (
          <div className="bg-[#f9f9f9] dark:bg-[#141211] border border-neutral-150 dark:border-neutral-900 p-6 rounded-none shadow-sm h-fit space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-450 font-extrabold pb-3 border-b border-neutral-150 dark:border-neutral-900">
              {t.checkout} {lang === "ar" ? "ملخص الحقيبة" : "Summary"}
            </h3>

            {/* Micro items list */}
            <div className="space-y-3 border-b border-neutral-150 dark:border-neutral-900 pb-4 max-h-56 overflow-y-auto">
              {cart.map((item, idx) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                const nameStr = isRtl ? item.product.name_ar : item.product.name_en;

                return (
                  <div key={idx} className="flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={nameStr}
                      referrerPolicy="no-referrer"
                      className="w-10 h-13 object-cover rounded-none bg-neutral-100 dark:bg-neutral-950 shrink-0 border border-neutral-150 dark:border-neutral-900"
                    />
                    <div className="flex-grow">
                      <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">{nameStr}</p>
                      <p className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mt-0.5 font-semibold">
                        Qty: {item.quantity} | {item.selectedSize}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-neutral-700 dark:text-neutral-300">
                      {formatPrice(itemPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Small computations */}
            <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-150 dark:border-neutral-900 pb-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{t.discount} (-{discountPercent}%)</span>
                  <span className="font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.tax}</span>
                <span className="font-mono">{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="font-mono">
                  {shippingCost === 0 ? (lang === "ar" ? "مجاني" : "Complimentary") : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-900 dark:text-neutral-100">{t.total}</span>
              <span className="text-base font-black font-mono text-neutral-900 dark:text-neutral-100">{formatPrice(grandTotal)}</span>
            </div>

            {/* Info security label */}
            <div className="flex items-start gap-2 bg-white dark:bg-neutral-950/40 p-3 border border-neutral-150 dark:border-neutral-900 rounded-none">
              <Shield className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-normal">
                {lang === "ar"
                  ? "بياناتك مشفرة بالكامل بواسطة خادم وشهادة SSL لحماية خصوصيتك ومعلومات بطاقتك بأعلى جودة."
                  : "All checkout actions are encrypted and protected by a robust SSL protocol to safeguard your luxury card credentials."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
