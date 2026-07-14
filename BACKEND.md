# Kushwaha Store Backend

This is a starter backend for the current static frontend. It uses only Node.js built-in modules, serves the website, and stores data in `data/db.json` by default.

It can also use Supabase tables when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set. See `SUPABASE.md` and `supabase/schema.sql`.

## Run

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Check the active data driver:

```text
http://localhost:3000/api/health
```

It returns `driver: "local-json"` or `driver: "supabase"`.

## Main APIs

- `GET /api/health` - server status
- `GET /api/bootstrap` - store, settings, categories, products, orders, ledger, rewards, receipts, payments
- `POST /api/admin/login` - admin-only login; returns a short-lived admin token
- `POST /api/auth/signup` - create a customer account with phone/password
- `POST /api/auth/login` - login a customer and return their past orders
- `GET /api/customers/:id/orders` - customer order history
- `GET /api/customers/:id/statement?month=YYYY-MM` - customer monthly udhaar statement
- `GET /api/products` - catalog with optional `search`, `category`, and `stock`
- `POST /api/products` - add product
- `PATCH /api/products/:id` - update price, stock, category, etc.
- `DELETE /api/products/:id` - remove product
- `POST /api/orders` - place pickup order, decrement stock, add loyalty
- `GET /api/orders` - list orders
- `GET /api/orders/:id` - order detail with receipt
- `PATCH /api/orders/:id/status` - update order status and append timeline
- `GET /api/admin/orders` - admin order queue, optional `status`; admin token required
- `GET /api/admin/summary` - daily revenue, low stock, best seller, udhaar; admin token required
- `GET /api/payments/options` - UPI intent/QR data
- `GET /api/receipts/:idOrOrderId` - generated digital receipt
- `POST /api/payments` - admin records cash/UPI payment against an order
- `POST /api/payments/refunds` - admin records refund/cancel flow
- `GET /api/ledger` - udhaar accounts; admin token required
- `GET /api/ledger/monthly?customerId=...&month=YYYY-MM` - month-wise udhaar statement
- `POST /api/ledger` - add debit/credit adjustment
- `GET /api/rewards` - Community Rewards Club data
- `POST /api/rewards/draws` - create store-funded monthly reward draw
- `GET /api/blog` / `POST /api/blog` - placeholder blog CMS

## Catalog Note

The current products are seed data with estimated retail prices. Replace `data/db.json` prices and stock when the owner gives the real item list. Keep `data/seed.json` as the reset/default starter.

Loose products can set `"loose": true`. The frontend lets customers enter values such as 50 g, 200 g, or 1.5 kg/litre, and the backend stores that as a decimal quantity against the product unit.

## Admin Order Handling

The admin panel uses `POST /api/admin/login` first. Protected admin requests send:

```http
Authorization: Bearer <admin-token>
```

`GET /api/admin/orders` is the live order queue. Each order includes customer name, phone, items, totals, payment status, receipt id, and timeline.

The owner/family helper updates orders with:

```http
PATCH /api/orders/KS-1045/status
{ "status": "Being Packed", "note": "Shelf stock checked" }
```

Allowed statuses are `Placed`, `Being Packed`, `Ready`, `Completed`, and `Cancelled`. Every update appends a timeline entry. Marking an order `Completed` also updates payment/receipt state.

## Receipts, Payments, Udhaar

Every website order gets a receipt automatically. Fetch by receipt id or order id:

```text
GET /api/receipts/KS-1045
```

Payments can be recorded later:

```http
POST /api/payments
{ "orderId": "KS-1045", "method": "upi_on_pickup", "status": "paid", "amount": 235, "reference": "UPI123" }
```

For monthly udhaar customers, place orders with `"paymentMode": "udhaar"`. The backend adds a debit entry to the current month. Use the monthly statement endpoint to show customer dues and settlement history.

## Supabase Migration

The JSON collections now map to Supabase tables: `store_settings`, `categories`, `products`, `customers`, `orders`, `order_items`, `payments`, `receipts`, `ledger_accounts`, `ledger_entries`, `rewards_draws`, and `blog_posts`.

The frontend keeps using the same API routes. The backend decides whether to use local JSON or Supabase.
