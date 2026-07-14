# Supabase Setup

This project now supports two storage modes:

- Local JSON fallback: `data/db.json`
- Supabase tables: enabled when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present

## 1. Create Project

Create a free Supabase project, then open the SQL editor.

## 2. Run Schema

Copy and run:

```text
supabase/schema.sql
```

This creates tables for store settings, categories, products, customers, orders, order items, receipts, payments, udhaar ledger, rewards, and blog posts.

## 3. Add Environment

Create `.env` locally using `.env.example`:

```bash
DATA_DRIVER=auto
AUTH_PROVIDER=local
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CACHE_MS=4000

ADMIN_PHONE=9136278478
ADMIN_PASSWORD=1234
ADMIN_ROLE=owner
ADMIN_SESSION_SECRET=change-this-long-random-secret

UPI_VPA=kushwahastore@upi
UPI_NAME=Kushwaha Store
```

Important: keep the service role key only on the backend/server. Do not expose it in frontend JavaScript.

Supabase may show either an older JWT-style service role key or a newer secret key. This backend accepts both. If the key starts with `sb_secret_`, it is sent as the `apikey` header only. If it is a three-part JWT, it is also sent as `Authorization: Bearer ...`.

`SUPABASE_CACHE_MS` keeps a short server-side snapshot to avoid refetching every table on repeated page/admin requests. `4000` is a good prototype value; lower it if you need faster cross-device freshness.

Admin credentials are separate from customer login. Keep `AUTH_PROVIDER=local` unless you intentionally enable Supabase phone auth/OTP. Payments currently support pay-at-pickup and UPI intent/QR flow.

## 4. Seed Data

For now, start the backend once after adding Supabase keys:

```bash
npm start
```

On first read, if Supabase tables are empty, the backend falls back to the seed catalog/settings and writes migrated data as orders/customers are changed.

## 5. Keep Existing Frontend

The frontend does not need to change. It still calls the same endpoints:

- `/api/bootstrap`
- `/api/auth/signup`
- `/api/auth/login`
- `/api/orders`
- `/api/admin/orders`
- `/api/payments`
- `/api/ledger`

The server decides whether those endpoints use JSON or Supabase.
