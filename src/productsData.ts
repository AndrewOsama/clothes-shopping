/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const initialProducts: Product[] = [
  {
    id: "p1",
    sku: "VG-M-COT-01",
    brand: "Vogue Maison",
    category: "men",
    category_en: "Men's Apparel",
    category_ar: "ملابس رجالية",
    name_en: "Classic Tailored Wool Overcoat",
    name_ar: "معطف صوف كلاسيكي مفصل",
    short_desc_en: "An elegant, single-breasted overcoat crafted from premium virgin wool blend.",
    short_desc_ar: "معطف أنيق بصف واحد من الأزرار مصنوع من مزيج الصوف البكر الفاخر.",
    long_desc_en: "Exquisitely tailored for a sharp, modern silhouette, this overcoat is constructed from a luxurious Italian wool blend. Featuring structured shoulders, a classic notch lapel, single-vent hem, and dual flap pockets. Fully lined for seamless layering over tailoring or heavy knitwear.",
    long_desc_ar: "صُمم هذا المعطف بدقة فائقة ليمنحك مظهرًا عصريًا حادًا وجذابًا، وهو مصنوع من مزيج الصوف الإيطالي الفاخر. يتميز بأكتاف مبطنة، وياقة كلاسيكية مشقوقة، وحافة بفتحة واحدة، وجيبين بغطاء. مبطن بالكامل لسهولة ارتدائه فوق البدلات أو الكنزات الصوفية الثقيلة.",
    price: 349,
    discountPrice: 279,
    discountPercent: 20,
    rating: 4.8,
    reviewsCount: 34,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_en: "Camel", name_ar: "جملي", hex: "#c19a6b" },
      { name_en: "Midnight Black", name_ar: "أسود داكن", hex: "#111111" },
      { name_en: "Charcoal Grey", name_ar: "رمادي فحم", hex: "#4a4a4a" }
    ],
    material_en: "80% Virgin Wool, 20% Polyamide. Lining: 100% Viscose",
    material_ar: "٨٠٪ صوف بكر، ٢٠٪ بولي أميد. البطانة: ١٠٠٪ فيسكوز",
    weight_kg: 1.8,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery within 2-4 business days.",
    shipping_ar: "توصيل سريع مجاني خلال ٢-٤ أيام عمل لجميع المناطق.",
    returnPolicy_en: "Complimentary 30-day return policy in original packaging.",
    returnPolicy_ar: "إرجاع مجاني ميسر خلال ٣٠ يوماً في العبوة الأصلية.",
    featured: true,
    bestSeller: true,
    reviews: [
      {
        id: "r1",
        userName: "Youssef A.",
        rating: 5,
        comment: "Excellent premium material. Fits perfectly like a bespoke designer suit. Extremely warm.",
        date: "2026-06-15"
      },
      {
        id: "r2",
        userName: "Marcus K.",
        rating: 4,
        comment: "The camel color is gorgeous. Sleeves are slightly long but easily altered.",
        date: "2026-07-02"
      }
    ]
  },
  {
    id: "p2",
    sku: "VG-W-BLZ-02",
    brand: "Atelier Vogue",
    category: "women",
    category_en: "Women's Apparel",
    category_ar: "ملابس نسائية",
    name_en: "Structured Double-Breasted Blazer",
    name_ar: "سترة بليزر مهيكلة بصفين أزرار",
    short_desc_en: "A power silhouette blazer featuring elegant gold-tone crest buttons and sharp shoulders.",
    short_desc_ar: "بليزر بتصميم قوي يتميز بأزرار مذهبة أنيقة وأكتاف حادة ومحددة.",
    long_desc_en: "A quintessential wardrobe investment. This structured blazer features sharp padded shoulders, peaked lapels, and double-breasted closure adorned with detailed gold-crested buttons. Crafted in mid-weight premium twill structure, making it ideal for transitioning from office luxury to evening styling.",
    long_desc_ar: "استثمار أساسي في خزانة ملابسك الراقية. يتميز هذا البليزر المهيكل بأكتاف حادة ومبطنة، وياقة مدببة، وإغلاق بصفين من الأزرار مزين بأزرار ذهبية مفصلة. صُنع من قماش التويل متوسط الوزن الفاخر، مما يجعله مثاليًا للانتقال من مظهر العمل الفخم إلى السهرات الأنيقة.",
    price: 199,
    discountPrice: 159,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 48,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name_en: "Off-White", name_ar: "أبيض عاجي", hex: "#fcfaf2" },
      { name_en: "Emerald Green", name_ar: "أخضر زمردي", hex: "#046307" },
      { name_en: "Classic Navy", name_ar: "كحلي كلاسيكي", hex: "#111f38" }
    ],
    material_en: "72% Polyester, 23% Viscose, 5% Elastane. Lining: Silk satin blend.",
    material_ar: "٧٢٪ بوليستر، ٢٣٪ فيسكوز، ٥٪ إيلاستين. البطانة: مزيج الحرير والساتان.",
    weight_kg: 0.9,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery within 2-4 business days.",
    shipping_ar: "توصيل سريع مجاني خلال ٢-٤ أيام عمل لجميع المناطق.",
    returnPolicy_en: "Complimentary 30-day return policy.",
    returnPolicy_ar: "إرجاع مجاني ميسر خلال ٣٠ يوماً.",
    newArrival: true,
    featured: true,
    reviews: [
      {
        id: "r3",
        userName: "Sarah M.",
        rating: 5,
        comment: "Absolutely stunning structure! It cinches the waist perfectly and looks incredibly high-end.",
        date: "2026-07-10"
      }
    ]
  },
  {
    id: "p3",
    sku: "VG-W-DRS-03",
    brand: "Atelier Vogue",
    category: "women",
    category_en: "Women's Apparel",
    category_ar: "ملابس نسائية",
    name_en: "Lustrous Satin Slip Midi Dress",
    name_ar: "فستان ميدي من الساتان اللامع",
    short_desc_en: "A fluid, bias-cut satin dress with a delicate cowl neckline and adjustable straps.",
    short_desc_ar: "فستان ناعم ومنسدل مقصوص بوارب من الساتان مع ياقة متهدلة رقيقة وحمالات قابلة للتعديل.",
    long_desc_en: "Embody effortless luxury with our premium satin midi dress. Cut on the bias for an exquisite drape that hugs your contours gracefully. Features a soft cowl neck, low-cut back, and thin spaghetti shoulder straps. Dress it down with an oversized blazer or raise the glamour with statement gold jewelry.",
    long_desc_ar: "جسدي الفخامة المريحة مع فستان ميدي الساتان الفاخر. مقصوص بزاوية مائلة لينسدل بروعة فائقة تبرز ملامح قوامك بنعومة. يتميز بياقة منسدلة ناعمة، وظهر مكشوف منخفض، وحمالات رفيعة للغاية. يمكنك ارتداؤه مع سترة بليزر فضفاضة أو الارتقاء بمظهرك للمناسبات بإضافة مجوهرات ذهبية بارزة.",
    price: 149,
    rating: 4.7,
    reviewsCount: 19,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name_en: "Champagne Gold", name_ar: "ذهبي شامبانيا", hex: "#e5d3b3" },
      { name_en: "Ruby Red", name_ar: "أحمر ياقوتي", hex: "#9b111e" },
      { name_en: "Midnight Black", name_ar: "أسود داكن", hex: "#111111" }
    ],
    material_en: "95% Premium Mulberry Silk Satin, 5% Spandex",
    material_ar: "٩٥٪ ساتان حرير التوت الفاخر، ٥٪ سباندكس",
    weight_kg: 0.35,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Express Delivery within 2-4 business days.",
    shipping_ar: "توصيل سريع متاح خلال ٢-٤ أيام عمل.",
    returnPolicy_en: "Complimentary 30-day return policy.",
    returnPolicy_ar: "إرجاع مجاني ميسر خلال ٣٠ يوماً.",
    bestSeller: true,
    reviews: []
  },
  {
    id: "p4",
    sku: "VG-M-SHR-04",
    brand: "Vogue Maison",
    category: "men",
    category_en: "Men's Apparel",
    category_ar: "ملابس رجالية",
    name_en: "Premium Linen Button-Down Shirt",
    name_ar: "قميص كتان فاخر بأزرار",
    short_desc_en: "A breathable, relaxed-fit linen shirt made of pure European organic flax.",
    short_desc_ar: "قميص كتان مريح ويسمح بمرور الهواء مصنوع من الكتان الأوروبي العضوي النقي.",
    long_desc_en: "Ideal for warm climates and refined weekends, this premium button-down is spun from lightweight, breathable organic European flax linen. Garment-washed for exceptional softness from the very first wear. Features a structured point collar, curved hem, and refined french-seam detailing.",
    long_desc_ar: "مثالي للأجواء الدافئة وعطلات نهاية الأسبوع الأنيقة، صُنع هذا القميص الفاخر من الكتان الأوروبي العضوي خفيف الوزن والمنعش. مغسول مسبقاً لمنحه نعومة استثنائية من المرة الأولى لارتدائه. يتميز بياقة مدببة مهيكلة، وحافة منحنية، وتفاصيل درزات فرنسية راقية.",
    price: 89,
    discountPrice: 69,
    discountPercent: 22,
    rating: 4.6,
    reviewsCount: 52,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_en: "Soft Azure", name_ar: "أزرق سماوي ناعم", hex: "#7097c2" },
      { name_en: "Pure White", name_ar: "أبيض ناصع", hex: "#ffffff" },
      { name_en: "Sand Beige", name_ar: "بيج رملي", hex: "#e2d6b5" }
    ],
    material_en: "100% Organic European Flax Linen",
    material_ar: "١٠٠٪ كتان عضوي أوروبي نقي",
    weight_kg: 0.3,
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Express Delivery within 2-4 business days.",
    shipping_ar: "توصيل سريع مجاني متاح خلال ٢-٤ أيام عمل.",
    returnPolicy_en: "30-day return policy.",
    returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً.",
    flashSale: true,
    reviews: []
  },
  {
    id: "p5",
    sku: "VG-S-SHO-05",
    brand: "Vogue Footwear",
    category: "shoes",
    category_en: "Shoes",
    category_ar: "أحذية",
    name_en: "Minimalist Italian Leather Sneakers",
    name_ar: "حذاء رياضي من الجلد الإيطالي البسيط",
    short_desc_en: "Crafted in Milan, featuring butter-soft Nappa leather and hand-stitched cup soles.",
    short_desc_ar: "صُنع في ميلانو، يتميز بجلد النابا ناعم كالملمس ونعل مخيط يدويًا.",
    long_desc_en: "The ultimate modern classic. Clean, understated silhouette that seamlessly pairs with fine tailoring or weekend denim. Expertly handcrafted in Italy from top-grain Nappa leather, lined with breathable calfskin, and set on durable Margom rubber cup soles. Complete with waxed cotton laces.",
    long_desc_ar: "الكلاسيكية العصرية المطلقة. تصميم بسيط وراقٍ يتناسب بسلاسة مع البدلات المفصلة الفاخرة أو بنطال الدينيم المريح. صُنع يدويًا بخبرة فائقة في إيطاليا من جلد النابا عالي الجودة، مبطن بجلد العجل المنعش، ومرتكز على نعل مطاطي متين ومقاوم. يأتي مع أربطة قطنية شمعية ممتازة.",
    price: 240,
    rating: 4.9,
    reviewsCount: 71,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name_en: "Priscilla White", name_ar: "أبيض عاجي نقّي", hex: "#fafafa" },
      { name_en: "Chic Obsidian", name_ar: "أسود سبجي فخم", hex: "#1c1c1c" }
    ],
    material_en: "100% Italian Top-Grain Nappa Leather, Rubber Sole",
    material_ar: "١٠٠٪ جلد نابا إيطالي نقي عالي الجودة، نعل مطاطي ميرغوم",
    weight_kg: 1.1,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery with luxury brand packaging.",
    shipping_ar: "توصيل سريع مجاني فاخر في تغليف يحمل شعار الماركة.",
    returnPolicy_en: "Complimentary 30-day returns in original condition.",
    returnPolicy_ar: "إرجاع مجاني خلال ٣٠ يوماً في حالته الأصلية.",
    featured: true,
    bestSeller: true,
    reviews: []
  },
  {
    id: "p6",
    sku: "VG-A-BAG-06",
    brand: "Vogue Leathercraft",
    category: "bags",
    category_en: "Bags & Leather Goods",
    category_ar: "حقائب وجلديات",
    name_en: "Sienna Pebbled Leather Tote",
    name_ar: "حقيبة توت من الجلد المحبب بلون سيينا",
    short_desc_en: "A spacious, structured everyday tote made of full-grain Italian pebbled leather.",
    short_desc_ar: "حقيبة يد واسعة ومهيكلة للاستخدام اليومي مصنوعة من الجلد الإيطالي المحبب بالكامل.",
    long_desc_en: "Designed to carry all your essentials without sacrificing an ounce of style. This premium tote bag features a roomy central compartment, secure interior zip pocket, protective metal feet, and top handles crafted for comfortable shoulder carry. Hand-painted edges demonstrate our rigorous craft standards.",
    long_desc_ar: "صُممت لتتسع لجميع احتياجاتك اليومية دون التضحية بأناقتك الفخمة. تتميز حقيبة التوت الفاخرة هذه بمقصورة رئيسية واسعة، وجيب داخلي بسحاب آمن، وقواعد معدنية واقية لحماية القاعدة، ومقابض علوية مريحة للحمل على الكتف. حواف مطلية يدوياً تؤكد معايير الحرفية العالية لدينا.",
    price: 290,
    discountPrice: 249,
    discountPercent: 14,
    rating: 4.8,
    reviewsCount: 26,
    sizes: ["One Size"],
    colors: [
      { name_en: "Sienna Tan", name_ar: "بني سيينا دافئ", hex: "#a0522d" },
      { name_en: "Noir Black", name_ar: "أسود فاحم", hex: "#0b0b0b" },
      { name_en: "Taupe", name_ar: "رمادي داكن ناعم", hex: "#b38b6d" }
    ],
    material_en: "100% Genuine Full-Grain Pebbled Calf Leather, Solid Brass Hardware",
    material_ar: "١٠٠٪ جلد عجل طبيعي محبب بالكامل، إكسسوارات من النحاس الصلب",
    weight_kg: 1.3,
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery & Signature dustbag included.",
    shipping_ar: "توصيل سريع مجاني ويتضمن حقيبة غبار تحمل توقيع العلامة.",
    returnPolicy_en: "30-day premium return policy.",
    returnPolicy_ar: "إرجاع ميسر راقٍ خلال ٣٠ يوماً.",
    bestSeller: true,
    reviews: []
  },
  {
    id: "p7",
    sku: "VG-K-SWE-07",
    brand: "Vogue Petit",
    category: "kids",
    category_en: "Kids' Collection",
    category_ar: "مجموعة الأطفال",
    name_en: "Organic Cotton Ribbed Knit Sweater",
    name_ar: "كنزة محبوكة مضلعة من القطن العضوي",
    short_desc_en: "Ultra-soft, non-allergenic ribbed sweater for toddlers and kids.",
    short_desc_ar: "كنزة مضلعة فائقة النعومة ومضادة للحساسية للأطفال الصغار والكبار.",
    long_desc_en: "Knitted from GOTS-certified 100% organic cotton, this cozy sweater is designed for active kids who value both absolute comfort and luxury styling. Features mock-horn buttons at the collar for easy dressing and elastic cuffs to retain cozy warmth.",
    long_desc_ar: "محبوكة من القطن العضوي النقي ١٠٠٪ المعتمد بشهادة GOTS. صُممت هذه الكنزة الدافئة للأطفال النشيطين الذين يفضلون الراحة المطلقة والأناقة الفخمة. تتميز بأزرار أنيقة عند الياقة لسهولة الارتداء وأساور مرنة للاحتفاظ بالدفء والراحة.",
    price: 55,
    rating: 4.5,
    reviewsCount: 14,
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [
      { name_en: "Sage Green", name_ar: "أخضر مريمية", hex: "#9caf88" },
      { name_en: "Oatmeal Beige", name_ar: "بيج الشوفان الدافئ", hex: "#efeae1" }
    ],
    material_en: "100% GOTS-Certified Organic Cotton",
    material_ar: "١٠٠٪ قطن عضوي نقي معتمد من GOTS",
    weight_kg: 0.3,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Delivered in 2-4 business days.",
    shipping_ar: "التوصيل متاح خلال ٢-٤ أيام عمل.",
    returnPolicy_en: "30-day standard return policy.",
    returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً.",
    newArrival: true,
    reviews: []
  },
  {
    id: "p8",
    sku: "VG-A-SUN-08",
    brand: "Vogue Accents",
    category: "accessories",
    category_en: "Accessories",
    category_ar: "إكسسوارات",
    name_en: "Milano Polarized Acetate Sunglasses",
    name_ar: "نظارات شمسية مستقطبة من الأسيتات",
    short_desc_en: "Classic round tortoise-shell frame with premium UV400 polarized lenses.",
    short_desc_ar: "إطار كلاسيكي دائري بنقشة السلحفاة مع عدسات مستقطبة ممتازة توفر حماية UV400.",
    long_desc_en: "Handcrafted from durable biodegradable Mazzucchelli acetate, these timeless round sunglasses are designed with an elegant keyhole bridge and robust five-barrel metal hinges. Polarized anti-reflective green lenses offer superior visual clarity and maximum glare protection.",
    long_desc_ar: "صُنعت يدويًا من أسيتات مازوتشيلي المتين والقابل للتحلل الحيوي. صُممت هذه النظارات الدائرية الخالدة بجسر أنيق ومفصلات معدنية قوية للغاية خماسية الحلقات. توفر العدسات الخضراء المستقطبة المضادة للانعكاس وضوحًا بصريًا فائقًا وحماية قصوى من الوهج.",
    price: 125,
    discountPrice: 95,
    discountPercent: 24,
    rating: 4.7,
    reviewsCount: 38,
    sizes: ["One Size"],
    colors: [
      { name_en: "Tortoise Shell", name_ar: "نقشة السلحفاة", hex: "#4a3c31" },
      { name_en: "Classic Obsidian", name_ar: "أسود سبجي لامع", hex: "#111111" }
    ],
    material_en: "100% Premium Mazzucchelli Acetate, CR-39 Lenses",
    material_ar: "١٠٠٪ أسيتات مازوتشيلي الفاخر، عدسات CR-39 المستقطبة",
    weight_kg: 0.04,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery with hard protective case.",
    shipping_ar: "توصيل سريع مجاني وتأتي مع علبة واقية صلبة فاخرة.",
    returnPolicy_en: "30-day return policy.",
    returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً.",
    flashSale: true,
    reviews: []
  },
  {
    id: "p9",
    sku: "VG-V-WND-09",
    brand: "Vogue Active",
    category: "activewear",
    category_en: "Activewear",
    category_ar: "ملابس رياضية",
    name_en: "Vapor-Block Lightweight Windbreaker",
    name_ar: "سترة رياضية واقية من الرياح وخفيفة الوزن",
    short_desc_en: "Water-repellent, highly windproof active jacket with custom ventilations.",
    short_desc_ar: "سترة رياضية مقاومة للماء والرياح بشكل ممتاز مع فتحات تهوية مخصصة.",
    long_desc_en: "Engineered for luxury runners, this technical windbreaker balances performance with absolute minimalism. Constructed from recycled ultra-fine ripstop fibers, coated with eco-friendly durable water repellent (DWR). Features hidden zipped storage, adjustable storm hood, and low-light reflective branding.",
    long_desc_ar: "صُممت خصيصاً للرياضيين ومحبي الركض الباحثين عن التميز، توازن هذه السترة الواقية من الرياح بين الأداء العالي والتصميم البسيط الأنيق. مصنوعة من ألياف ريبستوب دقيقة ومعاد تدويرها، ومطلية بمادة طاردة للماء صديقة للبيئة. تتميز بجيوب مخفية بسحابات، وغطاء رأس واقٍ قابل للتعديل، وشعار عاكس للضوء.",
    price: 135,
    rating: 4.6,
    reviewsCount: 29,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_en: "Alpine Mint", name_ar: "نعناعي جبلي منعش", hex: "#e0ede6" },
      { name_en: "Slate Grey", name_ar: "رمادي صخري", hex: "#708090" }
    ],
    material_en: "100% Recycled Technical Ripstop Polyester",
    material_ar: "١٠٠٪ بوليستر ريبستوب تقني معاد تدويره",
    weight_kg: 0.28,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1483721310020-0a33437d8002?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Delivered in 2-4 business days.",
    shipping_ar: "التوصيل متاح خلال ٢-٤ أيام عمل.",
    returnPolicy_en: "30-day standard return policy.",
    returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً.",
    reviews: []
  },
  {
    id: "p10",
    sku: "VG-W-KN-10",
    brand: "Atelier Vogue",
    category: "women",
    category_en: "Women's Apparel",
    category_ar: "ملابس نسائية",
    name_en: "Ultra-Fine Cashmere Knit Sweater",
    name_ar: "كنزة من صوف الكشمير فائق النعومة",
    short_desc_en: "Spun from 100% pure inner Mongolian luxury cashmere.",
    short_desc_ar: "مغزولة من كشمير منغوليا الداخلية النقي والفاخر ١٠٠٪.",
    long_desc_en: "A sensory masterpiece. Spun from double-ply, long-staple cashmere fibers that offer unparalleled softness and exceptional warmth with a cloud-light weight. Crafted with a relaxed crew neck, classic rib knit trims, and side slits for a gorgeous fluid drape.",
    long_desc_ar: "تحفة فنية تداعب الحواس. مغزولة من ألياف الكشمير ثنائية الطبقات طويلة التيلة والتي تمنحك نعومة لا تضاهى ودفئًا استثنائيًا بوزن خفيف كالسحاب. صُممت بياقة دائرية مريحة، وأطراف محبوكة مضلعة كلاسيكية، وفتحات جانبية تمنح الكنزة انسيابية رائعة عند ارتدائها.",
    price: 180,
    discountPrice: 144,
    discountPercent: 20,
    rating: 4.95,
    reviewsCount: 42,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_en: "Heather Oatmeal", name_ar: "بيج شوفان مبقع", hex: "#dfd9d0" },
      { name_en: "Cloud Pink", name_ar: "وردي سحابي ناعم", hex: "#fcdce1" },
      { name_en: "Sage Green", name_ar: "أخضر مريمية هادئ", hex: "#8a9a86" }
    ],
    material_en: "100% Pure Inner Mongolian Cashmere",
    material_ar: "١٠٠٪ كشمير منغولي داخلي نقي فاخر",
    weight_kg: 0.4,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Delivery in signature gift boxes.",
    shipping_ar: "توصيل سريع مجاني في صناديق هدايا تحمل توقيع علامتنا الفاخرة.",
    returnPolicy_en: "Complimentary 30-day premium return policy.",
    returnPolicy_ar: "إرجاع مجاني ميسر راقٍ خلال ٣٠ يوماً.",
    newArrival: true,
    bestSeller: true,
    reviews: []
  },
  {
    id: "p11",
    sku: "VG-M-SU-11",
    brand: "Vogue Tailors",
    category: "men",
    category_en: "Men's Apparel",
    category_ar: "ملابس رجالية",
    name_en: "Modern Fit Wool-Silk Suit Blazer",
    name_ar: "سترة بدلة صوف وحرير بقصة عصرية",
    short_desc_en: "Premium bespoke style blazer crafted in a blend of merino wool and pure mulberry silk.",
    short_desc_ar: "بليزر بدلة راقٍ بلمسات تفصيلية فاخرة مصنوع من مزيج صوف الميرينو وحرير التوت النقي.",
    long_desc_en: "For the absolute discerning gentleman. Crafted in an exquisite blend of merino wool and luxury mulberry silk, giving it a subtle sheen and marvelous breathability. Fitted with full canvas chest construction, hand-finished lapels, and functional ticket pockets.",
    long_desc_ar: "للإصدار المحدود من السادة المميزين. صُنع من مزيج صوف الميرينو الفاخر وحرير التوت النقي، مما يمنحه لمعاناً خفيفاً وتهوية ممتازة. مجهز بهيكل داخلي كامل من الكانفاس عند الصدر، وياقات منتهية يدوياً بدقة فائقة، وجيوب تذاكر عملية للغاية.",
    price: 399,
    rating: 5.0,
    reviewsCount: 16,
    sizes: ["48", "50", "52", "54", "56"],
    colors: [
      { name_en: "Obsidian Black", name_ar: "أسود سبجي ملكي", hex: "#151515" },
      { name_en: "Royal Midnight Blue", name_ar: "أزرق ملكي كحلي", hex: "#0c1a30" }
    ],
    material_en: "85% Super 120s Merino Wool, 15% Mulberry Silk. Full canvas construct.",
    material_ar: "٨٥٪ صوف ميرينو سوبر ١٢٠، ١٥٪ حرير التوت الطبيعي. هيكل كانفاس كامل.",
    weight_kg: 1.4,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Complimentary Express Courier with customized premium hanger & garment cover.",
    shipping_ar: "توصيل سريع مجاني مميز يتضمن علاقة ملابس فاخرة مخصصة وغطاء واقٍ.",
    returnPolicy_en: "Complimentary 30-day secure return shipping.",
    returnPolicy_ar: "شحن مجاني ميسر ومضمون للإرجاع خلال ٣٠ يوماً.",
    featured: true,
    reviews: []
  },
  {
    id: "p12",
    sku: "VG-A-NL-12",
    brand: "Vogue Jewelry",
    category: "accessories",
    category_en: "Accessories",
    category_ar: "إكسسوارات",
    name_en: "18K Gold-Plated Chunky Chain Link Necklace",
    name_ar: "قلادة سلسلة حلقات سميكة مطلية بالذهب عيار ١٨",
    short_desc_en: "Statement-making recycled brass chain with heavy luxury 18k gold vermeil.",
    short_desc_ar: "سلسلة مميزة من النحاس المعاد تدويره ومطلية بطبقة سميكة من ذهب عيار ١٨ الفاخر.",
    long_desc_en: "An audacious accent to elevate clean looks. Handcrafted from certified eco-friendly recycled brass, plated with a thick 2.5-micron layer of lustrous 18-karat gold. Fitted with a secure, custom-branded lobster clasp. Hypoallergenic, lead, and nickel-free.",
    long_desc_ar: "لمسة جريئة وجذابة ترتقي بإطلالتك البسيطة. صُنعت يدويًا من النحاس المعاد تدويره والمعتمد بيئيًا، ومطلية بطبقة سميكة من الذهب اللامع عيار ١٨ بقياس ٢.٥ ميكرون. مجهزة بمشبك لوبستر آمن مخصص يحمل شعار الماركة. آمنة ومضادة للحساسية، وخالية تماماً من الرصاص والنيكل.",
    price: 110,
    discountPrice: 88,
    discountPercent: 20,
    rating: 4.8,
    reviewsCount: 22,
    sizes: ["One Size"],
    colors: [
      { name_en: "18K Yellow Gold", name_ar: "ذهب أصفر عيار ١٨", hex: "#ffd700" }
    ],
    material_en: "18K Gold Vermeil over recycled brass",
    material_ar: "ذهب عيار ١٨ مطلي فوق النحاس الصديق للبيئة المعاد تدويره",
    weight_kg: 0.08,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    shipping_en: "Express Delivery in elegant embossed jewelry cases.",
    shipping_ar: "توصيل سريع متاح في علب مجوهرات فاخرة منقوشة.",
    returnPolicy_en: "30-day return policy for sealed jewelry package.",
    returnPolicy_ar: "إرجاع ميسر خلال ٣٠ يوماً بشرط عدم فتح الغلاف الواقي لعلبة المجوهرات.",
    newArrival: true,
    reviews: []
  }
];

