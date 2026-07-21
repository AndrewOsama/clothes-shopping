/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Product {
  id: string;
  sku: string;
  brand: string;
  category: "men" | "women" | "kids" | "shoes" | "bags" | "accessories" | "activewear";
  category_ar: string;
  category_en: string;
  name_en: string;
  name_ar: string;
  short_desc_en: string;
  short_desc_ar: string;
  long_desc_en: string;
  long_desc_ar: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  colors: { name_en: string; name_ar: string; hex: string }[];
  material_en: string;
  material_ar: string;
  weight_kg: number;
  stock: number;
  images: string[];
  shipping_en: string;
  shipping_ar: string;
  returnPolicy_en: string;
  returnPolicy_ar: string;
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  flashSale?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name_en: string; name_ar: string; hex: string };
  quantity: number;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface ShippingMethod {
  id: string;
  name_en: string;
  name_ar: string;
  duration_en: string;
  duration_ar: string;
  cost: number;
}

export interface PaymentDetails {
  method: string;
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string; // STC Pay, STC/Mada details
  bankTransactionId?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  billingAddress: Address;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
  trackingNumber: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount?: number;
  description_en: string;
  description_ar: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  addresses: Address[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
