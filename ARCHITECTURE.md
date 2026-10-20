# TREND STREET — Technical Architecture Specification

> **Document Version**: 1.0.0  
> **Status**: Approved Architectural Baseline  
> **Primary Framework**: Next.js 14.2.15 App Router | React 18.3.1 | TypeScript 5.6.3  
> **Target Database**: PostgreSQL 16 (Managed via Neon / Supabase)  
> **ORM / Data Layer**: Prisma ORM v5 / Drizzle ORM  

---

## 1. Architectural Philosophy

Trend Street is engineered as a **hybrid server-first commerce engine**. It pairs the ultra-responsive performance of React Server Components (RSC) and Incremental Static Regeneration (ISR) with client-side interactive islands for 3D WebGL fabric exploration, thumb-friendly mobile bottom navigation, and slide-over drawers.

### Core Architecture Pillars:
1. **Server-Authoritative Commerce**: The browser client is strictly a presentation layer. Pricing calculations, tax rules, courier fees, inventory deductions, and promotional validation are executed exclusively on the server.
2. **Defensive Separation of Concerns**: Public browsing routes (`/`, `/shop`, `/product/[id]`, `/about`) are isolated from administrative control rooms (`/admin/*`) through Edge middleware and server session cookies.
3. **Graceful Progressive Enhancement**: Desktop users receive interactive 3D WebGL floating wear and tilt physics; mobile users receive ultra-lightweight, 60fps touch-optimized silhouette cards without battery drain or GPU contention.
4. **Resilient Data State Machines**: Order and payment workflows operate under strict mathematical state transitions, preventing duplicate orders, phantom charges, or untracked fulfillment states.

---

## 2. Target Production Architecture Diagram

```
                                    ┌────────────────────────────┐
                                    │    Client Browser / PWA    │
                                    │  (Desktop Web / Mobile)    │
                                    └──────────────┬─────────────┘
                                                   │
                                                   │ HTTPS (TLS 1.3)
                                                   ▼
                                    ┌────────────────────────────┐
                                    │      Vercel / Cloudflare   │
                                    │    Global Edge Network     │
                                    └──────────────┬─────────────┘
                                                   │
                                                   ▼
                                    ┌────────────────────────────┐
                                    │    Next.js Edge Middleware │
                                    │    (src/middleware.ts)     │
                                    │  • Route Guards (/admin)   │
                                    │  • Session Validation      │
                                    │  • Security Header Injection│
                                    └──────────────┬─────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
        ┌──────────────────────────────────┐                ┌──────────────────────────────────┐
        │   Server Components (SSR/ISR)    │                │      API & Server Actions        │
        │ • Catalog Pages (/shop)          │                │ • POST /api/checkout/session     │
        │ • Category Pages (/oversized...) │                │ • POST /api/webhooks/payment     │
        │ • Product Detail (/product/[id]) │                │ • POST /api/admin/products       │
        │ • Sitemaps & robots.txt          │                │ • POST /api/admin/settings       │
        └────────────────┬─────────────────┘                └────────────────┬─────────────────┘
                         │                                                   │
                         └─────────────────────────┬─────────────────────────┘
                                                   │
                                                   ▼
                                    ┌────────────────────────────┐
                                    │     Data Access Layer      │
                                    │   (Prisma / PostgreSQL)    │
                                    │  • Parameterized Queries   │
                                    │  • Connection Pooling      │
                                    │  • Row-Level Locking       │
                                    └──────────────┬─────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
        ┌──────────────────────────────────┐                ┌──────────────────────────────────┐
        │       Managed PostgreSQL         │                │     External Integrations        │
        │ • Relational Tables              │                │ • Razorpay / Stripe (Payments)   │
        │ • ACID Transactions              │                │ • Cloudflare R2 / S3 (Images)    │
        │ • Immutable Audit Logs           │                │ • Resend / SMTP (Notifications)  │
        └──────────────────────────────────┘                └──────────────────────────────────┘
```

---

## 3. Route & Component Boundary Matrix

