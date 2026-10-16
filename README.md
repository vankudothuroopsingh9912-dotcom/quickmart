# QuickMart – Modern Online Shopping Platform

> *"Everything You Need, Just a Click Away."*

QuickMart is a production-grade, responsive full-stack e-commerce web application featuring a rich product catalog across 9 departments, real-time live search autocomplete, persistent cart with coupon calculations, multi-step checkout with simulated Razorpay test mode payment verification & Cash on Delivery, shipment tracking timeline with printable invoices, and a comprehensive admin management console.

---

## 🌟 Key Features

1. **Brand Identity & UI/UX:**
   - Blue (`#2563eb`), white, and vibrant orange (`#f97316`) accent palette.
   - Clean typography using Google's *Plus Jakarta Sans*.
   - Responsive layouts across mobile, tablet, and desktop screens.
   - Micro-animations, toast notifications, loading skeletons, and celebratory checkout confetti.

2. **Catalog & Department Browsing:**
   - **9 Organized Categories:** Electronics, Mobiles & Accessories, Fashion & Clothing, Home & Kitchen, Grocery & Daily Essentials, Beauty & Personal Care, Books & Stationery, Sports & Fitness, Toys & Games.
   - Multi-parameter filtering: Category, Brand checklist, Price range slider, Customer rating (★), and In-Stock toggle.
   - Dynamic sorting: Most Popular, Price: Low to High, Price: High to Low, Rating, and Newest Arrivals.
   - Pagination and active filter pills with one-click reset.

3. **Smart Search & Discovery:**
   - Live search suggestions dropdown with thumbnail previews and direct navigation.
   - Flash Deals section with synchronized real-time countdown timer.
   - Curated Bestsellers and Promotional split banners.

4. **Product Details & Customer Feedback:**
   - Multi-image gallery with thumbnail switcher.
   - Variant picker (e.g. Size, Color, Storage capacity).
   - Quantity stepper and stock validation.
   - Pincode delivery estimator.
   - Technical specifications grid.
   - Customer review submission with star ratings and verified purchase badges.
   - Related products carousel.

5. **Shopping Cart & Wishlist:**
   - Real-time subtotal, savings, dynamic tax (8%), and shipping calculation.
   - Progress bar towards $75 Free Delivery threshold.
   - Promo coupon engine:
     - `QUICK10` — 10% discount on orders over $30
     - `SUPER20` — 20% discount on orders over $100
     - `FREESHIP` — Free expedited shipping over $50
   - Persistent wishlist and side-by-side product comparison modal.

6. **Checkout & Payment Security:**
   - Multi-step flow: Address selector & creator, Shipping method (Standard vs Priority Express), Payment selection.
   - **Razorpay Online Test Mode Gateway:** Interactive modal supporting simulated Credit/Debit cards, UPI (Google Pay / PhonePe), and NetBanking with server-side authorization verification.
   - **Cash on Delivery (COD)** support with doorstep verification.

7. **Order Management & Live Tracking:**
   - Full 6-stage order timeline: `Order Placed` &rarr; `Confirmed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Out for Delivery` &rarr; `Delivered`.
   - Real-time tracking by Order ID or Waybill tracking number.
   - Printable invoice generator formatted for standard paper and PDF print.
   - Customer cancellation and 30-day return authorization workflow.

8. **Admin Control Console:**
   - Real-time revenue KPI cards and low-stock alerts (<15 units).
   - Product Management: Create new items, edit prices/descriptions, adjust stock levels, and delete products.
   - Order Management: Advance shipment stages directly from the admin dashboard.
   - Customer Management: Inspect user spend and switch customer/admin roles.

---

## 🔑 Demo Accounts (Pre-seeded)

For immediate testing, quick-login buttons are provided on the Sign In page and User Menu:

| Role | Email | Password | Privileges |
|------|-------|----------|------------|
| **Customer** | `sarah@quickmart.com` | `customer123` | Browsing, cart, checkout, saved addresses, order tracking |
| **Administrator** | `admin@quickmart.com` | `admin123` | Full access to Admin Console, revenue KPIs, inventory & order status controls |

---

## 🛠️ Architecture & Backend APIs

```
├── server.ts                       # Express server integrating Vite middlewares
├── server/
│   ├── data/seedData.ts            # Realistic product catalog across 9 categories
│   ├── db/database.ts              # In-memory document database store simulating Mongoose
│   ├── middleware/auth.ts          # JWT bearer token & admin verification middleware
│   └── routes/
│       ├── authRoutes.ts           # Login, register, profile, addresses
│       ├── productRoutes.ts        # Search, filter, deals, review submissions
│       ├── categoryRoutes.ts       # Departments listing & counts
│       ├── orderRoutes.ts          # Order creation, Razorpay test verification, cancellation
│       ├── couponRoutes.ts         # Promo code validation
│       ├── adminRoutes.ts          # Admin KPIs, product CRUD, status updater
│       └── contactRoutes.ts        # Customer contact inquiry inbox
├── src/
│   ├── types/index.ts              # TypeScript definitions
│   ├── services/api.ts             # Centralized fetch API client
│   ├── context/                    # Auth, Cart, Wishlist, Compare, Toast, RecentlyViewed
│   ├── components/                 # Navbar, Footer, ProductCard, QuickView, RazorpayModal
│   └── pages/                      # 20+ responsive views and Admin Console
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
