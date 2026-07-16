# Kushwaha Store

**Kinare Ka Kirana, Bachat Ka Thikana**

Kushwaha Store is a mobile-first e-commerce and store-management web app for a local Indian kirana shop in Chanakya Place, Delhi. It brings an offline neighborhood store online with catalog browsing, pickup orders, WhatsApp ordering, UPI/pay-at-pickup checkout, admin order handling, inventory updates, receipts, loyalty, reviews, gallery, and a digital udhaar ledger.

Live site:

```text
https://kushwaha-store.vercel.app
```

## Highlights

- Hinglish kirana catalog with local categories like Daal & Chawal, Masale, Doodh & Dairy, Saaf-Safai, Pooja Samagri, and more.
- Mobile-friendly shopping flow with category tiles, search, filters, cart, UPI QR, and pickup-ready messaging.
- Website checkout and WhatsApp checkout with customer name, phone, items, and total.
- Admin dashboard for owner/family to manage orders, stock, product prices, catalog entries, payments, and udhaar requests.
- Customer accounts with past orders, loyalty points, active order tracking, and udhaar status.
- Digital receipts and order timeline: Placed, Being Packed, Ready for Pickup, Completed.
- Udhaar/khata flow with owner approval, monthly statements, debit/credit entries, and month-end settlement.
- Store gallery, contact page with map, reviews, policies, FAQ, and founder/story blog.
- Supabase-backed data with local JSON fallback for development.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js HTTP server
- Database: Supabase Postgres via Supabase REST API
- Auth: Local phone/password accounts for customers, separate admin login
- Hosting: Vercel
- Payments: UPI QR/UPI intent and pay-at-pickup
- Styling: custom responsive CSS, no template UI framework

## Project Structure

```text
.
├── index.html
├── server.js
├── src/
│   ├── app.js
│   └── styles.css
├── assets/
├── api/
├── supabase/
│   ├── schema.sql
│   └── dmart_style_starter_catalog.sql
├── BACKEND.md
├── SUPABASE.md
└── DEPLOYMENT.md
```

## Local Setup

Install dependencies:

```bash
npm install
```

Start locally:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Check syntax:

```bash
npm run check
```

## Environment Variables

For Vercel or local Supabase mode:

```text
DATA_DRIVER=auto
AUTH_PROVIDER=local
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CACHE_MS=4000

ADMIN_PHONE=9136278478
ADMIN_PASSWORD=1234
ADMIN_ROLE=owner
ADMIN_SESSION_SECRET=change-this-long-random-secret

UPI_NAME=Kushwaha Store
UPI_VPA=optional-upi-id
MIN_ORDER_VALUE=29
```

Keep the Supabase service role key only on the backend/Vercel environment variables. Do not expose it in frontend JavaScript.

## Supabase Setup

Run the schema in Supabase SQL Editor:

```text
supabase/schema.sql
```

Optional starter catalog import:

```text
supabase/dmart_style_starter_catalog.sql
```

The starter catalog contains estimated prices/MRPs for launch testing. Final prices and stock should be verified and updated from the admin panel.

## Main API Endpoints

- `GET /api/health`
- `GET /api/bootstrap`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/admin/login`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/admin/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/receipts/:idOrOrderId`
- `GET /api/ledger`
- `POST /api/ledger`
- `GET /api/rewards`

More backend details are in `BACKEND.md`.

## Admin Flow

1. Open `/admin`.
2. Log in with the configured admin phone and password.
3. View incoming orders.
4. Mark orders as Being Packed, Ready, Completed, or Cancelled.
5. Add/update products, prices, stock, category, and image URL.
6. Review udhaar applications and customer monthly statements.

## Customer Flow

1. Browse categories in Dukaan.
2. Add products to cart.
3. Log in or create an account.
4. Choose Pay at pickup, UPI now, or Add to khaata if approved.
5. Track order status inside the account.
6. View receipts, past orders, loyalty points, and udhaar statement.

## Deployment

Deploy on Vercel with framework preset **Other**.

Recommended settings:

- Build command: `npm run vercel-build` or `npm run build`
- Output directory: `public` if it exists, otherwise `.`
- Install command: `npm install`
- Node.js version: `22.x`

After deploy, test:

- Live homepage
- `/api/health`
- Customer login
- Website order
- Admin order view
- Product add/update
- UPI QR

See `DEPLOYMENT.md` for the launch checklist.

## Notes

This is designed for a real local kirana store, so the fulfillment model is pickup-first. Home delivery, Razorpay, CSV imports, and full image upload workflows can be added later as the store grows.

