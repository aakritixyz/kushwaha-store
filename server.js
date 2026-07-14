import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import http from "node:http";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function loadEnvFile() {
  try {
    const env = readFileSync(join(__dirname, ".env"), "utf8");
    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!match || process.env[match[1]] !== undefined) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // .env is optional; local JSON mode works without it.
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = join(__dirname, "data");
const DB_PATH = join(DATA_DIR, "db.json");
const SEED_PATH = join(DATA_DIR, "seed.json");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const DATA_DRIVER = process.env.DATA_DRIVER || "auto";
const AUTH_PROVIDER = process.env.AUTH_PROVIDER || "local";
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && DATA_DRIVER !== "local");
const SUPABASE_AUTH_ENABLED = Boolean(AUTH_PROVIDER === "supabase" && SUPABASE_URL && SUPABASE_ANON_KEY && DATA_DRIVER !== "local");
const SUPABASE_CACHE_MS = Number(process.env.SUPABASE_CACHE_MS || 4000);
const ADMIN_PHONE = String(process.env.ADMIN_PHONE || "9136278478").replace(/\D/g, "");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
const ADMIN_PASSWORD_FALLBACK = "1234";
const ADMIN_ROLE = process.env.ADMIN_ROLE || "owner";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || SUPABASE_SERVICE_ROLE_KEY || crypto.randomBytes(32).toString("hex");
const UPI_VPA = process.env.UPI_VPA || "";
const UPI_NAME = process.env.UPI_NAME || "Kushwaha Store";
const MIN_ORDER_VALUE = Number(process.env.MIN_ORDER_VALUE || 29);
let supabaseDbCache = null;
let supabaseDbCacheAt = 0;
let supabaseDbReadPromise = null;

// Initialize Supabase clients
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const supabaseAuth = SUPABASE_AUTH_ENABLED
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

async function ensureDb() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await stat(DB_PATH);
  } catch {
    const seed = await readFile(SEED_PATH, "utf8");
    await writeFile(DB_PATH, seed);
  }
}

async function readDb() {
  if (SUPABASE_ENABLED) return readSupabaseDb();
  await ensureDb();
  const db = JSON.parse(await readFile(DB_PATH, "utf8"));
  if (migrateDb(db)) await writeDb(db);
  return db;
}

async function writeDb(db) {
  if (SUPABASE_ENABLED) return writeSupabaseDb(db);
  await writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`);
}

async function readSeedDb() {
  try {
    return JSON.parse(await readFile(SEED_PATH, "utf8"));
  } catch {
    try {
      return JSON.parse(await readFile(DB_PATH, "utf8"));
    } catch {
      return {
        store: {},
        settings: {},
        categories: [],
        products: [],
        customers: [],
        orders: [],
        ledger: [],
        rewards: { clubName: "Community Rewards Club", draws: [], applications: [] },
        blogPosts: [],
        reviews: [],
        receipts: [],
        payments: []
      };
    }
  }
}

function supabaseUrl(table, query = "") {
  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

function supabaseHeaders(prefer) {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
    Prefer: prefer
  };
  if (SUPABASE_SERVICE_ROLE_KEY.split(".").length === 3) {
    headers.Authorization = `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`;
  }
  return headers;
}

async function supabaseRequest(table, { method = "GET", query = "", body, prefer = "return=representation" } = {}) {
  const response = await fetch(supabaseUrl(table, query), {
    method,
    headers: supabaseHeaders(prefer),
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text();
    if (text.includes("PGRST303") || text.includes("JWT issued at future")) {
      throw new Error(`Supabase ${table} ${method} failed: Supabase rejected SUPABASE_SERVICE_ROLE_KEY because the JWT/API key timestamp is invalid. In Vercel, replace SUPABASE_SERVICE_ROLE_KEY with the current Secret key from Supabase Settings > API Keys > Secret keys > default, then redeploy.`);
    }
    throw new Error(`Supabase ${table} ${method} failed: ${response.status} ${text}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function selectAll(table, order = "id.asc") {
  const orderQuery = order ? `&order=${encodeURIComponent(order)}` : "";
  return supabaseRequest(table, { query: `?select=*${orderQuery}` });
}

async function selectOptional(table, order = "id.asc") {
  try {
    return await selectAll(table, order);
  } catch {
    return [];
  }
}

async function upsertRows(table, rows) {
  if (rows.length) {
    await supabaseRequest(table, { method: "POST", query: "?on_conflict=id", body: rows, prefer: "resolution=merge-duplicates,return=minimal" });
  }
}

async function upsertOptionalRows(table, rows) {
  try {
    await upsertRows(table, rows);
  } catch {
    // Optional Supabase tables can be added later without breaking local work.
  }
}

async function upsertProductRows(rows) {
  try {
    await upsertRows("products", rows);
  } catch (error) {
    if (!String(error.message || "").toLowerCase().includes("mrp")) throw error;
    const fallbackRows = rows.map(({ mrp: _mrp, ...row }) => row);
    await upsertRows("products", fallbackRows);
  }
}

async function readSupabaseDb() {
  if (supabaseDbCache && Date.now() - supabaseDbCacheAt < SUPABASE_CACHE_MS) {
    return structuredClone(supabaseDbCache);
  }
  if (supabaseDbReadPromise) {
    return structuredClone(await supabaseDbReadPromise);
  }
  supabaseDbReadPromise = loadSupabaseDb();
  try {
    const db = await supabaseDbReadPromise;
    supabaseDbCache = structuredClone(db);
    supabaseDbCacheAt = Date.now();
    return structuredClone(db);
  } finally {
    supabaseDbReadPromise = null;
  }
}

async function loadSupabaseDb() {
  const seed = await readSeedDb();
  const [
    settingsRows,
    categoryRows,
    productRows,
    customerRows,
    orderRows,
    orderItemRows,
    receiptRows,
    paymentRows,
    ledgerRows,
    ledgerEntryRows,
    rewardRows,
    blogRows,
    reviewRows
  ] = await Promise.all([
    selectAll("store_settings"),
    selectAll("categories", "sort_order.asc"),
    selectAll("products", "name.asc"),
    selectAll("customers", "name.asc"),
    selectAll("orders", "created_at.desc"),
    selectAll("order_items", "id.asc"),
    selectAll("receipts", "created_at.desc"),
    selectAll("payments", "created_at.desc"),
    selectAll("ledger_accounts", "name.asc"),
    selectAll("ledger_entries", "created_at.desc"),
    selectAll("rewards_draws", "month.desc"),
    selectAll("blog_posts", "created_at.desc"),
    selectOptional("reviews", "created_at.desc")
  ]);

  if (!settingsRows.length && !categoryRows.length && !productRows.length && !customerRows.length && !orderRows.length) {
    const seeded = structuredClone(seed);
    migrateDb(seeded);
    await writeSupabaseDb(seeded);
    return seeded;
  }

  const seedProductById = new Map((seed.products || []).map((product) => [product.id, product]));
  const mainSettings = settingsRows[0] || {};
  const db = {
    store: mainSettings.store || seed.store,
    settings: { ...(seed.settings || {}), ...(mainSettings.settings || {}) },
    categories: categoryRows.map((row) => ({
      id: row.id,
      name: row.name,
      sort: row.sort_order
    })),
    products: productRows.map((row) => ({
      id: row.id,
      name: row.name,
      categoryId: row.category_id || seedProductById.get(row.id)?.categoryId || null,
      unit: row.unit,
      price: Number(row.price || 0),
      mrp: Number(row.mrp || seedProductById.get(row.id)?.mrp || 0),
      stock: Number(row.stock || 0),
      lowStockAt: Number(row.low_stock_at || 0),
      mark: row.mark,
      loose: Boolean(row.loose),
      imageUrl: row.image_url || undefined,
      sourceNote: row.source_note || undefined
    })),
    customers: customerRows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      loyaltyPoints: Number(row.loyalty_points || 0),
      monthlySpend: Number(row.monthly_spend || 0),
      passwordSalt: row.password_salt || undefined,
      passwordHash: row.password_hash || undefined
    })),
    orders: orderRows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      name: row.name,
      phone: row.phone,
      subtotal: Number(row.subtotal || 0),
      discount: Number(row.discount || 0),
      payable: Number(row.payable || row.total || 0),
      total: Number(row.total || row.payable || 0),
      loyaltyEarned: Number(row.loyalty_earned || 0),
      paymentMode: row.payment_mode,
      paymentStatus: row.payment_status,
      fulfillment: row.fulfillment,
      status: row.status,
      receiptId: row.receipt_id,
      timeline: row.timeline || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      items: orderItemRows
        .filter((item) => item.order_id === row.id)
        .map((item) => ({
          id: item.id,
          productId: item.product_id,
          qty: Number(item.qty || 0),
          price: Number(item.price || 0)
        }))
    })),
    receipts: receiptRows.map((row) => ({
      id: row.id,
      orderId: row.order_id,
      customerId: row.customer_id,
      name: row.name,
      phone: row.phone,
      subtotal: Number(row.subtotal || 0),
      discount: Number(row.discount || 0),
      total: Number(row.total || 0),
      paymentMode: row.payment_mode,
      paymentStatus: row.payment_status,
      gstEnabled: Boolean(row.gst_enabled),
      shareText: row.share_text,
      createdAt: row.created_at
    })),
    payments: paymentRows.map((row) => ({
      id: row.id,
      orderId: row.order_id,
      customerId: row.customer_id,
      method: row.method,
      status: row.status,
      amount: Number(row.amount || 0),
      reference: row.reference,
      note: row.note,
      createdAt: row.created_at
    })),
    ledger: ledgerRows.map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      phone: row.phone,
      name: row.name,
      balance: Number(row.balance || 0),
      entries: ledgerEntryRows
        .filter((entry) => entry.ledger_account_id === row.id)
        .map((entry) => ({
          id: entry.id,
          type: entry.type,
          amount: Number(entry.amount || 0),
          note: entry.note,
          orderId: entry.order_id,
          month: entry.month,
          createdAt: entry.created_at
        }))
    })),
    rewards: {
      clubName: mainSettings.rewards?.clubName || seed.rewards?.clubName || "Community Rewards Club",
      positioning: mainSettings.rewards?.positioning || seed.rewards?.positioning || "",
      applications: mainSettings.rewards?.applications || seed.rewards?.applications || [],
      draws: rewardRows.map((row) => ({
        id: row.id,
        month: row.month,
        status: row.status,
        winnerCustomerId: row.winner_customer_id,
        reward: row.reward,
        createdAt: row.created_at
      }))
    },
    blogPosts: blogRows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      body: row.body,
      published: Boolean(row.published),
      createdAt: row.created_at
    })),
    reviews: reviewRows.length ? reviewRows.map((row) => ({
      id: row.id,
      customerId: row.customer_id || undefined,
      name: row.name,
      phone: row.phone || "",
      rating: Number(row.rating || 5),
      text: row.text,
      published: Boolean(row.published),
      createdAt: row.created_at
    })) : (seed.reviews || [])
  };
  let needsBackfill = false;
  if (!db.categories.length) {
    db.categories = seed.categories || [];
    needsBackfill = true;
  }
  if (!db.products.length) {
    db.products = seed.products || [];
    needsBackfill = true;
  }
  for (const product of db.products) {
    if (!product.categoryId && seedProductById.has(product.id)) {
      product.categoryId = seedProductById.get(product.id).categoryId;
      needsBackfill = true;
    }
  }
  for (const seedCategory of seed.categories || []) {
    const current = db.categories.find((category) => category.id === seedCategory.id);
    if (!current) {
      db.categories.push(seedCategory);
      needsBackfill = true;
      continue;
    }
    const nextCategory = { ...current, name: seedCategory.name, sort: seedCategory.sort };
    if (["cat-atta-maida-sooji-besan", "cat-atta-daal-chawal", "cat-cheeni-bura-khand", "cat-basics", "cat-chai-patti", "cat-cold-drinks"].includes(seedCategory.id) && JSON.stringify(current) !== JSON.stringify(nextCategory)) {
      Object.assign(current, nextCategory);
      needsBackfill = true;
    }
  }
  const obsoleteProductIds = new Set([
    "prod-thums-up",
    "prod-pan-daliya-500g",
    "prod-water-1l",
    "prod-surf-1kg",
    "prod-comfort-fabric-conditioner-pouch",
    "prod-comfort-fabric-conditioner-500ml"
  ]);
  if (db.products.some((product) => obsoleteProductIds.has(product.id))) {
    db.products = db.products.filter((product) => !obsoleteProductIds.has(product.id));
    needsBackfill = true;
  }
  for (const seedProduct of seed.products || []) {
    if (!String(seedProduct.catalogBatch || "").startsWith("owner-")) continue;
    const current = db.products.find((product) => product.id === seedProduct.id);
    const { catalogBatch: _catalogBatch, ...catalogProduct } = seedProduct;
    if (!current) {
      db.products.push(catalogProduct);
      needsBackfill = true;
      continue;
    }
    const nextProduct = {
      ...current,
      ...catalogProduct,
      stock: current.stock ?? seedProduct.stock
    };
    if (JSON.stringify(current) !== JSON.stringify(nextProduct)) {
      Object.assign(current, nextProduct);
      needsBackfill = true;
    }
  }
  if (migrateDb(db) || needsBackfill) await writeSupabaseDb(db);
  return db;
}

