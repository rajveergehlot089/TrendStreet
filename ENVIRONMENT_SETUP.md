# TREND STREET — Environment Setup & Secrets Management Guide

> **Document Version**: 1.0.0  
> **Status**: Official Developer & Infrastructure Onboarding Guide  

---

## 1. Quickstart Local Setup

### Prerequisites
* **Node.js**: v18.18.0 or v20.x (Recommended: Node 20 LTS)
* **npm**: v9 or v10
* **PostgreSQL**: v15 or v16 (Local instance or free Neon/Supabase cloud project)

### Step 1: Clone & Install Dependencies
```bash
git clone <repo-url> trend-street
cd trend-street
npm install
```

### Step 2: Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env.local
```
Edit `.env.local` and provide your database connection string and authentication secrets.

### Step 3: Run Database Migrations & Seeds
```bash
npx prisma generate
npx prisma db push
npm run seed  # Seeds initial 12 luxury menswear garments and default CMS settings
```

### Step 4: Run Health Checks
```bash
npm run typecheck  # Strict TypeScript verification
npm run lint       # ESLint & Next.js Core Web Vitals checks
npm run build      # Verify production build compilation
```

### Step 5: Start the Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the storefront.

---

## 2. Secrets Management & Operational Security Policy

1. **Zero Secret Check-in**:
   - `.env` and `.env.local` are explicitly included in `.gitignore`.
   - Never commit API keys, connection strings, or password hashes to Git.
   - Any secret accidentally committed must be treated as **immediately compromised** and rotated within 1 hour.
2. **Environment Isolation**:
   - `development`: Uses local or sandbox database, test payment keys (`rzp_test_...` / `sk_test_...`).
   - `staging`: Mirrors production database schema, uses sandbox payment keys with real webhook deliveries.
   - `production`: Live database with automated daily snapshots, live payment keys, strict CSP, and Sentry error monitoring.
3. **Frontend Exposure Barrier**:
   - Only variables explicitly prefixed with `NEXT_PUBLIC_` are accessible in browser client bundles.
   - Never prefix database connection strings, auth secrets, webhook secrets, or private API keys with `NEXT_PUBLIC_`.
