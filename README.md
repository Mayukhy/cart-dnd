# Shopping Cart with Drag & Drop, Offers & Coupons

A React shopping cart app with drag-and-drop reordering, infinite scroll product listing, category-based cart views, and a coupon/offer system.

## Features

- **Product Listing** — Browse products fetched from [DummyJSON API](https://dummyjson.com) with infinite scroll (IntersectionObserver)
- **Cart Management** — Add, remove, increment, and decrement item quantities
- **Drag & Drop Reordering** — Reorder cart items via drag-and-drop using [@dnd-kit](https://dndkit.com)
- **Category View** — Switch between "All in One" and "Categorized" cart views with per-category drag-and-drop
- **Responsive Design** — Slide-out cart drawer on mobile, static sidebar on desktop
- **Skeleton Loading** — Loading placeholders while products are being fetched
- **Auto-Apply Offers** — Best applicable offer is automatically computed and applied on every cart change based on cart threshold, product presence, or item quantity
- **Coupon Code Input** — Manually apply coupon codes; validated against condition type (cart total, product in cart, quantity) with user-friendly error messages
- **Applied Offers Display** — Active code coupons shown as removable badges with saved amount; removing restores the previous discount or full price
- **Available Offers List** — Auto-apply offers shown as green badges, code-required offers shown as indigo badges with the code highlighted

## Tech Stack

- **React 19** + **Vite**
- **Zustand** — State management
- **@dnd-kit** — Drag-and-drop (core, sortable, utilities)
- **Tailwind CSS 4** — Styling
- **Axios** — API requests

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── api/
│   └── getRes.js          # API calls (products, categories)
├── components/
│   ├── Cart.jsx            # Cart with tabs, DnD reordering, offers & coupon input
│   ├── CartItem.jsx        # Sortable cart item with quantity controls
│   ├── ProductCard.jsx     # Product display card
│   ├── ProductCardSkeleton.jsx  # Loading skeleton
│   └── ProductsList.jsx    # Infinite scroll product grid
├── store/
│   └── customStore.js      # Zustand store (cart, products, filters, offers, coupons)
├── cuppons.js              # Coupon definitions (cart threshold, product, quantity)
├── App.jsx                 # Main layout
└── main.jsx                # Entry point
```