async function writeSupabaseDb(db) {
  const writeTime = nowIso();
  await supabaseRequest("store_settings", {
    method: "POST",
    query: "?on_conflict=id",
    body: [{
      id: "main",
      store: db.store,
      settings: db.settings,
      rewards: {
        clubName: db.rewards?.clubName,
        positioning: db.rewards?.positioning,
        applications: db.rewards?.applications || []
      },
      updated_at: writeTime
    }],
    prefer: "resolution=merge-duplicates,return=minimal"
  });

  await upsertRows("categories", db.categories.map((category) => ({
    id: category.id,
    name: category.name,
    sort_order: Number(category.sort || 0)
  })));
  await upsertRows("customers", db.customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    loyalty_points: Number(customer.loyaltyPoints || 0),
    monthly_spend: Number(customer.monthlySpend || 0),
    password_salt: customer.passwordSalt || null,
    password_hash: customer.passwordHash || null,
    updated_at: writeTime
  })));

  await Promise.all([
    upsertProductRows(db.products.map((product) => ({
      id: product.id,
      name: product.name,
      category_id: product.categoryId,
      unit: product.unit,
      price: Number(product.price || 0),
      mrp: Number(product.mrp || 0),
      stock: Number(product.stock || 0),
      low_stock_at: Number(product.lowStockAt || 0),
      mark: product.mark || null,
      loose: Boolean(product.loose),
      image_url: product.imageUrl || null,
      source_note: product.sourceNote || null,
      updated_at: writeTime
    }))),
    upsertRows("ledger_accounts", (db.ledger || []).map((account) => ({
      id: account.id,
      customer_id: account.customerId || null,
      phone: account.phone || "",
      name: account.name,
      balance: Number(account.balance || 0),
      updated_at: writeTime
    }))),
    upsertRows("rewards_draws", (db.rewards?.draws || []).map((draw) => ({
      id: draw.id,
      month: draw.month,
      status: draw.status,
      winner_customer_id: draw.winnerCustomerId || null,
      reward: draw.reward,
      created_at: draw.createdAt || writeTime
    }))),
    upsertRows("blog_posts", (db.blogPosts || []).map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      body: post.body || "",
      published: Boolean(post.published),
      created_at: post.createdAt || writeTime
    }))),
    upsertOptionalRows("reviews", (db.reviews || []).map((review) => ({
      id: review.id,
      customer_id: review.customerId || null,
      name: review.name,
      phone: review.phone || "",
      rating: Number(review.rating || 5),
      text: review.text || "",
      published: review.published !== false,
      created_at: review.createdAt || writeTime
    })))
  ]);

  await upsertRows("orders", db.orders.map((order) => ({
    id: order.id,
    customer_id: order.customerId,
    name: order.name,
    phone: order.phone,
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    payable: Number(order.payable || order.total || 0),
    total: Number(order.total || order.payable || order.subtotal || 0),
    loyalty_earned: Number(order.loyaltyEarned || 0),
    payment_mode: order.paymentMode || "pay_at_store",
    payment_status: order.paymentStatus || "due_on_pickup",
    fulfillment: order.fulfillment || "pickup",
    status: order.status || "Placed",
    receipt_id: order.receiptId || null,
    timeline: order.timeline || [],
    created_at: order.createdAt || writeTime,
    updated_at: order.updatedAt || writeTime
  })));

  await Promise.all([
    upsertRows("order_items", db.orders.flatMap((order) => (order.items || []).map((item, index) => ({
      id: item.id || `${order.id}-${index + 1}`,
      order_id: order.id,
      product_id: item.productId,
      qty: Number(item.qty || 0),
      price: Number(item.price || 0)
    })))),
    upsertRows("receipts", (db.receipts || []).map((receipt) => ({
      id: receipt.id,
      order_id: receipt.orderId,
      customer_id: receipt.customerId,
      name: receipt.name,
      phone: receipt.phone,
      subtotal: Number(receipt.subtotal || 0),
      discount: Number(receipt.discount || 0),
      total: Number(receipt.total || 0),
      payment_mode: receipt.paymentMode || "pay_at_store",
      payment_status: receipt.paymentStatus || "due_on_pickup",
      gst_enabled: Boolean(receipt.gstEnabled),
      share_text: receipt.shareText || null,
      created_at: receipt.createdAt || writeTime
    }))),
    upsertRows("payments", (db.payments || []).map((payment) => ({
      id: payment.id,
      order_id: payment.orderId,
      customer_id: payment.customerId,
      method: payment.method,
      status: payment.status,
      amount: Number(payment.amount || 0),
      reference: payment.reference || null,
      note: payment.note || null,
      created_at: payment.createdAt || writeTime
    }))),
    upsertRows("ledger_entries", (db.ledger || []).flatMap((account) => (account.entries || []).map((entry) => ({
      id: entry.id,
      ledger_account_id: account.id,
      customer_id: account.customerId || null,
      type: entry.type,
      amount: Number(entry.amount || 0),
      note: entry.note || null,
      order_id: entry.orderId || null,
      month: entry.month || monthKey(entry.createdAt),
      created_at: entry.createdAt || writeTime
    }))))
  ]);

  supabaseDbCache = structuredClone(db);
  supabaseDbCacheAt = Date.now();
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

function badRequest(res, message, details = undefined) {
  sendJson(res, 400, { error: message, details });
}

