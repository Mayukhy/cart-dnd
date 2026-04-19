# Shopping Cart with Drag & Drop

A React shopping cart app with drag-and-drop reordering, infinite scroll product listing, and category-based cart views.

## Features

- **Product Listing** — Browse products fetched from [DummyJSON API](https://dummyjson.com) with infinite scroll (IntersectionObserver)
- **Cart Management** — Add, remove, increment, and decrement item quantities
- **Drag & Drop Reordering** — Reorder cart items via drag-and-drop using [@dnd-kit](https://dndkit.com)
- **Category View** — Switch between "All in One" and "Categorized" cart views with per-category drag-and-drop
- **Responsive Design** — Slide-out cart drawer on mobile, static sidebar on desktop
- **Skeleton Loading** — Loading placeholders while products are being fetched

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
│   ├── Cart.jsx            # Cart with tabs and DnD reordering
│   ├── CartItem.jsx        # Sortable cart item with quantity controls
│   ├── ProductCard.jsx     # Product display card
│   ├── ProductCardSkeleton.jsx  # Loading skeleton
│   └── ProductsList.jsx    # Infinite scroll product grid
├── store/
│   └── customStore.js      # Zustand store (cart, products, filters)
├── App.jsx                 # Main layout
└── main.jsx                # Entry point
```