| Route | Execution Type | Primary Rendering Strategy | Data Source |
|:---|:---:|:---|:---|
| `/` | Hybrid | RSC for layout/grids; Client Component for 3D Hero & Swatches | Cached DB query (Revalidate: 3600s) |
| `/shop` | Dynamic SSR | RSC with `<Suspense>` boundary around search params | Live DB query with category/price filters |
| `/oversized` | ISR | Static with background revalidation | Cached DB query for category 'Oversized' |
| `/jeans` | ISR | Static with background revalidation | Cached DB query for category 'Jeans' |
| `/boxy-fit` | ISR | Static with background revalidation | Cached DB query for category 'Boxy Fit' |
| `/jackets` | ISR | Static with background revalidation | Cached DB query for category 'Jackets' |
| `/product/[id]` | ISR / SSR | RSC with dynamic params; Client islands for size/color selector | Cached DB query with fallback |
| `/bag` | Client Island | Client Component syncing with anonymous cart state | Server validation via `/api/cart/sync` |
| `/checkout` | Client + Server | Client Form communicating with Server Action checkout session | Authoritative server price engine |
| `/order-confirmation/[id]` | Server Component | Dynamic SSR verifying customer ownership before rendering | Database `orders` table |
| `/saved` | Client Island | Local storage fallback synced to database for authenticated users | Client state + DB sync |
| `/lookbook` | Static | RSC with high-resolution imagery and hotspot tags | Static CMS dataset |
| `/about` | Static | Static RSC | Static asset |
| `/admin/login` | Client Component | Client login form posting credentials to `/api/auth/login` | Auth handler |
| `/admin` | Dynamic Server | RSC requiring verified admin session; KPI aggregator | Database aggregation queries |
| `/admin/settings` | Client Component | Admin customizer syncing with `/api/admin/settings` | Database `site_settings` table |
| `/admin/products` | Dynamic Server | RSC product table with Client modal for CRUD operations | Database `products` table |
| `/admin/orders` | Dynamic Server | RSC fulfillment table with Client status updater | Database `orders` table |

---

## 4. Order & Payment Lifecycle State Machines

To prevent race conditions, duplicate fulfillment, and financial inconsistencies, the system enforces strict state machines:

### 4.1 Order Lifecycle State Machine
```
[ CART CREATED ]
       │
       ▼
   [ PENDING ] ──────────── (Payment Timeout / User Cancel) ───────────► [ CANCELLED ]
       │
       ▼ (Webhook: Payment Succeeded)
   [ PAID ]
       │
       ▼ (Admin Allocates Stock & Dispatches)
  [ PROCESSING ]
       │
       ▼ (Courier AWB Generated)
  [ IN_TRANSIT ]
       │
       ▼ (Courier Confirms Delivery)
  [ DELIVERED ]
       │
       ▼ (Customer Returns Item - Within Policy)
   [ REFUNDED ]
```

### 4.2 Order State Transition Invariants:
1. An order can transition to `PAID` **only** upon cryptographic receipt of a payment gateway webhook or verified gateway polling event.
2. Inventory stock is decremented within an atomic transaction at the moment of `PAID` confirmation. If stock is insufficient, the payment is automatically flagged for refund.
3. Once an order reaches `IN_TRANSIT` or `DELIVERED`, it cannot transition backwards to `PENDING` or `PROCESSING`.
4. Cancellations automatically trigger inventory replenishment via transactional release.

---

## 5. Security & Edge Middleware Pipeline

The Next.js Edge Middleware (`src/middleware.ts`) operates prior to any page render:
1. **Public Route Pass-Through**: All storefront routes (`/`, `/shop`, `/product/*`, `/about`, `/lookbook`, `/bag`, `/checkout`) pass immediately without authentication barriers.
2. **Admin Protection Gate**:
   - Intercepts all paths starting with `/admin` (except `/admin/login`).
   - Extracts the session cookie (`ts_admin_session`).
   - Verifies the cryptographic HMAC-SHA256 signature using the server secret.
   - If invalid or expired, issues an immediate HTTP 307 redirect to `/admin/login?callbackUrl=...`.
3. **Security Headers**:
   - Injects Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, and Referrer-Policy on every response.
