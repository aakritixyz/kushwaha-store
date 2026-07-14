create table if not exists store_settings (
  id text primary key default 'main',
  store jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  rewards jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists products (
  id text primary key,
  name text not null,
  category_id text references categories(id) on delete set null,
  unit text not null,
  price numeric(12, 2) not null default 0,
  mrp numeric(12, 2) not null default 0,
  stock numeric(12, 4) not null default 0,
  low_stock_at numeric(12, 4) not null default 0,
  mark text,
  loose boolean not null default false,
  image_url text,
  source_note text,
  updated_at timestamptz not null default now()
);

alter table products add column if not exists mrp numeric(12, 2) not null default 0;

create table if not exists customers (
  id text primary key,
  name text not null,
  phone text not null unique,
  loyalty_points numeric(12, 2) not null default 0,
  monthly_spend numeric(12, 2) not null default 0,
  password_salt text,
  password_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  name text not null,
  phone text,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  payable numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  loyalty_earned numeric(12, 2) not null default 0,
  payment_mode text not null default 'pay_at_store',
  payment_status text not null default 'due_on_pickup',
  fulfillment text not null default 'pickup',
  status text not null default 'Placed',
  receipt_id text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  qty numeric(12, 4) not null default 0,
  price numeric(12, 2) not null default 0
);

create table if not exists receipts (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  name text not null,
  phone text,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  payment_mode text not null default 'pay_at_store',
  payment_status text not null default 'due_on_pickup',
  gst_enabled boolean not null default false,
  share_text text,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  order_id text references orders(id) on delete set null,
  customer_id text references customers(id) on delete set null,
  method text not null,
  status text not null default 'paid',
  amount numeric(12, 2) not null default 0,
  reference text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists ledger_accounts (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  phone text,
  name text not null,
  balance numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists ledger_entries (
  id text primary key,
  ledger_account_id text not null references ledger_accounts(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  type text not null check (type in ('debit', 'credit')),
  amount numeric(12, 2) not null default 0,
  note text,
  order_id text references orders(id) on delete set null,
  month text not null,
  created_at timestamptz not null default now()
);

create table if not exists rewards_draws (
  id text primary key,
  month text not null,
  status text not null default 'scheduled',
  winner_customer_id text references customers(id) on delete set null,
  reward text not null,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id text primary key,
  customer_id text references customers(id) on delete set null,
  name text not null,
  phone text,
  rating integer not null default 5 check (rating between 1 and 5),
  text text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_orders_customer_id on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_ledger_entries_account_month on ledger_entries(ledger_account_id, month);
create index if not exists idx_reviews_created_at on reviews(created_at desc);