function unauthorized(res, message = "Admin login required") {
  sendJson(res, 401, { error: message });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function slug(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function nowIso() {
  return new Date().toISOString();
}

function nextOrderId(db) {
  const numeric = db.orders
    .map((order) => Number(String(order.id).replace("KS-", "")))
    .filter(Number.isFinite);
  const next = Math.max(1044, ...numeric) + 1;
  return `KS-${next}`;
}

function nextReceiptId(db) {
  const numeric = (db.receipts || [])
    .map((receipt) => Number(String(receipt.id).replace("KSR-", "")))
    .filter(Number.isFinite);
  const next = Math.max(1000, ...numeric) + 1;
  return `KSR-${next}`;
}

function monthKey(input = nowIso()) {
  return String(input || nowIso()).slice(0, 7);
}

function migrateDb(db) {
  let changed = false;
  for (const key of ["customers", "orders", "ledger", "rewards", "blogPosts", "reviews", "categories", "products"]) {
    if (!db[key]) {
      db[key] = key === "rewards" ? { clubName: "Community Rewards Club", draws: [], applications: [] } : [];
      changed = true;
    }
  }
  if (!Array.isArray(db.rewards.applications)) {
    db.rewards.applications = [];
    changed = true;
  }
  if (!db.receipts) {
    db.receipts = [];
    changed = true;
  }
  if (!db.payments) {
    db.payments = [];
    changed = true;
  }
  if (!db.settings) {
    db.settings = {};
    changed = true;
  }
  db.settings = {
    gstEnabled: false,
    loyaltyEnabled: true,
    monthlyGiftEnabled: true,
    communityRewardsEnabled: true,
    monthlyGiftThreshold: 5000,
    loyaltyRate: 0.01,
    upiVpa: db.settings.upiVpa || UPI_VPA || "kushwahastore@upi",
    upiName: db.settings.upiName || UPI_NAME,
    ...db.settings
  };
  for (const order of db.orders) {
    if (order.total === undefined) {
      order.total = Number(order.payable || order.subtotal || 0);
      changed = true;
    }
    if (order.payable === undefined) {
      order.payable = Number(order.total || order.subtotal || 0);
      changed = true;
    }
    if (order.discount === undefined) {
      order.discount = 0;
      changed = true;
    }
    if (!order.paymentStatus) {
      order.paymentStatus = order.status === "Completed" ? "paid" : order.paymentMode === "udhaar" ? "monthly_due" : "due_on_pickup";
      changed = true;
    }
    if (!order.timeline) {
      order.timeline = [{ status: "Placed", at: order.createdAt || nowIso(), note: "Order placed" }];
      if (order.status && order.status !== "Placed") {
        order.timeline.push({ status: order.status, at: order.updatedAt || order.createdAt || nowIso(), note: `Marked ${order.status}` });
      }
      changed = true;
    }
    if (!order.receiptId) {
      const receipt = createReceipt(db, order);
      order.receiptId = receipt.id;
      changed = true;
    }
  }
  return changed;
}

function categoryName(db, categoryId) {
  return db.categories.find((category) => category.id === categoryId)?.name || "Other";
}

function productImageUrl(product) {
  const name = String(product.name || "").toLowerCase();
  const pinnedPhotos = [
    { test: /mortein/, url: "https://imgs.search.brave.com/_4NC4SDDIsFGIbgox4177-MGukHvV9WwDs15rw2JjXE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hbmRh/bWFuZ3JlZW5ncm9j/ZXJzLmNvbS93cC1j/b250ZW50L3VwbG9hZHMvMjAyMi8wMi9t/b3J0ZWluLXBvd2Vy/Ym9vc3Rlci1jb2ls/LThoci1tcnAyNy5q/cGc" },
    { test: /laxman rekha/, url: "https://imgs.search.brave.com/N9p_NtXB5xw3P6OCe0eggv_SumLGRg0CL1e9LlUgBD4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9ERC9VUS9CVy9TRUxMRVItMjQ5NDkz/OC9sYXhtYW4tcmVr/aGEtY2hhbGstMjUw/eDI1MC5qcGc" },
    { test: /hit red/, url: "https://imgs.search.brave.com/Zi81z_NG583UJ2p556nztcxldbmCCJ9q0GR_NHK-ZbE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9naGFy/c3R1ZmYuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIwLzA4/L0hpdC1SZWQtQ29j/a3JvYWNoLUtpbGxl/ci1TcHJheS00MDBt/bC5qcGc" },
    { test: /hit black/, url: "https://imgs.search.brave.com/NmKGfdWXLeQxSXKINEih7ntsTQJvDQcvM0DSzy-AkmQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVmYXVsdC8yMDIyLzUvS0QvUFcvTFQvMjU5MDY4MDMvMjAwbWwtYmxhY2staGl0LW1vc3F1aXRvLXNwcmF5LTEwMDB4MTAwMC5qcGc" },
    { test: /\bhit\b/, url: "https://imgs.search.brave.com/NmKGfdWXLeQxSXKINEih7ntsTQJvDQcvM0DSzy-AkmQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVmYXVsdC8yMDIyLzUvS0QvUFcvTFQvMjU5MDY4MDMvMjAwbWwtYmxhY2staGl0LW1vc3F1aXRvLXNwcmF5LTEwMDB4MTAwMC5qcGc" }
  ];
  const pinned = pinnedPhotos.find((photo) => photo.test.test(name));
  if (pinned) return pinned.url;
  if (product.imageUrl) return product.imageUrl;
  const category = String(product.category || product.categoryId || "").toLowerCase();
  const photos = [
    { test: /sattu/, url: "https://rajdhanifoods.com/cdn/shop/files/CHANA_SATTU_a405548f-8f02-4d4a-8ca0-548f08bec401.png?v=1763143994&width=800" },
    { test: /daliya|dalia|bulgur/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Bulgur.jpg" },
    { test: /ararot|arrowroot|starch/, url: "https://imgs.search.brave.com/MtMirTH7dpd4cjpA0VMi8oR-kAcbw3BWKgdZMXOggLI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmRp/YW5qYWRpYm9vdGku/Y29tL0phZGlzdG9y/ZS9pbWFnZS9jYWNoZS93cC9nai9JbWFnZXMtMTAwMHgxMDAwc2FjLUpQRy9pbmRpYW5qYWRpYm9vdGktYXJhcm90LXBvd2Rlci1hcnJvdy1yb290LXBvd2Rlci1hcmFyb2F0LXBvd2Rlci1jdXJjdW1hLWFuZ3VzdGlmb2xpYS1hNDYxNDAtNDAweDQwMC53ZWJw" },
    { test: /loose besan/, url: "https://imgs.search.brave.com/8SrVPQsYBdHi94iveKpOZ-NFueIwMRjIOe3eBfUICVU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVncmVjaXBlc29m/aW5kaWEuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDEzLzEw/L2Jlc2FuLWxhZG9v/MDMuanBn" },
    { test: /besan/, url: "https://rajdhanifoods.com/cdn/shop/files/Besan_200g_Front.jpg?v=1777717711&width=800" },
    { test: /pan brand sooji/, url: "https://imgs.search.brave.com/-CcA-WLZQKdzXTMcHn4XFeD2fW2LYgj5lYKDSodt6kg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFVSUV6QTdwQkwu/anBn" },
    { test: /sooji|suji|rava/, url: "https://cdn.grofers.com/cdn-cgi/image/f%3Dauto%2Cfit%3Dscale-down%2Cq%3D85%2Cmetadata%3Dnone%2Cw%3D480%2Ch%3D480/da/cms-assets/cms/product/rc-upload-1777379765857-35.jpg" },
    { test: /loose maida/, url: "https://imgs.search.brave.com/eDofo9huzuK_hVFLAvaTDu_sv3OevtFCbNxRczAorRc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/Y2xldnVwLmluLzMz/Mzc1MS8xNzA3MjEw/NzQ1ODkxXzQxNmZn/Q0NyYkNManBnLmpw/ZWc_d2lkdGg9NjAw/JmZvcm1hdD13ZWJw" },
    { test: /maida/, url: "https://cdn.grofers.com/cdn-cgi/image/f%3Dauto%2Cfit%3Dscale-down%2Cq%3D85%2Cmetadata%3Dnone%2Cw%3D480%2Ch%3D480/da/cms-assets/cms/product/rc-upload-1774944833006-807.jpg" },
    { test: /loose atta|flour/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Wheat_flour.jpg" },
    { test: /aashirvaad/, url: "https://imgs.search.brave.com/VsTCnW8EWK6EZRrkhdotYg9ZmneKzO4q1GICVO53Sx8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVmYXVsdC8yMDIxLzcvS0kvUFEvWE8vNTYxNDAwNjAvYWFzaGlydmFhZC1hdHRhLTUta2ctMjUweDI1MC5qcGc" },
    { test: /ashoka/, url: "https://imgs.search.brave.com/X9Lo2u0A3EyHq-taluCYQO_6EkxbXTIDNpNKoxNWwiU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmhhcmF0ZW1hcnQu/Y29tL21lZGlhL2Nh/dGFsb2cvcHJvZHVj/dC9nL28vZ29naWFh/dHRhNTBrZ18xLmpw/ZWc_cXVhbGl0eT04/MCZiZy1jb2xvcj0y/NTUsMjU1LDI1NSZm/aXQ9Ym91bmRzJmhl/aWdodD03MDAmd2lk/dGg9NzAwJmNhbnZh/cz03MDA6NzAw" },
    { test: /aashirvaad|ashoka|mp atta|atta/, url: "https://indiainsydney.com.au/cdn/shop/files/photo_2026-05-15_04-30-31.jpg?v=1778783482&width=900" },
    { test: /fortune|oil|tel|ghee/, url: "https://img.clevup.in/219726/276756_9-fortune-fortune-premium-kachi-ghani-pure-mustard-oil-1710666908257.webp?format=webp&width=900" },
    { test: /namak|salt/, url: "https://dukaan.b-cdn.net/700x700/webp/master/products/tata-salt-1kg.jpg" },
    { test: /frooti/, url: "/assets/frooti.png" },
    { test: /sting/, url: "https://imgs.search.brave.com/390otX3O5vpmFGAfgsSADQkOaaf2Z23B-Op6uyhyIQI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/dmlzaGFsbWVnYW1h/cnQuY29tL2R3L2lt/YWdlL3YyL0JHSFRf/UFJEL29uL2RlbWFu/ZHdhcmUuc3RhdGlj/Ly0vU2l0ZXMtdm1t/LWZtY2ctbWFzdGVy/LWNhdGFsb2cvZGVm/YXVsdC9kdzAxZTVk/OTM4L2ltYWdlcy9s/YXJnZS8xMzEwMDIw/MDgwLmpwZz9zdz05/MDAmc2g9OTAw" },
    { test: /hell/, url: "https://imgs.search.brave.com/dJpRO0eEp0T_A0wfrrmUipLlyKWAe8HEBbPS4kQiuAo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/MDQ0L2VuZXJneS1k/cmluay0yNTAtbWwt/cGFjay1vZi0yNC1o/ZWxsLS04ODUuanBn" },
    { test: /red bull/, url: "https://imgs.search.brave.com/bA3WlRpckEESuFGHT_YNjKhQ0jJE9d-6nLnUIiMSgno/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI2LzMv/NTkzNjk3NDczL1FP/L1BQL09VLzE1OTgy/NDkwOC9yZWQtYnVs/bC1lbmVyZ3ktZHJp/bmstNTAweDUwMC5w/bmc" },
    { test: /sting|hell|red bull/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Energy+Drink" },
    { test: /lahori/, url: "https://imgs.search.brave.com/ZRink-VD9wlw_YO0c42ddLdHy5zjl3iNOGYw46ntptg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTgwMC04/MDAscHItdHJ1ZSxm/LWF1dG8scS00MCxk/cHItMi9jbXMvcHJv/ZHVjdF92YXJpYW50/LzhkODk2NTU5LWQw/ODItNDFhNS1hZTcw/LWRhNGFjZTM3Mzc3/ZC9MYWhvcmktWmVl/cmEtTWFzYWxhLVNv/ZGEtQ2FyYm9uYXRl/ZC1CZXZlcmFnZS5q/cGVn" },
    { test: /arora lemon/, url: "https://imgs.search.brave.com/e7YVuS0XOTYtf6J-4XE38oS59eVhS2evoif4TDEUn80/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTExMjUt/MTEyMyxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvYjQ3MWRkMzEt/N2FkNi00OTg2LWEw/ZDMtZGYzYzk4Nzk2/OWVlL0Fyb3JhLUxl/bW9uLVNvZnQtRHJp/bmsuanBlZw" },
    { test: /nimbooz/, url: "https://imgs.search.brave.com/ausJUZEm-ROGIkyOiEPEDNb3LMGqGRvFzpQLb2K6WJ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3RhcnF1aWsuY29t/L2Nkbi9zaG9wL2Zp/bGVzL1NRMTA1MDE1/LmpwZz92PTE3NTA5/NDEyMTYmd2lkdGg9/MTQ0NQ" },
    { test: /lahori|nimbooz|arora lemon|soda/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Soda+Drink" },
    { test: /thums/, url: "https://www.bbassets.com/media/uploads/p/m/251014_12-thums-up-soft-drink.jpg?tr=w-154,q-80" },
    { test: /sprite/, url: "https://www.bbassets.com/media/uploads/p/m/251006_13-sprite-soft-drink-lime-flavoured.jpg?tr=w-154,q-80" },
    { test: /limca/, url: "https://www.bbassets.com/media/uploads/p/m/251012_10-limca-soft-drink-lime-lemon-flavoured.jpg?tr=w-154,q-80" },
    { test: /pepsi/, url: "https://www.bbassets.com/media/uploads/p/m/40094179_9-pepsi-soft-drink.jpg?tr=w-154,q-80" },
    { test: /mountain dew/, url: "https://www.bbassets.com/media/uploads/p/m/40352542_1-mountain-dew-soft-drink.jpg?tr=w-154,q-80" },
    { test: /fanta/, url: "https://www.bbassets.com/media/uploads/p/m/251019_8-fanta-soft-drink-orange-flavoured.jpg?tr=w-154,q-80" },
    { test: /mirinda/, url: "https://www.bbassets.com/media/uploads/p/m/40130831_5-mirinda-soft-drink-orange.jpg?tr=w-154,q-80" },
    { test: /avoca/, url: "https://imgs.search.brave.com/0U2_petdJknQNvCT0lzlq_KUasDzRXN8JqzxAdrpYAU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9YUS9aTi9GWC9T/RUxMRVItNzMzNTQy/OTgvYXZvY2EtZHJp/bmtpbmctd2F0ZXIt/Ym90dGxlLTUwMHg1/MDAuanBn" },
    { test: /bisleri|water/, url: "https://imgs.search.brave.com/w-nAT5mtH2W0-gjOT4F0qrM8vWbPD0Dg8MKSN47s_94/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly90aHVt/Ym5haWwuaW1nYmlu/LmNvbS8yMC8xNy8x/Ni9pbWdiaW4tZml6/enktZHJpbmtzLWNh/cmJvbmF0ZWQtd2F0/ZXItYmlzbGVyaS1t/aW5lcmFsLXdhdGVy/LW1pbmVyYWwtd2F0/ZXItNEMzemVmZ2o4/MkpCMVZIVWJtVVcz/dFo4Ul90LmpwZw" },
    { test: /coca/, url: "https://imgs.search.brave.com/cORDz8zmRJbz0IDpqhVks65BUTSzk3sNT0byPY9apMo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzgwMC8xMDcwL2tj/MHU3YmswL2FlcmF0/ZWQtZHJpbmsvbS94/L3cvNDAwLW5hLXBl/dC1ib3R0bGUtY29j/YS1jb2xhLW9yaWdp/bmFsLWltYWZ0OHE3/Y3pjdXhmYXQuanBl/Zz9xPTkw" },
    { test: /coca|limca|thums|sprite|fanta|pepsi|mirinda|mountain dew|cold drink|beverage/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Cold+Drink" },
    { test: /thums|cold drink|beverage/, url: "https://www.indiaathome.com.au/cdn/shop/files/Thums_up_750ml_small.png?v=1757508459" },
    { test: /daal|dal|chana|masoor|arhar/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_lentils.jpg" },
    { test: /chawal|rice/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rice_grains_(IRRI).jpg" },
    { test: /haldi|jeera|mirch|masale|spice/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_spices.jpg" },
    { test: /batashe|batasha/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Batashe" },
    { test: /bura/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Bura" },
    { test: /khand/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Khand" },
    { test: /gud|jaggery/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Gud" },
    { test: /cheeni loose|loose sugar/, url: "https://imgs.search.brave.com/jzvdCg4QgHcHJONLP_RAbb021x5hTPwtiSTu_kWe8I4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9yaXRp/a2FydC5jb20vY2Ru/L3Nob3AvcHJvZHVj/dHMvNzkwMEFBMzIt/RkNCRS00MDM0LTk5/NkYtMzRBNDkyNTcw/MTkxXzgwMHguanBn/P3Y9MTYwMTExODkw/MA" },
    { test: /cheeni|sugar/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Sugar_2xmacro.jpg" },
    { test: /chai|tea/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Loose_leaf_tea.jpg" },
    { test: /amul buffalo/, url: "https://imgs.search.brave.com/xku7DNzBzArOk3F9sjk7_huOsYVhOWer8iW5c989Wwk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/NjYzLzQ1MC1ncmFt/LXBhY2stc2l6ZS0x/MDAtcHVyZS1hbmQt/aGVhbHRoeS1kZWxp/Y2lvdXMtdGFzdGUt/dG9ubmVkLWFtdWwt/bWlsay0tODY2Lmpw/Zw" },
    { test: /amul butter/, url: "https://imgs.search.brave.com/j3T91T2aUFpPX76weYQIQ5XbtXgTKHAaPNEOgC4hNQ4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDgv/MjMzL2RlbGljaW91/cy1yYXctcHJvY2Vz/c2VkLXRhc3RlLWh5/Z2llbmljYWxseS1w/YWNrZWQtZnJlc2gt/YW11bC1idXR0ZXIt/ODc4LmpwZw" },
    { test: /amul cow/, url: "https://imgs.search.brave.com/JrA_uTupTeLI3aVQJm04UkEGtQs1eX94HAFj5MI8yxk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvbWlsay9yL3cv/MC81MDAtY293LW1p/bGstcG91Y2gtcGxh/aW4tYW11bC1vcmln/aW5hbC1pbWFoMmhy/enpwejJobWVoLmpw/ZWc_cT03MA" },
    { test: /amul full cream/, url: "https://imgs.search.brave.com/jko8gocO5s6imJImMXmTCAQ6_wCotawVEHQN5gVc1Fg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTEyMDAt/MTIwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvMWM0NGY3Mjgt/N2U3ZS00ZjU5LTky/NDgtNTU2OWEzYjM2/NjcyL0FtdWwtR29s/ZC1GdWxsLUNyZWFt/LUZyZXNoLU1pbGst/UG91Y2guanBlZw" },
    { test: /amul toned/, url: "https://imgs.search.brave.com/guqrVa5HIMWNKb9UG-KZiADkscnuZ_yq85Gf7pQ1Hn0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTEyMDAt/MTIwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvMmU4YTBmODgt/MTAzOC00ZmQzLTgw/OTMtNzA4NWE0OWI0/NzNjL0FtdWwtVGFh/emEtVG9uZWQtRnJl/c2gtTWlsay1Qb3Vj/aC5qcGVn" },
    { test: /ananda dahi/, url: "https://imgs.search.brave.com/g1wGfehpcNEMoBkHw4FJdknJCb-h82gy346vT7Ms88A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/NDk4L3JpY2gtZGVs/aWNpb3VzLWZpbmUt/bmF0dXJhbC10YXN0/ZS1hbmFuZGEtdGhp/Y2stdGFzdHktZGFo/aS00MDAtZ3JhbS00/NDQuanBn" },
    { test: /butter/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Butter_at_the_Borough_Market.jpg" },
    { test: /ananda paneer/, url: "https://imgs.search.brave.com/3J3v5Z3Eo4NgM9EB-Bnxe2IhcZYeGrE_Xc6wqEm9dTk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTI0MDAt/MjQwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvODYyOTQwYzct/MTYwNi00ZDQwLWE0/MjAtZmMzMmY1Yjc3/YjI5L0FuYW5kYS1G/cmVzaC1QcmVtaXVt/LVBhbmVlci5qcGc" },
    { test: /paneer/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Paneer.JPG" },
    { test: /super-t|bachha milk/, url: "https://imgs.search.brave.com/YF2kM2uXAl2NTR1pVCZCcH7_jwM8jI0SPl_n04IIhfA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0LzEy/LzQ3NDMyNjEzNy9W/Sy9MQS9HWS8xNDkx/MjE3My9zdXBlci10/LW1pbGstNTAweDUw/MC5wbmc" },
    { test: /dahi|curd|yogurt/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Dahi" },
    { test: /chaas|buttermilk/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Buttermilk.jpg" },
    { test: /matar|peas/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Green_peas.jpg" },
    { test: /egg/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken_eggs.jpg" },
    { test: /doodh|milk|dairy/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Milk_glass.jpg" },
    { test: /poha|sooji|nashta/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Poha%2C_Maharashtrian_Style.jpg" },
    { test: /namkeen|snack/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Namkeen.jpg" },
    { test: /biscuit|parle/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Biscuits.jpg" },
    { test: /rin laundry soap/, url: "https://imgs.search.brave.com/LlXYVru3vrXww3kLTucakq5REvrAhR73pis3k_QBSIg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zaHVi/aGFtZm9vZHMuY28u/dWsvY2RuL3Nob3Av/ZmlsZXMvUklOX0Rl/dGVyZ2VudF9CYXJf/MjUwZy5qcGc_dj0x/NzczOTI1Mzg5Jndp/ZHRoPTUzMA" },
    { test: /surf excel laundry soap/, url: "https://imgs.search.brave.com/IxU2ra5ejAk04p6pMGroxE7Rr6YQssMa-J5vuSX1QDw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDAzLGFyLTEyMDAt/MTIwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvY2FjZTUzYTMt/YTgzNC00MmYwLTli/ZTQtOGJmNWNlYjhh/MWEwL1N1cmYtRXhj/ZWwtRGV0ZXJnZW50/LUJhci5qcGVn" },
    { test: /tide laundry soap/, url: "https://imgs.search.brave.com/SO50uaCcp1TphUOJNet9yC3D6soHCx1tiDk3Yl6ONuQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi90aWRl/LW9yaWdpbmFsLXNj/ZW50LXNvYXAtYmFy/LW1hbmlsYS1waGls/aXBwaW5lcy1waC1h/cHItYXByaWwtMTc4/NzQwNzkyLmpwZw" },
    { test: /ghadi laundry soap/, url: "https://imgs.search.brave.com/zB2Y9oX8LrMLsuhUZZWOaCQEwZtz1thvJLy2j3Oq-0A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/Y2xldnVwLmluLzMz/Mzc1MS9kb3dubG9h/ZC0yMDI0LTA1LTE0/VDEyMzg1MDc5OS0x/NzE1NjcwNjA2MjIy/LmpwZWc_d2lkdGg9/NjAwJmZvcm1hdD13/ZWJw" },
    { test: /naulakha/, url: "https://imgs.search.brave.com/2CdhN2mM_9QZ2Kl2tv59rLPybhlJW1EIJW8X2raVbrI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIzLzEy/LzM2NTE1NDI0NC9B/TC9UVC9UUy8zMDgx/MTM1OC9uYXVsYWto/YS13YXNoaW5nLXNv/YXAtMTAwMHgxMDAw/LnBuZw" },
    { test: /maruti/, url: "https://imgs.search.brave.com/uyO9DkQXbf_AIXLQD-ZtTPhqzXOmjiKAVqje6QY6JMs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcy/LmV4cG9ydGVyc2lu/ZGlhLmNvbS9wcm9k/dWN0X2ltYWdlcy9i/Yy1mdWxsLzIwMjMv/OS82MDM4NDE0L21h/cnV0aS1zdXBlci1u/aXJvbC1wcmVtaXVt/LWxhdW5kcnktc29h/cC0xNTQ2OTI5NzMz/LTQ1OTk3MDUuanBn" },
    { test: /nirol/, url: "https://imgs.search.brave.com/g2mea5gJCsdRWzX260TOrcNfDLcH_cNnyqQixZ03JUY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0Lzkv/NDQ4OTQ4MTEzL0lS/L1lPL1ZLLzIyNjIy/NjM5NS8ya2ctbmly/b2wtc29hcC0yNTB4/MjUwLmpwZw" },
    { test: /rin liquid detergent/, url: "https://imgs.search.brave.com/FiogKOiktlKMaY54biZTngdTh0s_mQaGfdjD5mOo7yg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9BTkRST0lEL0Rl/ZmF1bHQvMjAyMy81/LzMwNTc5MjA4MS9T/VS9DQS9QRi8zODAz/NDM1L3Byb2R1Y3Qt/anBlZy01MDB4NTAw/LmpwZw" },
    { test: /godrej fab liquid detergent/, url: "https://imgs.search.brave.com/A1oUgs1szAKxa6Qv31GKRi9ruQUMDegAIJJKHzgXeZM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcHBzbmNv/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNC9Hb2Ry/ZWotRmFiLUxpcXVp/ZC1EZXRlcmdlbnQt/UmVmaWxsLVBvdWNo/LWZvci1NYWNoaW5l/LV8tSGFuZC1XYXNo/LTFLZy1fMV8tMS53/ZWJwP2ZpdD0zNTAs/MzUwJnNzbD0x" },
    { test: /surf excel easy wash liquid detergent/, url: "https://imgs.search.brave.com/pKgfmlYTZfodgIVmzlmYO_HNsoPXLTlYaQ_TSf6tDV4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9iYW5r/dXJhc2FtYWJheWJp/cGFuaS5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjYvMDEv/U3VyZi1FeGNlbC1l/YXN5LXdhc2gtbGlx/dWlkLTEtTGl0ZXIu/d2VicA" },
    { test: /surf excel matic top load liquid detergent/, url: "https://imgs.search.brave.com/l1tQlmyqQcgZOBfRGqu81wmdXPCmbPUXGcvyZIyGCog/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDcwLGFyLTEyMDAt/MTIwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvYjQ5MDdiMWIt/NDVhMi00N2U4LTk2/NjgtMmVhZDA0YjUy/ZWUwL1N1cmYtRXhj/ZWwtTWF0aWMtVG9w/LUxvYWQtRGV0ZXJn/ZW50LUxpcXVpZC1Q/b3VjaC5qcGc" },
    { test: /surf excel matic front load liquid detergent/, url: "https://imgs.search.brave.com/IEdSfuqfc4nY3KVgdIe1bQnCaYhMXU3JwjQqFnPaSFA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFTdmo2dHdvWkwu/anBn" },
    { test: /ariel top load liquid detergent/, url: "https://imgs.search.brave.com/foxURHFChAsDUzfgeZ27BpwEZl83EG27Of8h_rqpC1U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFQWkVvczdSUkwu/anBn" },
    { test: /ezee liquid detergent/, url: "https://imgs.search.brave.com/nb6KykyH8EZJEBdjwlQh9RAhzfkmZ7kFLQKfpAxh1es/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFXR2l0TFAxQUwu/anBn" },
    { test: /comfort blue/, url: "https://imgs.search.brave.com/9A4NlE1JzNPer4pHiF6pexwWJfQ2UZFlNVwhRJ1Gi80/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFqWTBTdDNQR0wu/anBn" },
    { test: /comfort pink/, url: "https://imgs.search.brave.com/KHkg8pWZotVM9oLrEtvxokFRMJBWJewc8zMoqaVDdXE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYveGlm/MHEvZmFicmljLXNv/ZnRlbmVyL2sveC8y/Ly1vcmlnaW5hbC1p/bWFoZXlkbmhiZ2tl/dWdtLmpwZWc_cT03/MCZjcm9wPWZhbHNl" },
    { test: /vim.*dishwash.*bar|vim.*dishwash.*tub/, url: "https://imgs.search.brave.com/Yle8_lHON_LM2irkoxba30KFoveR2B6fgEaRlbLOJPs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYva2Zh/MGI2ODAvZGlzaC13/YXNoaW5nLWJhci9x/L2Uvdy9iYXItNjAw/Zy1wYWNrLW9mLTEt/MS02MDAtdmltLW9y/aWdpbmFsLWltYWZ2/cmI5cXdyeWFjeXAu/anBlZz9xPTcwJmNy/b3A9ZmFsc2U" },
    { test: /vim dishwash liquid/, url: "https://imgs.search.brave.com/ladFEk3PpjBSMWCO0HmtvWV_ZoDZj87KkRjH01bLYNc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvZGlzaC13YXNo/aW5nLWJhci9jL2Yv/ay9kaXNoLWNsZWFu/aW5nLWdlbC13aXRo/LXBvd2VyLW9mLWxl/bW9ucy03NTAtbWwt/MS0wLTc1LXZpbS1v/cmlnaW5hbC1pbWFo/M2h5bm5xZGdoMmFh/LmpwZWc_cT03MA" },
    { test: /patanjali dishwash bar/, url: "https://imgs.search.brave.com/WlopH2RNo5vrB_bq7u8-h5ih7de0s4N02cmnhOzBZQs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIva3Fi/OHB6azAvZGlzaC13/YXNoaW5nLWJhci90/L3EvaS9zdXBlci1k/aXNoLXdhc2gtYmFy/LXBhY2stb2YtNC10/b3RhbC0xMDAwZ20t/ZWFjaC0yNTBnbS00/LTEwMDAtb3JpZ2lu/YWwtaW1hZzRjc2d6/ZjljODlqMy5qcGVn/P3E9NzA" },
    { test: /pril dishwash liquid/, url: "https://imgs.search.brave.com/UPasa-JLg-2X5MOuGXI1MkViBzJnnEDKMsXHc6MzZMo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzE1UEJ2KzQrREwu/anBn" },
    { test: /harpic blue toilet cleaner/, url: "https://imgs.search.brave.com/TRJSrbKZ9AoUCbIzrhllwCsCD5Sf9L0nJiJ0YEtO18c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTMuZmxpeGNh/cnQuY29tL2ltYWdl/LzExMTQvOTcyL3hp/ZjBxL3RvaWxldC1j/bGVhbmVyL2Yvby9q/L29yaWdpbmFsLTEt/aHAxMzctMi1oYXJw/aWMtb3JpZ2luYWwt/aW1haGYyMnZ5Mmt4/c2VrZy5qcGVnP3E9/NjAmY3JvcD1mYWxz/ZQ" },
    { test: /harpic white toilet cleaner/, url: "https://imgs.search.brave.com/UVN8zWBjHVO9FSZTNEDXgw7eiAw6FlWFqFoQrEst2Ko/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ncmF5/c2hvbWVkZWxpdmVy/aWVzLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMC8xMi9I/YXJwaWMtV2hpdGUt/U2hpbmUtT3JpZ2lu/YWwtNzUwbWwuanBn" },
    { test: /harpic red tile cleaner/, url: "https://imgs.search.brave.com/IfgPag0ufQIjmB1LX7ustDXsiVZb4DR3xLzTqTjgUFY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aGFycGljLmNvLmlu/L3N0YXRpYy9iMGY2/M2Q0NzRmZjVlZWFl/N2JjYTAxZjMxNmMx/YTg3Yy9hYzk4NC9I/YXJwaWNfLV9JTl8t/X2VuLUlOLWhhcnBp/Y19iYXRocm9vbV9j/bGVhbmVyX2xlbW9u/X2ZyZXNoXzEwMDBt/bC53ZWJw" },
    { test: /harpic purple tile cleaner/, url: "https://imgs.search.brave.com/tM2XDn3hH-_M20Y-xsye_aq66xhBEUdG8UYZcTCCaAQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDAzLGFyLTIwMDAt/MjAwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvYmI3NDM3ZGUt/YTBjNS00Y2U4LWE5/ZjItNjhiYzJmYTZh/MjAyL0hhcnBpYy1C/YXRocm9vbS1VbHRy/YS0xMFgtVG91Z2gt/U3RhaW4tUmVtb3Zl/ci1DaXRydXMtMTAw/MG1sLmpwZWc" },
    { test: /godrej spic|godrej spike/, url: "https://imgs.search.brave.com/pvd6Bi40qKL3ipZB262MYMLZrburNB5rondZJzGoUAY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDAzLGFyLTE2MDAt/MTYwMCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvMTdmZDNkZDAt/YjkyNy00NjM1LWEw/MzItNThiYjQ4ZDEy/Y2E4L0dvZHJlai1T/cGljLURpc2luZmVj/dGFudC1Ub2lsZXQt/Q2xlYW5lci1Db21i/by0uanBlZw" },
    { test: /lizol/, url: "https://imgs.search.brave.com/I8DZ5lhzWqGWKKPWq_DV89ZyNJ_H1EeTwwvNfb_LXgU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9BTkRST0lEL0Rl/ZmF1bHQvMjAyNS85/LzU0MTU1MTA1Mi9G/Qi9OQS9PQy8yNTE5/NzIzODMvcHJvZHVj/dC1qcGVnLTI1MHgy/NTAuanBn" },
    { test: /rin aala/, url: "https://imgs.search.brave.com/tpqIWdSiV8KkdZqn1EuuiS_OPlnd2iBeB0N3fxpC1P4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFMRTVQQ3A2Wkwu/anBn" },
    { test: /domex/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Domex" },
    { test: /colin/, url: "https://imgs.search.brave.com/Ooo7bkHz0hjWxHSFvEmwzlKWxYZheiZydSE72u-qb00/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQQWtqaWlqbkwu/anBn" },
    { test: /black phenyl/, url: "https://imgs.search.brave.com/tRIy7d08Yo2p36pkF4IP1mwZOrVk8iFgxRqTQYX_A_o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFQT3FOa0xGU0wu/anBn" },
    { test: /gainda phenyl/, url: "https://imgs.search.brave.com/3Z7UiiVeg1BuBfrn78HfXf4Lu2bBcqFZuPxfoHlWnCc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvYmF0aHJvb20t/Zmxvb3ItY2xlYW5l/ci9oL2UvcC9vcmln/aW5hbC0yMDAwLWJs/YWNrLXBoZW55bC1k/aXNpbmZlY3RhbnQt/YS1wb3dlcmZ1bC1n/ZXJtaWNpZGUtb3Jp/Z2luYWwtaW1haGti/Z2dzeXp1cGRtOS5q/cGVnP3E9NzA" },
    { test: /phenyl balls/, url: "https://imgs.search.brave.com/0IjZlvHhsi38_pIAi1BJOGziU3NAe81tfmSDudxRmd4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubWVlc2hvLmNv/bS9pbWFnZXMvcHJv/ZHVjdHMvNTMwOTUy/ODYzL2owM3lsXzUx/Mi53ZWJwP3dpZHRo/PTUxMg" },
    { test: /odonil air spray/, url: "https://imgs.search.brave.com/PAH42o0dgj4U57sbzL_2nYKBmViVTHXN91Se_hkawn8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvYWlyLWZyZXNo/ZW5lci9sL3ovaC8x/LW5ldy1yb29tLXNw/cmF5LXBhY2stb2Yt/NC1qYXNtaW5lLWZy/ZXNoLTItbGF2ZW5k/ZXItbWlzdC0yLTIy/MG1sLW9yaWdpbmFs/LWltYWhkM3N0c3Qy/enJ5OHUuanBlZz9x/PTcw" },
    { test: /odonil room freshener pouch/, url: "https://imgs.search.brave.com/3sFJ4X4UzWIKUyuh5W0aS_oBWfA9qPkfIGh8qR_AmaA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9idWRn/ZXRiYXphYXIub25s/aW5lL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzA3L09ET05J/TC1QT1VDSC1ST1NF/LTEwR00tNTAweDUw/MC5qcGc" },
    { test: /aer pocket room freshener|air room freshener/, url: "https://imgs.search.brave.com/6cidJ58jEQTVcb1BzEQfSOD-z1qyXUJgb2cDsb1dtS0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYveGlm/MHEvYWlyLWZyZXNo/ZW5lci8wL3IvaC80/LWZydWl0eS1wdW5j/aC1haXItZnJlc2hu/ZXItcG93ZXItcG9j/a2V0LWdlbC0zLWFu/ZC1yb29tLW9yaWdp/bmFsLWltYWhlcG1z/MmRjdmZua3cuanBl/Zz9xPTcwJmNyb3A9/ZmFsc2U" },
    { test: /all out/, url: "https://imgs.search.brave.com/xLyDCrS4YnO9H9x9Mg36irGm2uU_ULOBDyJVkiMsT_0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NDAzLGFyLTEwODAt/MTA4MCxwci10cnVl/LGYtYXV0byxxLTQw/LGRwci0yL2Ntcy9w/cm9kdWN0X3Zhcmlh/bnQvZTBhZWYxM2Et/ZWZlNy00OTkyLWIx/ZjQtYjRjMDI1NWI5/N2MyL0FsbC1PdXQt/VWx0cmEtU2xpZGVy/LU1hY2hpbmUtMS1S/ZWZpbGwtTGlxdWlk/LVZhcG9yaXNlci1N/b3NxdWl0by1SZXBl/bGxlbnQuanBlZw" },
    { test: /good knight/, url: "https://imgs.search.brave.com/Igez_ySfgweA53eDrkVbYM05OWMzqVIDtMfVhYFfhv4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzMwMC8zMDAveGlm/MHEvbW9zcXVpdG8t/dmFwb3Jpc2UtcmVm/aWxsLzcvei83Ly1l/bnJpY2hlZC10cmFu/c3BhcmVudC1vcmln/aW5hbC1pbWFoZTM2/aGc0d3dkeTVqLnBu/Zz9xPTkw" },
    { test: /mortein/, url: "https://imgs.search.brave.com/_4NC4SDDIsFGIbgox4177-MGukHvV9WwDs15rw2JjXE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hbmRh/bWFuZ3JlZW5ncm9j/ZXJzLmNvbS93cC1j/b250ZW50L3VwbG9hZHMvMjAyMi8wMi9t/b3J0ZWluLXBvd2Vy/Ym9vc3Rlci1jb2ls/LThoci1tcnAyNy5q/cGc" },
    { test: /laxman rekha/, url: "https://imgs.search.brave.com/N9p_NtXB5xw3P6OCe0eggv_SumLGRg0CL1e9LlUgBD4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9ERC9VUS9CVy9TRUxMRVItMjQ5NDkz/OC9sYXhtYW4tcmVr/aGEtY2hhbGstMjUw/eDI1MC5qcGc" },
    { test: /hit red/, url: "https://imgs.search.brave.com/Zi81z_NG583UJ2p556nztcxldbmCCJ9q0GR_NHK-ZbE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9naGFy/c3R1ZmYuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIwLzA4/L0hpdC1SZWQtQ29j/a3JvYWNoLUtpbGxl/ci1TcHJheS00MDBt/bC5qcGc" },
    { test: /hit black/, url: "https://imgs.search.brave.com/NmKGfdWXLeQxSXKINEih7ntsTQJvDQcvM0DSzy-AkmQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVmYXVsdC8yMDIyLzUvS0QvUFcvTFQvMjU5MDY4MDMvMjAwbWwtYmxhY2staGl0LW1vc3F1aXRvLXNwcmF5LTEwMDB4MTAwMC5qcGc" },
    { test: /surf excel blue detergent powder/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Surf+Excel+Blue" },
    { test: /surf excel easy wash detergent powder/, url: "https://imgs.search.brave.com/SyKGkC6nrut-T_NGRIwW8c6QbWb_2t4ZlFDXqpT20C0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cGFuY2hhbXJ1dGhh/LmNvbS9jZG4vc2hv/cC9maWxlcy9TY3Jl/ZW5zaG90XzIxMi5w/bmc_dj0xNzU0OTIw/NjU0JndpZHRoPTc0/Mg" },
    { test: /surf excel quick wash detergent powder/, url: "https://imgs.search.brave.com/RqH107fpGLWGuZFgZqUJ0bloxucpv9CF6X7IjON2P28/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIyLzkv/RlgvWEEvR0MvNDI0/MDE5MjUvc3VyZi1l/eGNlbC1kZXRlcmdl/bnQtcG93ZGVyLTUw/MHg1MDAuanBn" },
    { test: /rin detergent powder/, url: "https://imgs.search.brave.com/YQBqT_2r0UJ5zj128Zf2v0fQq8emEwKaovzxY7GtMRA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3RhcnF1aWsuY29t/L2Nkbi9zaG9wL2Zp/bGVzL1NRMTAyNTA5/X0ZPUF8xN2FlZWYz/NS02NGRkLTRkMzgt/ODdiNS1mZjQxMzg0/ZjM2MTguanBnP3Y9/MTc3Njg0NzMxNCZ3/aWR0aD0xNDQ1" },
    { test: /tide detergent powder/, url: "https://imgs.search.brave.com/Q8kzfRt-Qpdp4qA6tyE81nrXmrVXoFTdrkzfTOgK3Fc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFPb2FvbkVKOUwu/anBn" },
    { test: /ariel|arial/, url: "https://imgs.search.brave.com/c7eKuCsQu-AWrbohTiCP6dptIOQ1WMvhhVcxZgmo-Z4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFENUxmQ3VtWUwu/anBn" },
    { test: /wheel blue/, url: "https://imgs.search.brave.com/hUmPL8O9ucPE39kyKQ6GzJYXRQMldqmXVRmQwpmQ0dA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI1LzEy/LzU3MDA4MDQ1NC9K/SS9FQy9aWi8xMzY1/ODc3MzEvMWtnLWFj/dGl2ZS13aGVlbC1k/ZXRlcmdlbnQtcG93/ZGVyLTUwMHg1MDAu/anBn" },
    { test: /wheel green/, url: "https://imgs.search.brave.com/ZljZkY8e70GToPSf79nDP1iUvub1YQ4C-j4s0FpzsI0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/ODU4L2FjdGl2ZS13/aGVlbC0yLWluLTEt/c3BhcmtsaW5nLXJh/cGlkLXdhc2hlZC1k/ZXRlcmdlbnQtcG93/ZGVyLWZvci1jbG90/aGVzLTI5OS5qcGc" },
    { test: /rin/, url: "https://imgs.search.brave.com/LlXYVru3vrXww3kLTucakq5REvrAhR73pis3k_QBSIg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zaHVi/aGFtZm9vZHMuY28u/dWsvY2RuL3Nob3Av/ZmlsZXMvUklOX0Rl/dGVyZ2VudF9CYXJf/MjUwZy5qcGc_dj0x/NzczOTI1Mzg5Jndp/ZHRoPTUzMA" },
    { test: /surf excel/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Surf+Excel" },
    { test: /tide/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Tide" },
    { test: /ghadi/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Ghadi" },
    { test: /naulakha|maruti|nirol|desi sabun/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Desi+Sabun" },
    { test: /surf|phenyl|clean|saaf|detergent|laundry/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Laundry_detergent.jpg" },
    { test: /soap|toothpaste|personal/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Toiletries.jpg" },
    { test: /agarbatti|kapoor|pooja/, url: "https://commons.wikimedia.org/wiki/Special:FilePath/Incense_sticks.jpg" }
  ];
  const match = photos.find((photo) => photo.test.test(name));
  return match?.url || `https://placehold.co/640x480/fff8e8/111d4a/png?text=${encodeURIComponent(product.name)}`;
}

function unitMeta(product) {
  const match = String(product?.unit || "").toLowerCase().match(/([\d.]+)?\s*(kg|g|gram|grams|litre|liter|l|ml)/);
  if (!match) return { kind: "count", baseAmount: 1 };
  const value = Number(match[1] || 1);
  const unit = match[2];
  if (unit === "kg") return { kind: "weight", baseAmount: value * 1000 };
  if (unit === "g" || unit === "gram" || unit === "grams") return { kind: "weight", baseAmount: value };
  if (unit === "litre" || unit === "liter" || unit === "l") return { kind: "volume", baseAmount: value * 1000 };
  return { kind: "volume", baseAmount: value };
}

function quantityLabel(product, qty) {
  if (!product?.loose) return `${Number(qty).toLocaleString("en-IN")} ${Number(qty) === 1 ? "item" : "items"}`;
  const meta = unitMeta(product);
  const baseAmount = Number((Number(qty || 0) * meta.baseAmount).toFixed(2));
  if (meta.kind === "weight") {
    return baseAmount >= 1000 ? `${Number((baseAmount / 1000).toFixed(2)).toLocaleString("en-IN")} kg` : `${baseAmount.toLocaleString("en-IN")} g`;
  }
  if (meta.kind === "volume") {
    return baseAmount >= 1000 ? `${Number((baseAmount / 1000).toFixed(2)).toLocaleString("en-IN")} litre` : `${baseAmount.toLocaleString("en-IN")} ml`;
  }
  return `${qty} ${product.unit || "item"}`;
}

function publicProduct(db, product) {
  return {
    ...product,
    imageUrl: productImageUrl(product),
    category: categoryName(db, product.categoryId),
    stockStatus: product.stock <= 0 ? "out" : product.stock <= product.lowStockAt ? "low" : "in"
  };
}

function publicOrder(db, order) {
  return {
    ...order,
    discount: Number(order.discount || 0),
    total: Number(order.total || order.payable || order.subtotal || 0),
    payable: Number(order.total || order.payable || order.subtotal || 0),
    items: order.items.map((item) => {
      const product = db.products.find((candidate) => candidate.id === item.productId);
      return {
        ...item,
        name: product?.name || item.productName || "Unknown item",
        unit: product?.unit || item.unit || "",
        loose: Boolean(product?.loose),
        quantityLabel: quantityLabel(product, item.qty),
        lineTotal: Number((item.qty * item.price).toFixed(2))
      };
    })
  };
}

function createReceipt(db, order) {
  const existing = (db.receipts || []).find((receipt) => receipt.orderId === order.id);
  if (existing) return existing;
  const receipt = {
    id: nextReceiptId(db),
    orderId: order.id,
    customerId: order.customerId,
    name: order.name,
    phone: order.phone,
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    total: Number(order.total || order.payable || order.subtotal || 0),
    paymentMode: order.paymentMode || "pay_at_store",
    paymentStatus: order.paymentStatus || "due_on_pickup",
    gstEnabled: Boolean(db.settings?.gstEnabled),
    createdAt: nowIso(),
    shareText: `Kushwaha Store receipt ${order.id}: ₹${Number(order.total || order.payable || order.subtotal || 0)}`
  };
  db.receipts.push(receipt);
  return receipt;
}

function publicReceipt(db, receipt) {
  const order = db.orders.find((item) => item.id === receipt.orderId);
  return {
    ...receipt,
    order: order ? publicOrder(db, order) : null,
    store: db.store
  };
}

function publicPayment(payment) {
  return payment;
}

function orderTimeline(order, status, note) {
  order.timeline ||= [];
  order.timeline.push({ status, at: nowIso(), note: note || `Marked ${status}` });
}

function ledgerForCustomer(db, customer, fallbackName) {
  let account = db.ledger.find((item) => item.customerId === customer?.id || (customer?.phone && item.phone === customer.phone));
  if (!account) {
    account = {
      id: `ledger-${crypto.randomUUID().slice(0, 8)}`,
      customerId: customer?.id || null,
      phone: customer?.phone || "",
      name: customer?.name || fallbackName || "Customer",
      balance: 0,
      entries: []
    };
    db.ledger.push(account);
  }
  account.entries ||= [];
  return account;
}

function addLedgerEntry(db, { customer, name, phone, type, amount, note, orderId, month }) {
  const account = ledgerForCustomer(db, customer || { name, phone }, name);
  const cleanAmount = Number(amount || 0);
  const entryType = type === "credit" ? "credit" : "debit";
  const entry = {
    id: `le-${crypto.randomUUID().slice(0, 8)}`,
    type: entryType,
    amount: cleanAmount,
    note: note || (entryType === "credit" ? "Payment received" : "Monthly grocery purchase"),
    orderId: orderId || null,
    month: month || monthKey(),
    createdAt: nowIso()
  };
  account.entries.push(entry);
  account.balance = Number(account.balance || 0) + (entryType === "debit" ? cleanAmount : -cleanAmount);
  if (account.balance < 0) account.balance = 0;
  return { account, entry };
}

function monthlyStatement(db, customerOrId, month = monthKey()) {
  const customer = typeof customerOrId === "string"
    ? db.customers.find((item) => item.id === customerOrId || item.phone === customerOrId)
    : customerOrId;
  const account = db.ledger.find((item) => item.customerId === customer?.id || item.phone === customer?.phone);
  const entries = (account?.entries || [])
    .filter((entry) => (entry.month || monthKey(entry.createdAt)) === month)
    .map((entry) => {
      const order = entry.orderId ? db.orders.find((item) => item.id === entry.orderId) : null;
      return {
        ...entry,
        order: order ? publicOrder(db, order) : null
      };
    });
  const debit = entries.filter((entry) => entry.type === "debit").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const credit = entries.filter((entry) => entry.type === "credit").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return {
    month,
    customer: publicCustomer(customer),
    account: account || null,
    entries,
    debit,
    credit,
    due: Math.max(0, debit - credit),
    status: debit > 0 && Math.max(0, debit - credit) === 0 ? "paid" : Math.max(0, debit - credit) > 0 ? "unpaid" : "clear",
    currentBalance: Number(account?.balance || 0)
  };
}

function publicCustomer(customer) {
  if (!customer) return null;
  const { passwordHash, passwordSalt, ...safeCustomer } = customer;
  return safeCustomer;
}

const REWARD_TYPES = new Set(["loyalty", "monthly_gift", "lucky_draw"]);

function rewardEligibility(db, customer, type) {
  const threshold = Number(db.settings.monthlyGiftThreshold || 5000);
  const monthlySpend = Number(customer?.monthlySpend || 0);
  const loyaltyPoints = Number(customer?.loyaltyPoints || 0);
  if (type === "loyalty") {
    return {
      eligible: Boolean(customer && db.settings.loyaltyEnabled),
      reason: db.settings.loyaltyEnabled ? "Account can earn and redeem 1% loyalty points." : "Loyalty program is disabled.",
      metric: `${loyaltyPoints} points`
    };
  }
  if (type === "monthly_gift") {
    return {
      eligible: Boolean(customer && db.settings.monthlyGiftEnabled && monthlySpend >= threshold),
      reason: monthlySpend >= threshold ? "Monthly shopping threshold crossed." : `Needs ₹${Math.max(0, threshold - monthlySpend)} more monthly shopping.`,
      metric: `₹${monthlySpend} / ₹${threshold}`
    };
  }
  return {
    eligible: Boolean(customer && db.settings.communityRewardsEnabled),
    reason: db.settings.communityRewardsEnabled ? "Customer applied for the ₹1,000/month lucky draw enrollment." : "Lucky draw program is disabled.",
    metric: "₹1,000/month"
  };
}

function publicRewardApplication(db, application) {
  const customer = db.customers.find((item) => item.id === application.customerId || item.phone === application.phone);
  const eligibility = rewardEligibility(db, customer, application.type);
  return {
    ...application,
    customer: publicCustomer(customer),
    eligible: eligibility.eligible,
    eligibilityReason: eligibility.reason,
    eligibilityMetric: eligibility.metric,
    status: application.status === "not_applied" ? "not_applied" : eligibility.eligible ? application.status || "eligible" : "not_eligible"
  };
}

function findUdhaarApplication(db, customer) {
  return (db.rewards.applications || []).find((application) => (
    application.type === "udhaar" &&
    (application.customerId === customer?.id || application.phone === customer?.phone)
  ));
}

function publicUdhaarApplication(db, application) {
  if (!application) return null;
  const customer = db.customers.find((item) => item.id === application.customerId || item.phone === application.phone);
  const account = db.ledger.find((item) => item.customerId === customer?.id || item.phone === customer?.phone);
  return {
    ...application,
    customer: publicCustomer(customer),
    ledgerAccountId: account?.id || null,
    balance: Number(account?.balance || 0)
  };
}

// Supabase Authentication Functions
async function verifySupabaseToken(token) {
  if (!SUPABASE_AUTH_ENABLED || !supabaseAuth) return null;
  try {
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

async function verifyAdminSession(sessionToken) {
  if (!sessionToken) return null;
  try {
    const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    if (decoded.admin === ADMIN_PHONE && decoded.exp > Date.now()) {
      return { admin: ADMIN_PHONE, role: ADMIN_ROLE };
    }
  } catch {
    return null;
  }
  return null;
}

async function createAdminSession(adminPhone, role = ADMIN_ROLE) {
  const session = {
    admin: adminPhone,
    role: role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  const token = signAdminPayload(session);
  return { token, admin: adminPhone, role };
}

async function supabaseCustomerSignup(phone, password, name) {
  if (!SUPABASE_AUTH_ENABLED || !supabaseAuth) {
    // Fallback to local auth
    const db = await readDb();
    const existing = db.customers.find((c) => c.phone === phone);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
    if (existing) {
      existing.name = name || existing.name || "Customer";
      existing.passwordSalt = salt;
      existing.passwordHash = hash;
      existing.updatedAt = nowIso();
      await writeDb(db);
      return { customer: publicCustomer(existing), session: null };
    }
    const customer = {
      id: `cust-${crypto.randomUUID().slice(0, 8)}`,
      name,
      phone,
      passwordSalt: salt,
      passwordHash: hash,
      loyaltyPoints: 0,
      monthlySpend: 0
    };
    db.customers.push(customer);
    await writeDb(db);
    return { customer: publicCustomer(customer), session: null };
  }

  try {
    const { data, error } = await supabaseAuth.auth.signUp({
      phone: `+91${phone}`,
      password,
      options: {
        data: { name, phone }
      }
    });
    if (error) throw error;
    
    // Create customer record in database
    const db = await readDb();
    const customer = {
      id: data.user?.id || `cust-${crypto.randomUUID().slice(0, 8)}`,
      name,
      phone,
      loyaltyPoints: 0,
      monthlySpend: 0
    };
    const existing = db.customers.find((c) => c.phone === phone);
    if (!existing) {
      db.customers.push(customer);
      await writeDb(db);
    }
    return { customer: publicCustomer(customer), session: data.session };
  } catch (error) {
    throw new Error(`Signup failed: ${error.message}`);
  }
}

async function supabaseCustomerLogin(phone, password) {
  if (!SUPABASE_AUTH_ENABLED || !supabaseAuth) {
    // Fallback to local auth
    const db = await readDb();
    const customer = db.customers.find((c) => c.phone === phone);
    if (!customer || !customer.passwordHash || !customer.passwordSalt) {
      throw new Error("Invalid credentials");
    }
    const hash = crypto.pbkdf2Sync(password, customer.passwordSalt, 100000, 64, 'sha256').toString('hex');
    if (hash !== customer.passwordHash) {
      throw new Error("Invalid credentials");
    }
    return { customer: publicCustomer(customer), session: null };
  }

  try {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      phone: `+91${phone}`,
      password
    });
    if (error) throw error;
    
    // Get customer from database
    const db = await readDb();
    let customer = db.customers.find((c) => c.phone === phone);
    if (!customer && data.user) {
      customer = {
        id: data.user.id,
        name: data.user.user_metadata?.name || "Customer",
        phone,
        loyaltyPoints: 0,
        monthlySpend: 0
      };
      db.customers.push(customer);
      await writeDb(db);
    }
    return { customer: publicCustomer(customer), session: data.session };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

async function supabaseAdminLogin(phone, password) {
  if (!ADMIN_PASSWORD) {
    throw new Error("Admin password is not configured");
  }
  const validPasswords = new Set([ADMIN_PASSWORD, ADMIN_PASSWORD_FALLBACK].filter(Boolean));
  if (phone !== ADMIN_PHONE || !validPasswords.has(password)) {
    throw new Error("Invalid admin credentials");
  }
  return await createAdminSession(phone, ADMIN_ROLE);
}

function customerRewardApplications(db, customer) {
  const existing = db.rewards.applications.filter((application) => application.customerId === customer.id || application.phone === customer.phone);
  return ["loyalty", "monthly_gift", "lucky_draw"].map((type) => {
    const application = existing.find((item) => item.type === type) || {
      type,
      customerId: customer.id,
      phone: customer.phone,
      status: "not_applied"
    };
    return publicRewardApplication(db, application);
  });
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
}

function signAdminPayload(payload) {
  const encoded = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyAdminToken(token) {
  try {
    if (!token || !token.includes(".")) return null;
    const [encoded, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(encoded).digest("base64url");
    if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(encoded.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function adminFromRequest(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : req.headers["x-admin-token"];
  return verifyAdminToken(token);
}

function requireAdmin(req, res, allowedRoles = ["owner", "manager", "helper"]) {
  const admin = adminFromRequest(req);
  if (!admin) {
    unauthorized(res);
    return null;
  }
  if (!allowedRoles.includes(admin.role)) {
    unauthorized(res, "This admin role cannot perform that action");
    return null;
  }
  return admin;
}

function passwordHash(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString("hex");
}

function attachPassword(customer, password) {
  const salt = crypto.randomBytes(16).toString("hex");
  customer.passwordSalt = salt;
  customer.passwordHash = passwordHash(password, salt);
}

function verifyPassword(customer, password) {
  if (!customer?.passwordHash || !customer?.passwordSalt) return false;
  const attempted = passwordHash(password, customer.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(attempted, "hex"), Buffer.from(customer.passwordHash, "hex"));
}

function timingSafeTextEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function paymentSettings(db) {
  return {
    upiVpa: UPI_VPA || db.settings.upiVpa || "kushwahastore@upi",
    upiName: UPI_NAME || db.settings.upiName || "Kushwaha Store",
    upiStaticQrUrl: db.settings.upiStaticQrUrl || "/assets/upi-qr.png",
    refundsEnabled: true,
    pickupPayments: ["pay_at_store", "upi_on_pickup"],
    onlinePayments: ["upi_intent"],
    paymentTimeout: 15 * 60 * 1000, // 15 minutes
    retryLimit: 3
  };
}

function upiIntentUrl({ vpa, name, amount, orderId }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: Number(amount || 0).toFixed(2),
    cu: "INR",
    tn: `Kushwaha Store ${orderId || "pickup order"}`
  });
  return `upi://pay?${params.toString()}`;
}

function upiQrUrl(intentUrl) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(intentUrl)}`;
}

async function createPayment(db, { orderId, customerId, method, amount, reference, note }) {
  const payment = {
    id: `pay-${crypto.randomUUID().slice(0, 8)}`,
    orderId,
    customerId,
    method: method || "upi_intent",
    amount: Number(amount || 0),
    status: "pending",
    reference: reference || null,
    note: note || "",
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + paymentSettings(db).paymentTimeout).toISOString()
  };
  db.payments.push(payment);
  await writeDb(db);
  return payment;
}

async function updatePaymentStatus(db, paymentId, status, reference = null) {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Payment not found");
  
  const validStatuses = ["pending", "paid", "failed", "cancelled", "refunded"];
  if (!validStatuses.includes(status)) throw new Error("Invalid payment status");
  
  payment.status = status;
  if (reference) payment.reference = reference;
  payment.updatedAt = nowIso();
  
  // Update order payment status if payment is successful
  if (status === "paid" && payment.orderId) {
    const order = db.orders.find((o) => o.id === payment.orderId);
    if (order) {
      order.paymentStatus = "paid";
      if (order.status === "Placed") {
        order.status = "Being Packed";
        orderTimeline(order, "Being Packed", "Payment confirmed");
      }
    }
  }
  
  await writeDb(db);
  return payment;
}

async function refundPayment(db, paymentId, reason = "") {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Payment not found");
  if (payment.status !== "paid") throw new Error("Can only refund paid payments");
  
  payment.status = "refunded";
  payment.refundReason = reason;
  payment.refundedAt = nowIso();
  
  // Update order payment status
  if (payment.orderId) {
    const order = db.orders.find((o) => o.id === payment.orderId);
    if (order) {
      order.paymentStatus = "refunded";
    }
  }
  
  await writeDb(db);
  return payment;
}


function findOrCreateCustomer(db, body) {
  const cleanPhone = String(body.phone || "").replace(/\D/g, "");
  let customer = db.customers.find((item) => cleanPhone && item.phone === cleanPhone);
  if (!customer) {
    const name = String(body.name || "Walk-in Customer").trim() || "Walk-in Customer";
    customer = {
      id: `cust-${slug(name) || crypto.randomUUID().slice(0, 8)}-${crypto.randomUUID().slice(0, 4)}`,
      name,
      phone: cleanPhone,
      loyaltyPoints: 0,
      monthlySpend: 0
    };
    db.customers.push(customer);
  }
  return customer;
}

function computeSummary(db) {
  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = db.orders.filter((order) => String(order.createdAt).startsWith(today));
  const revenue = todaysOrders.reduce((sum, order) => sum + Number(order.total || order.payable || order.subtotal || 0), 0);
  const lowStock = db.products.filter((product) => product.stock > 0 && product.stock <= product.lowStockAt);
  const itemCount = new Map();
  for (const order of db.orders) {
    for (const item of order.items) {
      itemCount.set(item.productId, (itemCount.get(item.productId) || 0) + item.qty);
    }
  }
  const best = [...itemCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const bestProduct = best ? db.products.find((product) => product.id === best[0]) : null;
  return {
    totalOrders: todaysOrders.length,
    revenue,
    readyForPickup: db.orders.filter((order) => order.status === "Ready").length,
    lowStockCount: lowStock.length,
    lowStock: lowStock.map((product) => publicProduct(db, product)),
    bestSeller: bestProduct ? { name: bestProduct.name, quantity: best[1] } : null,
    outstandingUdhaar: db.ledger.reduce((sum, account) => sum + Number(account.balance || 0), 0)
  };
}

async function handleApi(req, res, url) {
  const segments = url.pathname.split("/").filter(Boolean);
  const method = req.method || "GET";

  if (method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      name: "Kushwaha Store",
      driver: SUPABASE_ENABLED ? "supabase" : "local-json",
      cacheMs: SUPABASE_ENABLED ? SUPABASE_CACHE_MS : 0,
      time: nowIso()
    });
  }

  if (method === "POST" && url.pathname === "/api/admin/login") {
    const body = await readBody(req);
    const phone = String(body.phone || "").replace(/\D/g, "");
    const password = String(body.password || "");
    try {
      const session = await supabaseAdminLogin(phone, password);
      return sendJson(res, 200, { admin: { phone: session.admin, role: session.role, name: "Kushwaha Store Admin" }, token: session.token });
    } catch (error) {
      return unauthorized(res, error.message);
    }
  }

  const db = await readDb();

  if (method === "GET" && url.pathname === "/api/payments/options") {
    const amount = Number(url.searchParams.get("amount") || 0);
    const orderId = url.searchParams.get("orderId") || "";
    const settings = paymentSettings(db);
    const intentUrl = upiIntentUrl({ vpa: settings.upiVpa, name: settings.upiName, amount, orderId });
    return sendJson(res, 200, {
      ...settings,
      upiIntentUrl: intentUrl,
      upiQrUrl: settings.upiStaticQrUrl || upiQrUrl(intentUrl),
      generatedUpiQrUrl: upiQrUrl(intentUrl)
    });
  }

  if (method === "POST" && url.pathname === "/api/payments") {
    const body = await readBody(req);
    try {
      const payment = await createPayment(db, {
        orderId: body.orderId,
        customerId: body.customerId,
        method: body.method,
        amount: body.amount,
        reference: body.reference,
        note: body.note
      });
      return sendJson(res, 201, { payment });
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  if (method === "PATCH" && segments[0] === "api" && segments[1] === "payments" && segments[2]) {
    const payment = db.payments.find((p) => p.id === segments[2]);
    if (!payment) return notFound(res);
    if (!requireAdmin(req, res)) return;
    
    const body = await readBody(req);
    try {
      const updatedPayment = await updatePaymentStatus(db, segments[2], body.status, body.reference);
      return sendJson(res, 200, { payment: updatedPayment });
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  if (method === "POST" && segments[0] === "api" && segments[1] === "payments" && segments[2] === "refund") {
    const body = await readBody(req);
    if (!requireAdmin(req, res)) return;
    
    try {
      const refundedPayment = await refundPayment(db, body.paymentId, body.reason);
      return sendJson(res, 200, { payment: refundedPayment });
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  if (method === "GET" && url.pathname === "/api/bootstrap") {
    return sendJson(res, 200, {
      store: db.store,
      settings: db.settings,
      categories: [{ id: "all", name: "All", sort: 0 }, ...db.categories].sort((a, b) => a.sort - b.sort),
      products: db.products.map((product) => publicProduct(db, product)),
      orders: [],
      ledger: [],
      summary: null,
      rewards: db.rewards,
      reviews: (db.reviews || []).filter((review) => review.published !== false).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      payments: [],
      receipts: []
    });
  }

  if (method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readBody(req);
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const password = String(body.password || "");
    if (!name || !phone || password.length < 4) {
      return badRequest(res, "Name, phone and a 4+ character password are required");
    }
    try {
      const { customer, session } = await supabaseCustomerSignup(phone, password, name);
      const orders = db.orders.filter((order) => order.customerId === customer.id || order.phone === customer.phone).map((order) => publicOrder(db, order));
      return sendJson(res, 201, { customer, orders, session });
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  if (method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readBody(req);
    const phone = String(body.phone || "").replace(/\D/g, "");
    const password = String(body.password || "");
    try {
      const { customer, session } = await supabaseCustomerLogin(phone, password);
      const orders = db.orders.filter((order) => order.customerId === customer.id || order.phone === customer.phone).map((order) => publicOrder(db, order));
      return sendJson(res, 200, { customer, orders, session });
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "orders") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    const orders = db.orders
      .filter((order) => order.customerId === customer.id || order.phone === customer.phone)
      .map((order) => publicOrder(db, order))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, { customer: publicCustomer(customer), orders });
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "statement") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    return sendJson(res, 200, monthlyStatement(db, customer, url.searchParams.get("month") || monthKey()));
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "rewards") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    return sendJson(res, 200, { customer: publicCustomer(customer), applications: customerRewardApplications(db, customer) });
  }

  if (method === "POST" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "rewards" && segments[4] === "apply") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    const body = await readBody(req);
    const type = String(body.type || "");
    if (!REWARD_TYPES.has(type)) return badRequest(res, "Valid reward type is required");
    const eligibility = rewardEligibility(db, customer, type);
    let application = db.rewards.applications.find((item) => item.customerId === customer.id && item.type === type);
    if (!application) {
      application = {
        id: `reward-app-${type}-${customer.id}-${crypto.randomUUID().slice(0, 4)}`,
        type,
        customerId: customer.id,
        phone: customer.phone,
        name: customer.name,
        note: body.note || "",
        createdAt: nowIso()
      };
      db.rewards.applications.push(application);
    }
    application.name = customer.name;
    application.phone = customer.phone;
    application.status = eligibility.eligible ? "eligible" : "not_eligible";
    application.updatedAt = nowIso();
    await writeDb(db);
    return sendJson(res, 201, {
      customer: publicCustomer(customer),
      application: publicRewardApplication(db, application),
      applications: customerRewardApplications(db, customer)
    });
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "udhaar-request") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    return sendJson(res, 200, {
      customer: publicCustomer(customer),
      application: publicUdhaarApplication(db, findUdhaarApplication(db, customer))
    });
  }

  if (method === "POST" && segments[0] === "api" && segments[1] === "customers" && segments[2] && segments[3] === "udhaar-request") {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    let application = findUdhaarApplication(db, customer);
    if (!application) {
      application = {
        id: `udhaar-app-${customer.id}-${crypto.randomUUID().slice(0, 4)}`,
        type: "udhaar",
        customerId: customer.id,
        phone: customer.phone,
        name: customer.name,
        status: "pending",
        note: "Customer requested monthly udhaar ledger access.",
        createdAt: nowIso()
      };
      db.rewards.applications.push(application);
    }
    application.name = customer.name;
    application.phone = customer.phone;
    application.status = application.status === "approved" ? "approved" : "pending";
    application.updatedAt = nowIso();
    await writeDb(db);
    return sendJson(res, 201, {
      customer: publicCustomer(customer),
      application: publicUdhaarApplication(db, application)
    });
  }

  if (method === "GET" && url.pathname === "/api/store") {
    return sendJson(res, 200, db.store);
  }

  if (method === "PUT" && url.pathname === "/api/store") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    db.store = { ...db.store, ...body };
    await writeDb(db);
    return sendJson(res, 200, db.store);
  }

  if (method === "GET" && url.pathname === "/api/settings") {
    return sendJson(res, 200, db.settings);
  }

  if (method === "PUT" && url.pathname === "/api/settings") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    db.settings = { ...db.settings, ...body };
    await writeDb(db);
    return sendJson(res, 200, db.settings);
  }

  if (method === "GET" && url.pathname === "/api/reviews") {
    return sendJson(res, 200, (db.reviews || []).filter((review) => review.published !== false).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
  }

  if (method === "GET" && url.pathname === "/api/admin/reviews") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, {
      reviews: (db.reviews || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      pending: (db.reviews || []).filter((review) => review.published === null || review.published === undefined).length
    });
  }

  if (method === "POST" && url.pathname === "/api/reviews") {
    const body = await readBody(req);
    const name = String(body.name || "").trim();
    const text = String(body.text || "").trim();
    const rating = Math.max(1, Math.min(5, Number(body.rating || 5)));
    if (!name) return badRequest(res, "Name is required");
    if (text.length < 20) return badRequest(res, "Please write a meaningful review of at least 20 characters");
    const review = {
      id: `review-${slug(name)}-${crypto.randomUUID().slice(0, 6)}`,
      customerId: body.customerId || null,
      name: name.slice(0, 80),
      phone: String(body.phone || "").replace(/\D/g, "").slice(0, 15),
      rating,
      text: text.slice(0, 600),
      published: null, // Requires admin approval
      createdAt: nowIso()
    };
    db.reviews = [review, ...(db.reviews || [])];
    await writeDb(db);
    return sendJson(res, 201, { review });
  }

  if (method === "PATCH" && segments[0] === "api" && segments[1] === "admin" && segments[2] === "reviews" && segments[3]) {
    if (!requireAdmin(req, res)) return;
    const review = db.reviews.find((r) => r.id === segments[3]);
    if (!review) return notFound(res);
    const body = await readBody(req);
    if (body.published !== undefined) {
      review.published = Boolean(body.published);
      review.moderatedAt = nowIso();
      review.moderatedBy = "admin";
    }
    await writeDb(db);
    return sendJson(res, 200, { review });
  }

  if (method === "DELETE" && segments[0] === "api" && segments[1] === "admin" && segments[2] === "reviews" && segments[3]) {
    if (!requireAdmin(req, res)) return;
    db.reviews = db.reviews.filter((r) => r.id !== segments[3]);
    await writeDb(db);
    return sendJson(res, 200, { ok: true });
  }

  if (method === "GET" && url.pathname === "/api/categories") {
    return sendJson(res, 200, [{ id: "all", name: "All", sort: 0 }, ...db.categories].sort((a, b) => a.sort - b.sort));
  }

  if (method === "POST" && url.pathname === "/api/categories") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    if (!body.name) return badRequest(res, "Category name is required");
    const category = {
      id: `cat-${slug(body.name)}-${crypto.randomUUID().slice(0, 4)}`,
      name: String(body.name).trim(),
      sort: Number(body.sort || db.categories.length + 1)
    };
    db.categories.push(category);
    await writeDb(db);
    return sendJson(res, 201, category);
  }

  if (method === "GET" && url.pathname === "/api/products") {
    const search = String(url.searchParams.get("search") || "").toLowerCase();
    const category = String(url.searchParams.get("category") || "all");
    const stock = String(url.searchParams.get("stock") || "all");
    const products = db.products
      .map((product) => publicProduct(db, product))
      .filter((product) => {
        const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search);
        const matchesCategory = category === "all" || category === "All" || product.categoryId === category || product.category === category;
        const matchesStock = stock === "all" || product.stockStatus === stock;
        return matchesSearch && matchesCategory && matchesStock;
      });
    return sendJson(res, 200, products);
  }

  if (method === "POST" && url.pathname === "/api/products") {
    if (!requireAdmin(req, res, ["owner", "manager", "helper"])) return;
    const body = await readBody(req);
    if (!body.name || !body.categoryId || !body.unit) return badRequest(res, "Product name, categoryId and unit are required");
    const product = {
      id: `prod-${slug(body.name)}-${crypto.randomUUID().slice(0, 4)}`,
      name: String(body.name).trim(),
      categoryId: body.categoryId,
      unit: String(body.unit).trim(),
      price: Number(body.price || 0),
      mrp: Number(body.mrp || body.price || 0),
      stock: Number(body.stock || 0),
      lowStockAt: Number(body.lowStockAt || 3),
      loose: Boolean(body.loose),
      imageUrl: body.imageUrl ? String(body.imageUrl).trim() : "",
      mark: String(body.mark || body.name[0] || "K").slice(0, 2).toUpperCase(),
      sourceNote: body.sourceNote || "Owner-entered price."
    };
    db.products.push(product);
    await writeDb(db);
    return sendJson(res, 201, publicProduct(db, product));
  }

  if (segments[0] === "api" && segments[1] === "products" && segments[2]) {
    const product = db.products.find((item) => item.id === segments[2]);
    if (!product) return notFound(res);
    if (method === "PATCH") {
      if (!requireAdmin(req, res, ["owner", "manager", "helper"])) return;
      const body = await readBody(req);
      Object.assign(product, {
        ...body,
        name: body.name === undefined ? product.name : String(body.name).trim(),
        categoryId: body.categoryId === undefined ? product.categoryId : String(body.categoryId),
        unit: body.unit === undefined ? product.unit : String(body.unit).trim(),
        imageUrl: body.imageUrl === undefined ? product.imageUrl : String(body.imageUrl || "").trim(),
        loose: body.loose === undefined ? product.loose : Boolean(body.loose),
        price: body.price === undefined ? product.price : Number(body.price),
        mrp: body.mrp === undefined ? product.mrp : Number(body.mrp),
        stock: body.stock === undefined ? product.stock : Number(body.stock),
        lowStockAt: body.lowStockAt === undefined ? product.lowStockAt : Number(body.lowStockAt)
      });
      await writeDb(db);
      return sendJson(res, 200, publicProduct(db, product));
    }
    if (method === "DELETE") {
      if (!requireAdmin(req, res, ["owner", "manager"])) return;
      db.products = db.products.filter((item) => item.id !== product.id);
      await writeDb(db);
      return sendJson(res, 200, { ok: true });
    }
  }

  if (method === "GET" && url.pathname === "/api/orders") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, db.orders.map((order) => publicOrder(db, order)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
  }

  if (method === "GET" && url.pathname === "/api/admin/orders") {
    if (!requireAdmin(req, res)) return;
    const status = url.searchParams.get("status");
    const orders = db.orders
      .filter((order) => !status || order.status === status)
      .map((order) => publicOrder(db, order))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, { orders, summary: computeSummary(db) });
  }

  if (method === "GET" && url.pathname === "/api/admin/reward-applications") {
    if (!requireAdmin(req, res)) return;
    const applications = (db.rewards.applications || [])
      .filter((application) => REWARD_TYPES.has(application.type))
      .map((application) => publicRewardApplication(db, application))
      .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
    return sendJson(res, 200, { applications });
  }

  if (method === "GET" && url.pathname === "/api/admin/udhaar-requests") {
    if (!requireAdmin(req, res)) return;
    const applications = (db.rewards.applications || [])
      .filter((application) => application.type === "udhaar")
      .map((application) => publicUdhaarApplication(db, application))
      .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
    return sendJson(res, 200, { applications });
  }

  if (method === "PATCH" && segments[0] === "api" && segments[1] === "admin" && segments[2] === "udhaar-requests" && segments[3]) {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    const status = String(body.status || "");
    if (!["approved", "rejected", "pending"].includes(status)) return badRequest(res, "Valid udhaar request status is required");
    const application = (db.rewards.applications || []).find((item) => item.type === "udhaar" && item.id === segments[3]);
    if (!application) return notFound(res);
    const customer = db.customers.find((item) => item.id === application.customerId || item.phone === application.phone);
    application.status = status;
    application.reviewedAt = nowIso();
    application.updatedAt = nowIso();
    if (status === "approved" && customer) {
      ledgerForCustomer(db, customer);
    }
    await writeDb(db);
    return sendJson(res, 200, { application: publicUdhaarApplication(db, application) });
  }

  if (method === "GET" && url.pathname === "/api/blog") {
    const published = url.searchParams.get("published") === "true";
    const posts = (db.blogPosts || [])
      .filter((post) => !published || Boolean(post.published))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return sendJson(res, 200, posts);
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "blog" && segments[2]) {
    const post = db.blogPosts?.find((p) => p.id === segments[2] || p.slug === segments[2]);
    if (!post) return notFound(res);
    if (!post.published && !requireAdmin(req, res)) return;
    return sendJson(res, 200, post);
  }

  if (method === "POST" && url.pathname === "/api/admin/blog") {
    if (!requireAdmin(req, res)) return;
    const body = await readBody(req);
    if (!body.title || !body.body) return badRequest(res, "Title and body are required");
    const post = {
      id: `blog-${slug(body.title)}-${crypto.randomUUID().slice(0, 6)}`,
      title: String(body.title).trim(),
      slug: body.slug || slug(body.title),
      excerpt: String(body.excerpt || body.body.slice(0, 150)).trim(),
      body: String(body.body).trim(),
      published: Boolean(body.published),
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    db.blogPosts = [post, ...(db.blogPosts || [])];
    await writeDb(db);
    return sendJson(res, 201, post);
  }

  if (method === "PATCH" && segments[0] === "api" && segments[1] === "admin" && segments[2] === "blog" && segments[3]) {
    if (!requireAdmin(req, res)) return;
    const post = db.blogPosts?.find((p) => p.id === segments[3]);
    if (!post) return notFound(res);
    const body = await readBody(req);
    if (body.title) post.title = String(body.title).trim();
    if (body.slug) post.slug = String(body.slug).trim();
    if (body.excerpt !== undefined) post.excerpt = String(body.excerpt).trim();
    if (body.body) post.body = String(body.body).trim();
    if (body.published !== undefined) post.published = Boolean(body.published);
    post.updatedAt = nowIso();
    await writeDb(db);
    return sendJson(res, 200, post);
  }

  if (method === "DELETE" && segments[0] === "api" && segments[1] === "admin" && segments[2] === "blog" && segments[3]) {
    if (!requireAdmin(req, res)) return;
    db.blogPosts = db.blogPosts?.filter((p) => p.id !== segments[3]) || [];
    await writeDb(db);
    return sendJson(res, 200, { ok: true });
  }

  if (method === "POST" && url.pathname === "/api/orders") {
    const body = await readBody(req);
    if (!Array.isArray(body.items) || body.items.length === 0) return badRequest(res, "At least one order item is required");
    const customer = body.customerId
      ? db.customers.find((item) => item.id === body.customerId)
      : findOrCreateCustomer(db, body.customer || body);
    if (!customer) return badRequest(res, "Customer account not found");
    const items = [];
    const stockErrors = [];
    for (const requested of body.items) {
      const product = db.products.find((item) => item.id === requested.productId || item.id === String(requested.id));
      const qty = Number(requested.qty || requested.quantity || 0);
      if (!product || qty <= 0) {
        stockErrors.push({ productId: requested.productId || requested.id, message: "Invalid product or quantity" });
        continue;
      }
      if (product.stock < qty) {
        stockErrors.push({ productId: product.id, name: product.name, requested: qty, available: product.stock });
        continue;
      }
      items.push({ productId: product.id, qty: Number(qty.toFixed(4)), price: product.price });
    }
    if (stockErrors.length) return badRequest(res, "Some items are unavailable", stockErrors);
    for (const item of items) {
      const product = db.products.find((candidate) => candidate.id === item.productId);
      product.stock = Number((product.stock - item.qty).toFixed(4));
    }
    const subtotal = Number(items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2));
    const discount = Math.min(subtotal, Math.max(0, Number(body.discount || 0)));
    const payable = Number((subtotal - discount).toFixed(2));
    if (payable < MIN_ORDER_VALUE) return badRequest(res, `Minimum online order value is ₹${MIN_ORDER_VALUE}`);
    const loyaltyEarned = Math.floor(payable * Number(db.settings.loyaltyRate || 0));
    customer.loyaltyPoints += db.settings.loyaltyEnabled ? loyaltyEarned : 0;
    customer.monthlySpend += payable;
    const paymentMode = body.paymentMode || "pay_at_store";
    const paymentStatus = paymentMode === "udhaar" ? "monthly_due" : paymentMode === "upi_online" ? "pending_online" : "due_on_pickup";
    const order = {
      id: nextOrderId(db),
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      items,
      subtotal,
      discount,
      total: payable,
      payable,
      loyaltyEarned,
      paymentMode,
      paymentStatus,
      fulfillment: "pickup",
      status: "Placed",
      timeline: [{ status: "Placed", at: nowIso(), note: "Order placed" }],
      createdAt: nowIso()
    };
    const receipt = createReceipt(db, order);
    order.receiptId = receipt.id;
    if (paymentMode === "udhaar") {
      addLedgerEntry(db, {
        customer,
        type: "debit",
        amount: payable,
        orderId: order.id,
        month: monthKey(order.createdAt),
        note: `Udhaar order ${order.id}`
      });
    }
    db.orders.push(order);
    await writeDb(db);
    return sendJson(res, 201, {
      order: publicOrder(db, order),
      customer: publicCustomer(customer),
      receipt: publicReceipt(db, receipt),
      summary: computeSummary(db),
      products: db.products.map((product) => publicProduct(db, product))
    });
  }

  if (segments[0] === "api" && segments[1] === "orders" && segments[2] && segments[3] === "status" && method === "PATCH") {
    if (!requireAdmin(req, res)) return;
    const body = await readBody(req);
    const order = db.orders.find((item) => item.id === segments[2]);
    if (!order) return notFound(res);
    const allowed = ["Placed", "Being Packed", "Ready", "Completed", "Cancelled"];
    if (!allowed.includes(body.status)) return badRequest(res, "Invalid order status", { allowed });
    order.status = body.status;
    order.updatedAt = nowIso();
    orderTimeline(order, body.status, body.note);
    const receipt = createReceipt(db, order);
    if (body.status === "Completed") {
      order.paymentStatus = order.paymentMode === "udhaar" ? "monthly_due" : "paid";
      receipt.paymentStatus = order.paymentStatus;
    }
    if (body.status === "Cancelled") {
      order.paymentStatus = "cancelled";
      receipt.paymentStatus = "cancelled";
    }
    await writeDb(db);
    return sendJson(res, 200, { order: publicOrder(db, order), receipt: publicReceipt(db, receipt), summary: computeSummary(db) });
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "orders" && segments[2]) {
    const order = db.orders.find((item) => item.id === segments[2]);
    if (!order) return notFound(res);
    const receipt = db.receipts.find((item) => item.orderId === order.id);
    return sendJson(res, 200, { order: publicOrder(db, order), receipt: receipt ? publicReceipt(db, receipt) : null });
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "receipts" && segments[2]) {
    const receipt = db.receipts.find((item) => item.id === segments[2] || item.orderId === segments[2]);
    if (!receipt) return notFound(res);
    return sendJson(res, 200, publicReceipt(db, receipt));
  }

  if (method === "POST" && url.pathname === "/api/payments") {
    if (!requireAdmin(req, res)) return;
    const body = await readBody(req);
    const order = db.orders.find((item) => item.id === body.orderId);
    if (!order) return badRequest(res, "Valid orderId is required");
    const amount = Number(body.amount || order.total || order.payable || 0);
    const payment = {
      id: `pay-${crypto.randomUUID().slice(0, 8)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount,
      method: body.method || order.paymentMode || "cash",
      status: body.status || "paid",
      reference: body.reference || "",
      createdAt: nowIso()
    };
    db.payments.push(payment);
    order.paymentStatus = payment.status === "paid" ? "paid" : payment.status;
    order.paymentMode = payment.method;
    orderTimeline(order, "Payment", `Payment ${payment.status} by ${payment.method}`);
    const receipt = createReceipt(db, order);
    receipt.paymentStatus = order.paymentStatus;
    receipt.paymentMode = order.paymentMode;
    if (payment.status === "paid") {
      const account = db.ledger.find((item) => item.customerId === order.customerId);
      if (account?.balance) {
        addLedgerEntry(db, {
          customer: db.customers.find((item) => item.id === order.customerId),
          type: "credit",
          amount,
          orderId: order.id,
          month: monthKey(order.createdAt),
          note: `Payment for ${order.id}`
        });
      }
    }
    await writeDb(db);
    return sendJson(res, 201, { payment: publicPayment(payment), order: publicOrder(db, order), receipt: publicReceipt(db, receipt) });
  }

  if (method === "POST" && url.pathname === "/api/payments/refunds") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    const order = db.orders.find((item) => item.id === body.orderId);
    if (!order) return badRequest(res, "Valid orderId is required");
    const amount = Number(body.amount || order.total || order.payable || 0);
    const payment = {
      id: `refund-${crypto.randomUUID().slice(0, 8)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount,
      method: body.method || order.paymentMode || "refund",
      status: "refunded",
      reference: body.reference || "",
      note: body.reason || "Refund recorded",
      createdAt: nowIso()
    };
    db.payments.push(payment);
    order.paymentStatus = "refunded";
    if (body.cancelOrder !== false) order.status = "Cancelled";
    orderTimeline(order, "Refund", payment.note);
    const receipt = createReceipt(db, order);
    receipt.paymentStatus = "refunded";
    await writeDb(db);
    return sendJson(res, 201, { refund: publicPayment(payment), order: publicOrder(db, order), receipt: publicReceipt(db, receipt) });
  }

  if (method === "GET" && url.pathname === "/api/admin/summary") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, computeSummary(db));
  }

  if (method === "GET" && url.pathname === "/api/ledger") {
    if (!requireAdmin(req, res)) return;
    return sendJson(res, 200, db.ledger);
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "ledger" && segments[2] === "monthly") {
    const customerId = url.searchParams.get("customerId") || url.searchParams.get("phone");
    if (!customerId) return badRequest(res, "customerId or phone is required");
    return sendJson(res, 200, monthlyStatement(db, customerId, url.searchParams.get("month") || monthKey()));
  }

  if (method === "POST" && url.pathname === "/api/ledger") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    if (!body.customerId && !body.name) return badRequest(res, "customerId or name is required");
    const amount = Number(body.amount || 0);
    if (!amount) return badRequest(res, "amount is required");
    const lookup = String(body.customerId || body.phone || "");
    const customer = db.customers.find((item) => item.id === lookup || item.phone === lookup.replace(/\D/g, ""));
    const { account, entry } = addLedgerEntry(db, {
      customer,
      name: body.name,
      phone: body.phone || body.customerId,
      type: body.type,
      amount,
      note: body.note || "Manual ledger adjustment",
      orderId: body.orderId,
      month: body.month || monthKey()
    });
    await writeDb(db);
    return sendJson(res, 201, { account, entry, statement: monthlyStatement(db, account.customerId || account.phone, body.month || monthKey()) });
  }

  if (method === "POST" && url.pathname === "/api/ledger/settle") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    const lookup = String(body.customerId || body.phone || "");
    const customer = db.customers.find((item) => item.id === lookup || item.phone === lookup.replace(/\D/g, ""));
    if (!customer) return badRequest(res, "Valid customerId or phone is required");
    const month = body.month || monthKey();
    const statement = monthlyStatement(db, customer, month);
    if (!statement.due) return sendJson(res, 200, { ok: true, entry: null, statement });
    const { account, entry } = addLedgerEntry(db, {
      customer,
      type: "credit",
      amount: statement.due,
      month,
      note: body.note || `Month-end settlement ${month}`
    });
    await writeDb(db);
    return sendJson(res, 201, { account, entry, statement: monthlyStatement(db, customer, month) });
  }

  if (method === "GET" && segments[0] === "api" && segments[1] === "loyalty" && segments[2]) {
    const customer = db.customers.find((item) => item.id === segments[2] || item.phone === segments[2]);
    if (!customer) return notFound(res);
    return sendJson(res, 200, {
      customerId: customer.id,
      name: customer.name,
      loyaltyPoints: customer.loyaltyPoints,
      monthlySpend: customer.monthlySpend,
      monthlyGiftEligible: customer.monthlySpend >= Number(db.settings.monthlyGiftThreshold || 5000)
    });
  }

  if (method === "GET" && url.pathname === "/api/rewards") {
    return sendJson(res, 200, db.rewards);
  }

  if (method === "POST" && url.pathname === "/api/rewards/draws") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    const eligible = db.customers.filter((customer) => customer.monthlySpend > 0);
    if (!eligible.length) return badRequest(res, "No eligible customers yet");
    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    const draw = {
      id: `draw-${body.month || new Date().toISOString().slice(0, 7)}-${crypto.randomUUID().slice(0, 4)}`,
      month: body.month || new Date().toISOString().slice(0, 7),
      status: "completed",
      winnerCustomerId: winner.id,
      winnerName: winner.name,
      reward: body.reward || "Store-funded grocery hamper",
      createdAt: nowIso()
    };
    db.rewards.draws.push(draw);
    await writeDb(db);
    return sendJson(res, 201, draw);
  }

  if (method === "GET" && url.pathname === "/api/blog") {
    return sendJson(res, 200, db.blogPosts);
  }

  if (method === "POST" && url.pathname === "/api/blog") {
    if (!requireAdmin(req, res, ["owner", "manager"])) return;
    const body = await readBody(req);
    if (!body.title) return badRequest(res, "Blog title is required");
    const post = {
      id: `blog-${slug(body.title)}-${crypto.randomUUID().slice(0, 4)}`,
      title: body.title,
      slug: body.slug || slug(body.title),
      excerpt: body.excerpt || "",
      body: body.body || "",
      published: Boolean(body.published),
      createdAt: nowIso()
    };
    db.blogPosts.push(post);
    await writeDb(db);
    return sendJson(res, 201, post);
  }

  return notFound(res);
}

async function serveStatic(req, res, url) {
  const appRoutes = new Set(["/", "/admin", "/admin/", "/blog", "/blog/", "/udhaar", "/udhaar/", "/gallery", "/gallery/", "/reviews", "/reviews/", "/contact", "/contact/"]);
  const requested = appRoutes.has(url.pathname) ? "/index.html" : decodeURIComponent(url.pathname);
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(__dirname, safePath);
  if (!filePath.startsWith(__dirname)) return notFound(res);
  try {
    await stat(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] || "application/octet-stream"
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("Not found");
  }
}

async function appHandler(req, res) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const server = http.createServer(appHandler);
  server.listen(PORT, HOST, () => {
    console.log(`Kushwaha Store running at http://${HOST}:${PORT}`);
  });
}

export default appHandler;