export const mockCoupons = [
  {
    code: "VOGUE20",
    discountPercent: 20,
    minSpend: 150,
    description_en: "20% off luxury fashion on orders above $150",
    description_ar: "خصم ٢٠٪ على الملابس الفاخرة للطلبات فوق ١٥٠ دولار"
  },
  {
    code: "WELCOME10",
    discountPercent: 10,
    minSpend: 50,
    description_en: "10% off your inaugural order",
    description_ar: "خصم ١٠٪ على أول طلب لك في المتجر"
  },
  {
    code: "VIP30",
    discountPercent: 30,
    minSpend: 300,
    description_en: "VIP exclusive 30% off on premium products above $300",
    description_ar: "خصم كبار الشخصيات الحصري ٣٠٪ للمشتريات فوق ٣٠٠ دولار"
  }
];

export const mockShippingMethods = [
  {
    id: "std",
    name_en: "Complimentary Luxury Shipping",
    name_ar: "شحن فاخر مجاني",
    duration_en: "2-4 Business Days",
    duration_ar: "٢-٤ أيام عمل",
    cost: 0
  },
  {
    id: "exp",
    name_en: "VIP Next-Day Concierge Courier",
    name_ar: "مندوب كبار الشخصيات للتسليم الفوري في اليوم التالي",
    duration_en: "1 Business Day",
    duration_ar: "يوم عمل واحد",
    cost: 25
  }
];
