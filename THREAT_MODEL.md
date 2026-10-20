# TREND STREET — Threat Model & STRIDE Security Architecture

> **Document Version**: 1.0.0  
> **Methodology**: Microsoft STRIDE Threat Modeling & OWASP Threat Dragon Principles  
> **System Scope**: Trend Street Next.js 14 E-Commerce Storefront, Admin CMS, and Database  
> **Target Audience**: Security Engineers, Full-Stack Architects, DevOps  

---

## 1. System Overview & Trust Boundaries

```
[ UNTRUSTED ZONE: PUBLIC INTERNET ]
        │
        │ HTTPS (TLS 1.3)
        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 1: Edge & Gateway                                       │
│ • Next.js Middleware (Edge Runtime)                                    │
│ • Security Headers (CSP, HSTS, X-Frame-Options)                        │
│ • Cookie Cryptographic Verification                                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│ TRUST BOUNDARY 2: Public Storefront   │       │ TRUST BOUNDARY 3: Admin Portal        │
│ • Client Components (React 18)        │       │ • Protected Route: /admin/*           │
│ • Server Components (SSR / RSC)       │       │ • Role-Based Access Control (RBAC)    │
│ • Anonymous Cart & Guest Browsing     │       │ • CMS Settings & Product Management   │
└───────────────────┬───────────────────┘       └───────────────────┬───────────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 4: Application Server & Commerce Services               │
│ • Server Actions & Route Handlers (/api/*)                             │
│ • Zod Schema Input Validation & Sanitization                           │
│ • Pricing & Discount Authority Engine                                  │
│ • Session Management & Rate Limiting                                   │
└───────────────────┬───────────────────────────────────────┬────────────┘
                    │                                       │
                    ▼                                       ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│ TRUST BOUNDARY 5: Persistent Storage  │       │ TRUST BOUNDARY 6: External Gateways   │
│ • PostgreSQL Database                 │       │ • Payment Gateway (Razorpay/Stripe)   │
│ • Prisma / Drizzle ORM Layer          │       │ • Webhook Verification (HMAC-SHA256)  │
│ • Encrypted Passwords (Argon2id)      │       │ • Courier Logistics APIs (Shiprocket) │
└───────────────────────────────────────┘       └───────────────────────────────────────┘
```

---

## 2. Threat Actor Profiles

| Threat Actor | Motivation | Capability | Likely Attack Vectors |
|:---|:---|:---|:---|
| **Anonymous Public Visitor** | Casual browsing, curious exploration | Low | Direct URL enumeration (`/admin`, `/api`), client tampering in DevTools. |
| **Malicious Shopper / Fraudster** | Financial theft, free goods, coupon abuse | Medium | Price tampering in cart payload, coupon brute-forcing, SQL injection, fake payment confirmations. |
| **Credential Harvester / Scraper** | Account takeover, catalog scraping, SEO manipulation | Medium | Credential stuffing, automated bot scraping, prototype pollution, XSS. |
| **Privilege Escalator / Insider** | Administrative data theft, supply chain sabotage | High | Session fixation, cookie manipulation, bypassing unverified middleware, DB parameter injection. |

---

## 3. STRIDE Threat Matrix & Mitigations

### 3.1 Spoofing (Identity Deception)
* **Threat**: An attacker impersonates the administrator by forging the `ts_admin_auth` token in `localStorage`.
  - **Impact**: Attacker accesses `/admin` and gains control over store settings, products, and customer orders.
  - **Mitigation**: Move authentication entirely to server-issued HTTP-only session cookies. Verify cryptographic session signatures in Next.js `middleware.ts` before allowing access to any `/admin/*` route.
* **Threat**: An attacker forges a payment gateway webhook notification claiming an order was successfully paid.
  - **Impact**: The system fulfills orders without receiving funds.
  - **Mitigation**: The webhook endpoint (`/api/webhooks/payment`) verifies HMAC-SHA256 signatures generated using a shared webhook secret before updating order status.

### 3.2 Tampering (Data Modification)
* **Threat**: A customer modifies garment prices or discounts in the shopping cart prior to checkout.
  - **Impact**: High-end garments purchased at fractions of their retail value.
  - **Mitigation**: The client is treated as completely untrusted. The server re-calculates all line-item totals, shipping fees, taxes, and promotional deductions from authoritative database records.
* **Threat**: An attacker submits malicious HTML/JavaScript payloads in the product review or address forms.
  - **Impact**: Stored XSS executed against administrators reviewing customer allocations.
  - **Mitigation**: Strict Zod schema validation on the server, React auto-escaping, and strict Content Security Policy prohibiting inline scripts without nonces.

### 3.3 Repudiation (Disavowal of Actions)
* **Threat**: An administrator deletes a product or cancels an order and denies responsibility.
  - **Impact**: Inability to conduct post-incident forensics or maintain operational accountability.
  - **Mitigation**: An immutable `audit_logs` database table records every administrative event (user ID, action type, entity ID, previous state, new state, client IP, timestamp).

### 3.4 Information Disclosure (Exposure of Private Data)
* **Threat**: Admin credentials disclosed in compiled client-side JavaScript bundles.
  - **Impact**: Total compromise of administrative control.
  - **Mitigation**: Completely eliminate credentials from frontend source code. Store server secrets in non-public environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`).
* **Threat**: Customer order details and delivery addresses exposed via unauthenticated dynamic API routes (e.g. `/api/orders/[id]`).
  - **Impact**: Severe GDPR/privacy violation and customer PII leakage.
  - **Mitigation**: Enforce customer session ownership checks (`order.userId === session.userId`) or short-lived signed tokens for guest order tracking.

### 3.5 Denial of Service (Resource Exhaustion)
* **Threat**: Automated bots flood the checkout endpoint or administrative login with requests.
  - **Impact**: Server CPU exhaustion, database connection pool depletion, and downtime.
  - **Mitigation**: Rate limiting implemented at the edge via Upstash Redis or memory-based token bucket algorithms on `/api/auth/*` and `/api/checkout/*`.

### 3.6 Elevation of Privilege (Unauthorized Access)
* **Threat**: A standard customer modifies their profile role or sends an unauthorized request to update catalog products.
  - **Impact**: Customer attains administrative privileges.
  - **Mitigation**: Role-Based Access Control (RBAC) enforced on the server. Every mutating Server Action or API route explicitly checks `session.user.role === 'ADMIN'`.

---

## 4. Trust Boundary Controls Summary

| Boundary | Control Mechanism | Status in Phase 0 | Production Target |
|:---|:---|:---:|:---:|
| **Client ➔ Edge** | Next.js Middleware & Security Headers | Missing | Active `src/middleware.ts` + CSP |
| **Client ➔ Server Actions** | Zod Schema Validation & Auth Checks | Missing (No APIs) | Zod Schemas on every route |
| **Server ➔ Database** | Parameterized Queries & ORM | Missing (localStorage) | Prisma / Supabase with transactions |
| **Server ➔ Payment Gateway** | HMAC-SHA256 Webhook Verification | Missing (Simulated) | Razorpay/Stripe signed webhooks |
| **Admin ➔ Protected Data** | Server Session & RBAC Enforcement | Broken (localStorage) | HTTP-only session + Role check |
