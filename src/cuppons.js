// Coupon condition types:
//   "cart_threshold"      — applies when cart total >= minCartTotal
//   "product_in_cart"     — applies when a specific product (by id) is in the cart
//   "product_quantity"    — applies when a specific product has qty >= minQty in cart
//
// Discount types:
//   "percentage"  — discountValue is a % off the cart total
//   "flat"        — discountValue is a flat ₹/$ amount off

export const coupons = [
  // ── Cart threshold coupons ─────────────────────────────────────────────────
  {
    id: "CPN001",
    code: "SAVE10",
    description: "10% off on orders above ₹500",
    conditionType: "cart_threshold",
    minCartTotal: 500,
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: 150,      // cap: never save more than ₹150
    autoApply: false,
    active: true,
  },
  {
    id: "CPN002",
    code: null,            // no code — purely auto-applied
    description: "Flat ₹100 off on orders above ₹1000",
    conditionType: "cart_threshold",
    minCartTotal: 1000,
    discountType: "flat",
    discountValue: 100,
    maxDiscount: null,
    autoApply: true,
    active: true,
  },
  {
    id: "CPN003",
    code: "BIGSAVE",
    description: "20% off on orders above ₹2000",
    conditionType: "cart_threshold",
    minCartTotal: 2000,
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 500,
    autoApply: false,
    active: true,
  },

  // ── Product-in-cart coupons ────────────────────────────────────────────────
  {
    id: "CPN004",
    code: "PHONE15",
    description: "15% off when a smartphone is in your cart",
    conditionType: "product_in_cart",
    productId: 1,          // matches a product id from the API
    discountType: "percentage",
    discountValue: 15,
    maxDiscount: 300,
    autoApply: false,
    active: true,
  },
  {
    id: "CPN005",
    code: null,
    description: "Auto ₹50 off when headphones are in your cart",
    conditionType: "product_in_cart",
    productId: 11,
    discountType: "flat",
    discountValue: 50,
    maxDiscount: null,
    autoApply: true,
    active: true,
  },

  // ── Product-quantity coupons ───────────────────────────────────────────────
  {
    id: "CPN006",
    code: "BUY3GET",
    description: "₹200 off when you buy 3 or more of the same item",
    conditionType: "product_quantity",
    productId: null,       // null = any product qualifies
    minQty: 3,
    discountType: "flat",
    discountValue: 200,
    maxDiscount: null,
    autoApply: false,
    active: true,
  },
  {
    id: "CPN007",
    code: null,
    description: "Auto 5% off when you have 5+ units of product #2",
    conditionType: "product_quantity",
    productId: 2,
    minQty: 5,
    discountType: "percentage",
    discountValue: 5,
    maxDiscount: 100,
    autoApply: true,
    active: true,
  },
  {
    id: "CPN008",
    code: "BULK20",
    description: "20% off when you buy 2 or more of product #5",
    conditionType: "product_quantity",
    productId: 5,
    minQty: 2,
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 400,
    autoApply: false,
    active: false,         // inactive / expired coupon example
  },
];
