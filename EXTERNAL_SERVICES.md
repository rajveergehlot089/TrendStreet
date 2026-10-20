# TREND STREET — External Services & Cloud Infrastructure Evaluation

> **Document Version**: 1.0.0  
> **Evaluation Period**: October 2026  
> **Scope**: Target Production Infrastructure, Third-Party Providers, Pricing, and Security Analysis  

---

## 1. Candidate Comparison Matrix

| Domain | Recommended Provider | Alternative | Key Decision Factor |
|:---|:---|:---|:---|
| **Database** | **Supabase / Neon (Serverless PostgreSQL)** | Self-hosted AWS RDS | Zero maintenance, connection pooling (PgBouncer), automatic SSL, instant branching. |
| **Authentication** | **NextAuth.js (Auth.js v5)** | Supabase Auth / Clerk | Zero vendor lock-in, native Next.js 14 App Router support, self-hosted session tokens in HTTP-only cookies. |
| **Payments (India)** | **Razorpay** | Cashfree | Ubiquitous UPI / QR support, Cards, Netbanking, instant settlement, well-documented webhook HMAC verification. |
| **Payments (Global)** | **Stripe Elements** | Lemon Squeezy | Industry gold-standard multi-currency checkout, fraud detection (Stripe Radar), Apple Pay / Google Pay. |
| **Image Storage** | **Cloudflare R2** | AWS S3 / UploadThing | Zero egress bandwidth fees, S3-compatible API, global CDN integration with Cloudflare Workers. |
| **Transactional Email**| **Resend** | SendGrid | Developer-first React Email templates, 3,000 free emails/mo, high deliverability via AWS SES backbone. |
| **Domestic Shipping** | **Shiprocket API** | Delhivery Direct | Automated AWB generation, multi-courier aggregation (Bluedart, Delhivery, Shadowfax), pincode serviceability check. |
| **Observability** | **Sentry** | Datadog | Automatic Next.js error boundary instrumentation, performance tracing, release tracking, PII data scrubbing. |

---

## 2. In-Depth Service Evaluation

