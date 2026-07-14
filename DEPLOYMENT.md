# Kushwaha Store - Go Live Notes

## Fastest Launch Path

Deploy this project on Vercel and connect it to the existing Supabase project.

## Required Vercel Environment Variables

Set these in Vercel Project Settings > Environment Variables:

- `DATA_DRIVER` = `auto`
- `AUTH_PROVIDER` = `local`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CACHE_MS` = `4000`
- `ADMIN_PHONE` = `9136278478`
- `ADMIN_PASSWORD` = `1234`
- `ADMIN_ROLE` = `owner`
- `ADMIN_SESSION_SECRET` = a long random secret
- `UPI_NAME` = `Kushwaha Store`
- `MIN_ORDER_VALUE` = `29`

Optional:

- `SUPABASE_ANON_KEY`
- `UPI_VPA`

Keep `AUTH_PROVIDER=local` for this launch. Customer accounts will use simple phone + password login through the website database. Only change it to `supabase` later if Supabase phone auth/OTP is fully enabled in the Supabase dashboard.

If `UPI_VPA` is not set, the site still shows the saved QR/payment panel flow, but UPI intent links may be limited.

## After Deployment

Test these on the live URL:

1. `/api/health` returns Kushwaha Store status.
2. Customer can create account and log in.
3. Customer can add products to cart and place a pickup order.
4. Admin can log in at `/admin`.
5. Admin can add a product in Catalog Manager.
6. Admin can update product price and stock.
7. Admin can see incoming orders and mark them Ready/Completed.
8. WhatsApp order message includes customer name, phone, items and total.
9. Cart shows UPI QR/payment section.

## Launch Scope

Launch with pickup orders, WhatsApp orders, UPI/pay-at-pickup, admin catalog management, order tracking, receipts, udhaar, reviews, gallery, policies and blog.

Full catalog, perfect product images, image upload, and CSV import can continue after launch from the admin side.
