/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocaleDict {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  shopNow: string;
  categories: string;
  men: string;
  women: string;
  kids: string;
  accessories: string;
  shoes: string;
  bags: string;
  activewear: string;
  allCategories: string;
  featuredProducts: string;
  bestSellers: string;
  newArrivals: string;
  flashSale: string;
  reviews: string;
  writeReview: string;
  yourRating: string;
  yourComment: string;
  submitReview: string;
  addToCart: string;
  addedToCart: string;
  addToWishlist: string;
  addedToWishlist: string;
  wishlist: string;
  cart: string;
  checkout: string;
  searchPlaceholder: string;
  searchHistory: string;
  popularSearches: string;
  clearHistory: string;
  noProductsFound: string;
  filterBy: string;
  priceRange: string;
  color: string;
  size: string;
  brand: string;
  rating: string;
  sortBy: string;
  sortLatest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortBest: string;
  quickView: string;
  sku: string;
  material: string;
  weight: string;
  availability: string;
  inStock: string;
  outOfStock: string;
  shippingPolicy: string;
  returnPolicy: string;
  similarProducts: string;
  items: string;
  subtotal: string;
  discount: string;
  tax: string;
  shipping: string;
  total: string;
  applyCoupon: string;
  couponApplied: string;
  invalidCoupon: string;
  couponPlaceholder: string;
  cartEmpty: string;
  continueShopping: string;
  stepBilling: string;
  stepShipping: string;
  stepPayment: string;
  stepReview: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
  placeOrder: string;
  orderSuccess: string;
  orderSuccessDesc: string;
  orderNumber: string;
  trackOrder: string;
  orderStatus: string;
  statusPending: string;
  statusProcessing: string;
  statusShipped: string;
  statusOutForDelivery: string;
  statusDelivered: string;
  statusCancelled: string;
  adminDashboard: string;
  salesAnalytics: string;
  totalSales: string;
  totalOrders: string;
  totalCustomers: string;
  inventoryStatus: string;
  recentOrders: string;
  productManagement: string;
  categoryManagement: string;
  orderManagement: string;
  customerManagement: string;
  settings: string;
  aiStylist: string;
  aiStylistDesc: string;
  aiStylistPlaceholder: string;
  aiStylistPrompt: string;
  aiStylistResponse: string;
  aiStylistThinking: string;
  contactUs: string;
  aboutUs: string;
  faqs: string;
  privacyPolicy: string;
  termsConditions: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  subscribe: string;
  login: string;
  logout: string;
  register: string;
  forgotPassword: string;
  orWith: string;
  profile: string;
  addresses: string;
  myOrders: string;
  editProfile: string;
  themeDark: string;
  themeLight: string;
}