### 2.1 Database: Neon / Supabase (Serverless PostgreSQL)
1. **Problem Solved**: Provides persistent, transactional, ACID-compliant relational data storage for products, orders, customers, and CMS settings, replacing browser `localStorage`.
2. **Necessity**: **Mandatory (Release Blocker)**. E-commerce cannot operate on browser storage.
3. **Official Documentation**: [https://neon.tech/docs](https://neon.tech/docs) | [https://supabase.com/docs](https://supabase.com/docs)
4. **Pricing & Free Tier**:
   - *Neon*: Free tier includes 0.5 GiB storage, auto-suspend compute, 1 project. Pro is $19/month.
   - *Supabase*: Free tier includes 500 MB database, 50,000 monthly active users, 2 projects. Pro is $25/month.
5. **Required Environment Variables**:
   - `DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"`
   - `DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"` (for migrations)
6. **Security Implications**: All connections must enforce `sslmode=require`. Connection pooling prevents serverless function connection starvation.
7. **Selection Rationale**: Neon / Supabase offers instant provisioning, serverless connection pooling suited for Next.js App Router, and standard PostgreSQL compatibility.

---

### 2.2 Authentication: NextAuth.js (Auth.js v5)
1. **Problem Solved**: Eliminates client-side hardcoded credentials and `localStorage` auth; issues encrypted, HTTP-only session cookies with server-side signature verification.
2. **Necessity**: **Mandatory (Release Blocker)**. Prevents total administrative compromise.
3. **Official Documentation**: [https://authjs.dev](https://authjs.dev)
4. **Pricing**: 100% Open Source (Self-hosted, zero monthly subscription costs).
5. **Required Environment Variables**:
   - `AUTH_SECRET="generated_64_char_hex_secret"`
   - `ADMIN_EMAIL="sujal@trendstreet.com"`
   - `ADMIN_PASSWORD_HASH="$argon2id$v=19$m=65536,t=3,p=4$..."`
6. **Security Implications**: Uses standard AES-256-GCM JWE session tokens in `__Secure-authjs.session-token` cookies. Protects against CSRF via double-submit cookie tokens.
7. **Selection Rationale**: Keeps authentication data under complete project control without external dependency on a third-party auth cloud.

---

### 2.3 Payments: Razorpay (India) & Stripe (Global)
1. **Problem Solved**: Replaces simulated 1.5s `setTimeout` checkout with authoritative fiat payment capture.
2. **Necessity**: **Mandatory (Release Blocker)**. Store cannot collect real revenue without a payment gateway.
3. **Official Documentation**:
   - Razorpay: [https://razorpay.com/docs/api](https://razorpay.com/docs/api)
   - Stripe: [https://stripe.com/docs/payments](https://stripe.com/docs/payments)
4. **Pricing**:
   - *Razorpay*: Standard 2% fee per transaction (Domestic Cards, Netbanking, UPI).
   - *Stripe*: 2.9% + $0.30 per successful card charge.
5. **Required Environment Variables**:
   - `RAZORPAY_KEY_ID="rzp_test_..."`
   - `RAZORPAY_KEY_SECRET="..."`
   - `RAZORPAY_WEBHOOK_SECRET="..."`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."`
   - `STRIPE_SECRET_KEY="sk_test_..."`
   - `STRIPE_WEBHOOK_SECRET="whsec_..."`
6. **Security Implications**:
   - Never accept client-side payment success tokens without server-side webhook signature verification (`crypto.createHmac("sha256", secret)`).
   - Never store credit card numbers, CVVs, or bank credentials on Trend Street servers (PCI-DSS SAQ-A compliant).
7. **Selection Rationale**: Razorpay is the dominant payment infrastructure for India with native UPI intent flow; Stripe handles cross-border international cards with high conversion.

---

### 2.4 Media Storage: Cloudflare R2
1. **Problem Solved**: Stores high-resolution garment imagery, lookbook photography, and customer review photos outside the Next.js deployment bundle.
2. **Necessity**: Required for production image upload capabilities (admin product additions).
3. **Official Documentation**: [https://developers.cloudflare.com/r2](https://developers.cloudflare.com/r2)
4. **Pricing**: Free tier includes 10 GB storage, 1M Class A operations/month, 10M Class B operations/month. **Zero egress fees**.
5. **Required Environment Variables**:
   - `R2_ACCOUNT_ID="..."`
   - `R2_ACCESS_KEY_ID="..."`
   - `R2_SECRET_ACCESS_KEY="..."`
   - `R2_BUCKET_NAME="trend-street-assets"`
   - `NEXT_PUBLIC_CDN_URL="https://assets.trendstreet.com"`
6. **Security Implications**: Enforce presigned upload URLs with short TTLs (60 seconds), file-size limits (max 5MB), and MIME-type verification (image/webp, image/jpeg, image/png).

---

### 2.5 Transactional Email: Resend
1. **Problem Solved**: Dispatches order confirmation receipts, shipping tracking updates, and password resets.
2. **Necessity**: Required for e-commerce post-purchase communication.
3. **Official Documentation**: [https://resend.com/docs](https://resend.com/docs)
4. **Pricing**: Free tier: 3,000 emails/month (100 emails/day). Pro: $20/month for 50,000 emails.
5. **Required Environment Variables**:
   - `RESEND_API_KEY="re_..."`
   - `EMAIL_FROM="Trend Street <orders@trendstreet.com>"`
6. **Security Implications**: Configure DKIM, SPF, and DMARC on the sending domain to prevent spoofing and ensure inbox delivery.

---

### 2.6 Application Monitoring & Error Tracking: Sentry
1. **Problem Solved**: Automatically catches unhandled runtime exceptions, hydration mismatches, and WebGL context losses in real time.
2. **Necessity**: Recommended for pre-launch monitoring and post-launch stability.
3. **Official Documentation**: [https://docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs)
4. **Pricing**: Free tier includes 5,000 errors/month, 10,000 performance units.
5. **Required Environment Variables**:
   - `NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."`
   - `SENTRY_AUTH_TOKEN="..."`
6. **Security Implications**: Redact PII (passwords, auth cookies, customer emails, card tokens) before sending error breadcrumbs.
