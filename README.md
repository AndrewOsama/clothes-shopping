# Vogue Haute Couture ⚜️
### Premium Luxury E-Commerce & AI Personal Stylist

Welcome to **Vogue Haute Couture**, a production-ready, ultra-premium, high-fashion digital shopping experience. Engineered specifically for discerning client requirements, this storefront merges haute couture design and high-tech utilities, implementing an elegant dual-language Arabic/English localization system with dynamic RTL formatting, persistent cart structures, and a server-side proxied Gemini AI styling engine.

---

## 🎨 Design & Aesthetic Identity

The visual experience is meticulously styled using **Tailwind CSS** paired with custom modern assets:
- **The Obsidian & Alabaster Palette**: High-contrast, sleek slate dark background styling, framed with thin luxury borders and golden accents.
- **Micro-Glassmorphism**: Elegant card layouts styled with backing blur, subtle light/dark borders, and custom shadow offsets.
- **Dynamic Animation Rhythm**: Fluid transitions powered by `motion/react` with spring velocities to provide organic feel on hover and panel entries.
- **Sartorial Typography**: 
  - **Outfit**: Tech-fashion forward Display heading typography.
  - **Cairo**: The premier typeface for elegant, luxury Arabic presentation.
  - **Inter**: Clean, professional sans-serif UI content typography.
  - **JetBrains Mono**: Clean, technical lettering for order reference IDs, metrics, and timestamps.

---

## 🌟 Key Architecture & Modules

### 1. Unified State Core (`src/App.tsx`)
The absolute controller of the storefront, holding:
- **Authentication**: Fully modular login, register, and admin elevation controls.
- **Cart & Wishlist Manager**: Multi-criteria selection (sizes, colors, and quantities) with live tax, dynamic coupon thresholds, and local storage syncing.
- **Dynamic Routing Engine**: Navigation without viewport flicker via custom reactive states (`activeView`).

### 2. Conversational AI Stylist (`src/components/AIStylist.tsx`)
Integrated with the Google Gemini API to proxy fashion consultation:
- Provides automated wardrobe suggestions based on current shopping cart items or user wishlist.
- Features custom mood filters ("Neo-Classic", "Avant-Garde Riyadh", "Royal Wedding Gala").
- Directly integrates output with custom products for instant storefront navigation.

### 3. Analytics & Operations Dashboard (`src/components/AdminDashboard.tsx`)
A bento-grid administrative control center:
- **Analytics Canvas**: Renders sales figures and inventory trends via interactive `recharts` line graphs.
- **Stock Tracker**: Highlights warning lines on critical item volumes to prevent selling non-inventory stocks.
- **Voucher Creator**: Grants administrative personnel power to design custom multi-language coupons.

### 4. Interactive Multilingual Framework (`src/locales.ts`)
Allows one-touch switching between English and Arabic. RTL and LTR orientations are adjusted instantly with automatic DOM direction bindings (`dir="rtl"`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build the application for production:
   ```bash
   npm run build
   ```

4. Start the production server:
   ```bash
   npm run start
   ```

---

## ⚙️ Technical Blueprint

```
├── public/
│   ├── manifest.json       # PWA Manifest config
│   └── service-worker.js   # Offline fallback asset caching script
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx      # Bento-grid administration controls
│   │   ├── AIStylist.tsx           # Google Gemini Wardrobe Assistant
│   │   ├── AuthModal.tsx           # Authentication modal
│   │   ├── CartDrawer.tsx          # Shopping cart panel with discount engine
│   │   ├── CheckoutWizard.tsx      # Elegant step-based checkout system
│   │   ├── ProductCard.tsx         # Hover-enhanced showcase cards
│   │   └── ProductDetailModal.tsx  # Detailed product inspection & reviews
│   ├── App.tsx             # Main layout, routing, and shared state
│   ├── index.css           # Global typography definitions & glass styling
│   ├── locales.ts          # Arabic/English dictionary maps
│   ├── main.tsx            # App bootstrapping
│   ├── productsData.ts     # Authentic product blueprints & static items
│   └── types.ts            # Absolute type declarations & strict interfaces
```

---

## 🛡️ License
Licensed under the Apache License, Version 2.0. Developed as a premium production-grade storefront.