export const locales: Record<"en" | "ar", LocaleDict> = {
  en: {
    appName: "VOGUE",
    heroTitle: "ELEVATE YOUR STYLE",
    heroSubtitle: "Discover the latest premium trends inspired by international high fashion.",
    shopNow: "Shop Now",
    categories: "Categories",
    men: "Men",
    women: "Women",
    kids: "Kids",
    accessories: "Accessories",
    shoes: "Shoes",
    bags: "Bags",
    activewear: "Activewear",
    allCategories: "All Categories",
    featuredProducts: "Featured Masterpieces",
    bestSellers: "Best Sellers",
    newArrivals: "New Arrivals",
    flashSale: "Flash Sale",
    reviews: "Reviews",
    writeReview: "Write a Review",
    yourRating: "Your Rating",
    yourComment: "Your Comment",
    submitReview: "Submit Review",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart!",
    addToWishlist: "Add to Wishlist",
    addedToWishlist: "Saved to Wishlist!",
    wishlist: "Wishlist",
    cart: "Shopping Bag",
    checkout: "Checkout",
    searchPlaceholder: "Search minimal fashion, premium items...",
    searchHistory: "Recent Searches",
    popularSearches: "Popular Searches",
    clearHistory: "Clear",
    noProductsFound: "No items match your search or filters.",
    filterBy: "Filter By",
    priceRange: "Price Range",
    color: "Color",
    size: "Size",
    brand: "Brand",
    rating: "Rating",
    sortBy: "Sort By",
    sortLatest: "Newest Arrivals",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortBest: "Customer Rating",
    quickView: "Quick View",
    sku: "SKU",
    material: "Composition",
    weight: "Weight",
    availability: "Availability",
    inStock: "In Stock",
    outOfStock: "Sold Out",
    shippingPolicy: "Complimentary Express Delivery within 2-4 business days.",
    returnPolicy: "Complimentary 30-day return policy for unused premium apparel.",
    similarProducts: "You May Also Like",
    items: "items",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "VAT (15%)",
    shipping: "Shipping",
    total: "Total",
    applyCoupon: "Apply Code",
    couponApplied: "Promo applied successfully!",
    invalidCoupon: "Invalid discount code.",
    couponPlaceholder: "Enter promo code",
    cartEmpty: "Your luxury bag is empty.",
    continueShopping: "Continue Browsing",
    stepBilling: "Billing Address",
    stepShipping: "Shipping Details",
    stepPayment: "Secure Payment",
    stepReview: "Order Summary",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Mobile Phone",
    country: "Country",
    city: "City",
    street: "Street Address",
    postalCode: "Postal Code",
    shippingMethod: "Shipping Method",
    paymentMethod: "Payment Method",
    placeOrder: "Complete Luxury Order",
    orderSuccess: "Thank You for Your Order",
    orderSuccessDesc: "Your order has been placed successfully. A luxury delivery agent will reach out shortly.",
    orderNumber: "Order Number",
    trackOrder: "Track Order",
    orderStatus: "Order Status",
    statusPending: "Pending Approval",
    statusProcessing: "Preparing Package",
    statusShipped: "Shipped & In-Transit",
    statusOutForDelivery: "Out with Courier",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    adminDashboard: "Admin Suite",
    salesAnalytics: "Sales & Performance Analytics",
    totalSales: "Total Revenue",
    totalOrders: "Total Orders",
    totalCustomers: "Active Customers",
    inventoryStatus: "Apparel Inventory Health",
    recentOrders: "Latest Transactions",
    productManagement: "Catalogue Products",
    categoryManagement: "Collections",
    orderManagement: "Order Dispatch",
    customerManagement: "CRM Profiles",
    settings: "System Config",
    aiStylist: "AI Stylist",
    aiStylistDesc: "Your personal, Gemini-powered haute couture consultant. Ask for outfit designs, trends, or wardrobe matchings.",
    aiStylistPlaceholder: "e.g., 'Suggest a sleek, casual evening look for a summer wedding in Riyadh'",
    aiStylistPrompt: "Consult Stylist",
    aiStylistResponse: "Stylist Recommendation",
    aiStylistThinking: "Sartorial calculations in progress...",
    contactUs: "Contact Concierge",
    aboutUs: "Our Heritage",
    faqs: "F.A.Q. Support",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms of Service",
    newsletterTitle: "THE INSIDER CIRCLE",
    newsletterSubtitle: "Subscribe for early access to collection drops, runway trends, and seasonal events.",
    subscribe: "Request Invitation",
    login: "Sign In",
    logout: "Sign Out",
    register: "Join Vogue",
    forgotPassword: "Reset Credentials",
    orWith: "or continue with",
    profile: "My Profile",
    addresses: "Address Book",
    myOrders: "Purchase History",
    editProfile: "Update Profile",
    themeDark: "Midnight View",
    themeLight: "Studio Light",
  },
  ar: {
    appName: "فيج",
    heroTitle: "ارتقِ بأسلوبك",
    heroSubtitle: "اكتشف أحدث صيحات الموضة الراقية والمستوحاة من الأزياء العالمية الفاخرة.",
    shopNow: "تسوق الآن",
    categories: "الفئات",
    men: "رجال",
    women: "نساء",
    kids: "أطفال",
    accessories: "إكسسوارات",
    shoes: "أحذية",
    bags: "حقائب",
    activewear: "ملابس رياضية",
    allCategories: "جميع الفئات",
    featuredProducts: "قطع مختارة فريدة",
    bestSellers: "الأكثر مبيعاً",
    newArrivals: "وصل حديثاً",
    flashSale: "تخفيضات كبرى",
    reviews: "التقييمات",
    writeReview: "كتابة مراجعة",
    yourRating: "تقييمك بالنجوم",
    yourComment: "تعليقك",
    submitReview: "إرسال المراجعة",
    addToCart: "إضافة إلى الحقيبة",
    addedToCart: "تمت الإضافة للحقيبة!",
    addToWishlist: "إضافة للمفضلة",
    addedToWishlist: "تم الحفظ بالمفضلة!",
    wishlist: "المفضلة",
    cart: "حقيبة التسوق",
    checkout: "الدفع والشحن",
    searchPlaceholder: "ابحث عن تصميمات أنيقة، ملابس فاخرة...",
    searchHistory: "عمليات البحث الأخيرة",
    popularSearches: "الأكثر بحثاً",
    clearHistory: "مسح",
    noProductsFound: "لم نجد أي قطع تطابق بحثك أو مرشحاتك.",
    filterBy: "تصفية حسب",
    priceRange: "نطاق السعر",
    color: "اللون",
    size: "المقاس",
    brand: "العلامة التجارية",
    rating: "التقييم",
    sortBy: "ترتيب حسب",
    sortLatest: "أحدث الموديلات",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    sortBest: "تقييم العملاء",
    quickView: "نظرة سريعة",
    sku: "رمز المنتج (SKU)",
    material: "الخامة والتركيب",
    weight: "الوزن",
    availability: "حالة التوفر",
    inStock: "متوفر بالمخزن",
    outOfStock: "نفدت الكمية",
    shippingPolicy: "توصيل سريع مجاني خلال ٢-٤ أيام عمل لجميع المناطق.",
    returnPolicy: "إرجاع مجاني ميسر خلال ٣٠ يوماً للملابس غير المستخدمة.",
    similarProducts: "قد يعجبك أيضاً",
    items: "قطع",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    tax: "ضريبة القيمة المضافة (١٥٪)",
    shipping: "الشحن",
    total: "الإجمالي",
    applyCoupon: "تطبيق الكود",
    couponApplied: "تم تطبيق كود الخصم بنجاح!",
    invalidCoupon: "كود الخصم غير فعال أو منتهي الصلاحية.",
    couponPlaceholder: "أدخل كود الخصم",
    cartEmpty: "حقيبة التسوق الفاخرة فارغة حالياً.",
    continueShopping: "العودة للتصفح",
    stepBilling: "عنوان الفواتير",
    stepShipping: "تفاصيل الشحن والتوصيل",
    stepPayment: "الدفع الآمن",
    stepReview: "مراجعة وتأكيد الطلب",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    country: "الدولة",
    city: "المدينة",
    street: "عنوان الشارع بالتفصيل",
    postalCode: "الرمز البريدي",
    shippingMethod: "طريقة الشحن",
    paymentMethod: "طريقة الدفع",
    placeOrder: "إتمام الطلب الفاخر",
    orderSuccess: "شكراً لتسوقك معنا",
    orderSuccessDesc: "تم تسجيل طلبك الفاخر بنجاح. سيتواصل معك ممثل التوصيل الفاخر قريباً.",
    orderNumber: "رقم الطلب",
    trackOrder: "تتبع طلبك",
    orderStatus: "حالة الطلب",
    statusPending: "بانتظار الموافقة",
    statusProcessing: "جاري تجهيز القطع والتغليف",
    statusShipped: "تم الشحن وهي في الطريق إليك",
    statusOutForDelivery: "مع مندوب التوصيل الآن",
    statusDelivered: "تم التسليم بنجاح",
    statusCancelled: "تم إلغاء الطلب",
    adminDashboard: "منصة الإدارة والتحكم",
    salesAnalytics: "تحليلات المبيعات والأداء التجاري",
    totalSales: "إجمالي الإيرادات",
    totalOrders: "إجمالي الطلبات",
    totalCustomers: "العملاء النشطون",
    inventoryStatus: "سلامة وجودة مخزون الملابس",
    recentOrders: "آخر المعاملات والطلبات",
    productManagement: "إدارة المنتجات والكتالوج",
    categoryManagement: "إدارة الفئات والمجموعات",
    orderManagement: "إرسال وشحن الطلبات",
    customerManagement: "إدارة علاقات العملاء (CRM)",
    settings: "إعدادات النظام",
    aiStylist: "منسق الأزياء الذكي",
    aiStylistDesc: "مستشارك الشخصي للأناقة الراقية المدعوم من Gemini. اسأله لتنسيق الملابس وتصميم الإطلالات لجميع مناسباتك.",
    aiStylistPlaceholder: "مثال: 'اقترح لي إطلالة عصرية أنيقة لحفل زفاف صيفي مسائي في الرياض'",
    aiStylistPrompt: "استشر المصمم الذكي",
    aiStylistResponse: "توصية منسق الأزياء الخاص بك",
    aiStylistThinking: "جاري تنسيق القطع وحساب تفاصيل الأناقة...",
    contactUs: "تواصل مع المنسقين",
    aboutUs: "إرث عريق",
    faqs: "الأسئلة الشائعة والدعم",
    privacyPolicy: "سياسة الخصوصية",
    termsConditions: "الشروط والأحكام",
    newsletterTitle: "دائرة النخبة",
    newsletterSubtitle: "اشترك معنا لتكون أول من يعلم بإصدارات المجموعات الحصرية، عروض الأزياء، والتخفيضات الخاصة.",
    subscribe: "طلب دعوة للانضمام",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    register: "انضم إلى فيج",
    forgotPassword: "استعادة كلمة المرور",
    orWith: "أو المتابعة باستخدام",
    profile: "حسابي الشخصي",
    addresses: "دفتر العناوين المعتمد",
    myOrders: "سجل الطلبيات",
    editProfile: "تحديث الملف الشخصي",
    themeDark: "مظهر منتصف الليل",
    themeLight: "مظهر الاستوديو المضيء",
  },
};
