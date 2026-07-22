const API_BASE = `${window.location.origin}/api/index`;
const storePhone = "919136278478";
const MIN_ORDER_VALUE = 29;

let categories = [
  { id: "all", name: "All" },
  { id: "cat-atta-daal-chawal", name: "Daal & Chawal" },
  { id: "cat-atta-maida-sooji-besan", name: "Atta, Maida, Sooji & Besan" },
  { id: "cat-masale", name: "Masale" },
  { id: "cat-tel-ghee", name: "Tel & Ghee" },
  { id: "cat-doodh-dairy", name: "Doodh & Dairy" },
  { id: "cat-cheeni-bura-khand", name: "Cheeni, Bura, Khand & Gud" },
  { id: "cat-basics", name: "Namak & Other Basics" },
  { id: "cat-chai-patti", name: "Chai Patti" },
  { id: "cat-nashta", name: "Nashta & Snacks" },
  { id: "cat-biscuits-namkeen", name: "Biscuits & Namkeen" },
  { id: "cat-saaf-safai", name: "Saaf-Safai" },
  { id: "cat-personal-care", name: "Personal Care" },
  { id: "cat-pooja", name: "Pooja Samagri" },
  { id: "cat-cold-drinks", name: "Cold Drinks, Water & Juices" },
  { id: "cat-festival", name: "Festival Specials" }
];

let products = [
  { id: "prod-atta-5kg", name: "Aashirvaad Atta", category: "Daal & Chawal", categoryId: "cat-atta-daal-chawal", unit: "5 kg", price: 235, stock: 11, lowStockAt: 4, mark: "A" },
  { id: "prod-arhar-1kg", name: "Arhar Daal", category: "Daal & Chawal", categoryId: "cat-atta-daal-chawal", unit: "1 kg", price: 158, stock: 4, lowStockAt: 4, mark: "D", loose: true },
  { id: "prod-chawal-5kg", name: "Basmati Chawal", category: "Daal & Chawal", categoryId: "cat-atta-daal-chawal", unit: "5 kg", price: 560, stock: 0, lowStockAt: 3, mark: "C", loose: true },
  { id: "prod-haldi-200g", name: "Haldi Powder", category: "Masale", categoryId: "cat-masale", unit: "200 g", price: 48, stock: 18, lowStockAt: 5, mark: "H", loose: true },
  { id: "prod-jeera-100g", name: "Jeera Sabut", category: "Masale", categoryId: "cat-masale", unit: "100 g", price: 62, stock: 3, lowStockAt: 4, mark: "J", loose: true },
  { id: "prod-oil-1l", name: "Fortune Kachi Ghani Oil", category: "Tel & Ghee", categoryId: "cat-tel-ghee", unit: "1 litre", price: 168, stock: 7, lowStockAt: 3, mark: "T" },
  { id: "prod-ghee-500ml", name: "Desi Ghee", category: "Tel & Ghee", categoryId: "cat-tel-ghee", unit: "500 ml", price: 340, stock: 2, lowStockAt: 3, mark: "G" },
  { id: "prod-milk-500ml", name: "Amul Doodh", category: "Doodh & Dairy", categoryId: "cat-doodh-dairy", unit: "500 ml", price: 32, stock: 22, lowStockAt: 8, mark: "M" },
  { id: "prod-sugar-1kg", name: "Cheeni Loose", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 48, stock: 30, lowStockAt: 8, mark: "C", loose: true },
  { id: "prod-uttam-sugar-1kg", name: "Uttam Sugar Packet", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 55, stock: 20, lowStockAt: 5, mark: "U" },
  { id: "prod-bura-loose-1kg", name: "Bura Loose", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 60, stock: 20, lowStockAt: 5, mark: "B", loose: true },
  { id: "prod-khand-loose-1kg", name: "Khand Loose", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 70, stock: 20, lowStockAt: 5, mark: "K", loose: true },
  { id: "prod-gud-loose-1kg", name: "Gud Loose", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 70, stock: 20, lowStockAt: 5, mark: "G", loose: true },
  { id: "prod-batashe-loose-1kg", name: "Batashe Loose", category: "Cheeni, Bura, Khand & Gud", categoryId: "cat-cheeni-bura-khand", unit: "1 kg", price: 100, stock: 15, lowStockAt: 4, mark: "B", loose: true },
  { id: "prod-namak-1kg", name: "Tata Namak", category: "Namak & Other Basics", categoryId: "cat-basics", unit: "1 kg", price: 28, stock: 8, lowStockAt: 4, mark: "N" },
  { id: "prod-poha-500g", name: "Poha", category: "Nashta & Snacks", categoryId: "cat-nashta", unit: "500 g", price: 42, stock: 6, lowStockAt: 3, mark: "P", loose: true },
  { id: "prod-namkeen-400g", name: "Haldiram Namkeen", category: "Biscuits & Namkeen", categoryId: "cat-biscuits-namkeen", unit: "400 g", price: 95, stock: 9, lowStockAt: 4, mark: "B" },
  { id: "prod-agarbatti", name: "Agarbatti", category: "Pooja Samagri", categoryId: "cat-pooja", unit: "packet", price: 35, stock: 1, lowStockAt: 3, mark: "ॐ" },
  { id: "prod-thums-up", name: "Thums Up", category: "Cold Drinks, Water & Juices", categoryId: "cat-cold-drinks", unit: "750 ml", price: 45, stock: 12, lowStockAt: 5, mark: "C" },
  { id: "prod-diwali-pack", name: "Diwali Dry Fruit Pack", category: "Festival Specials", categoryId: "cat-festival", unit: "box", price: 499, stock: 3, lowStockAt: 2, mark: "F" }
];

const fallbackBeverageProducts = (() => {
  const items = [];
  const makeId = (value) => `prod-${value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const add = (brand, unit, price, subgroup, mark = brand[0].toUpperCase()) => {
    items.push({
      id: makeId(`${brand} ${unit}`),
      name: `${brand} ${unit}`,
      category: "Cold Drinks, Water & Juices",
      categoryId: "cat-cold-drinks",
      unit,
      price,
      mrp: price,
      stock: 18,
      lowStockAt: 5,
      mark,
      subgroup
    });
  };
  const coldBrands = ["Coca Cola", "Limca", "Thums Up", "Sprite", "Fanta", "Pepsi", "Mirinda", "Mountain Dew"];
  const coldSizes = [["250 ml", 20], ["450 ml", 40], ["1 litre", 50], ["2 litre", 85]];
  coldBrands.forEach((brand) => coldSizes.forEach(([unit, price]) => add(brand, unit, price, "Cold Drinks")));
  [["150 ml tetra pack", 10], ["200 ml", 20], ["800 ml", 40], ["1 litre", 60], ["2 litre", 100]].forEach(([unit, price]) => add("Frooti", unit, price, "Juices / Frooti", "F"));
  add("Sting", "300 ml", 20, "Energy Drinks", "S");
  add("Hell", "300 ml", 60, "Energy Drinks", "H");
  add("Red Bull", "300 ml", 125, "Energy Drinks", "R");
  add("Lahori Jeera", "150 ml", 10, "Soda Drinks", "L");
  add("Nimbooz", "350 ml", 20, "Soda Drinks", "N");
  add("Arora Lemon", "250 ml", 20, "Soda Drinks", "A");
  add("Bisleri Water", "500 ml", 10, "Water", "B");
  add("Bisleri Water", "1 litre", 20, "Water", "B");
  add("Bisleri Water", "20 litre", 150, "Water", "B");
  add("Avoca Water", "1 litre", 15, "Water", "A");
  return items;
})();

products = products.filter((product) => product.id !== "prod-thums-up").concat(fallbackBeverageProducts);

let orders = [
  { id: "KS-1042", name: "Ramesh ji", total: 806, status: "Being Packed" },
  { id: "KS-1043", name: "Sita Devi", total: 312, status: "Ready" },
  { id: "KS-1044", name: "Aman Kumar", total: 1238, status: "Placed" }
];

let ledger = [
  { name: "Ramesh ji", balance: 1240 },
  { name: "Sita Devi", balance: 0 },
  { name: "Aman Kumar", balance: 420 }
];

let backendOnline = false;
let backendBootError = "";
let latestSummary = null;
let currentCustomer = null;
let customerOrders = [];
let rewardApplications = [];
let adminRewardApplications = [];
let udhaarRequest = null;
let adminUdhaarRequests = [];
let reviews = [];
let adminSession = null;
let paymentOptions = null;
let selectedLedgerMonth = new Date().toISOString().slice(0, 7);
let customerStatement = null;
let orderRefreshTimer = null;
let adminRefreshTimer = null;
let lastSeenAdminOrderId = localStorage.getItem("ksLastSeenAdminOrderId") || "";

try {
  adminSession = JSON.parse(localStorage.getItem("ksAdmin") || "null");
} catch {
  adminSession = null;
}

try {
  currentCustomer = JSON.parse(localStorage.getItem("ksCustomer") || "null");
} catch {
  currentCustomer = null;
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const currentPath = () => window.location.pathname.replace(/\/$/, "") || "/";
const openedAdminDirectlyOnPhone = currentPath() === "/admin"
  && window.matchMedia("(max-width: 760px)").matches
  && sessionStorage.getItem("ksAdminNavClick") !== "1";
if (openedAdminDirectlyOnPhone) {
  history.replaceState(null, "", "/");
}

function routeFromPath() {
  const path = currentPath();
  if (path === "/admin") return "admin";
  if (path === "/blog") return "blog";
  if (path === "/udhaar") return "udhaar";
  if (path === "/gallery") return "gallery";
  if (path === "/reviews") return "reviews";
  if (path === "/contact") return "contact";
  return "store";
}

function readJsonStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

const state = {
  category: "All",
  categoryId: "all",
  categoryFilter: "",
  showAllProducts: false,
  search: "",
  stock: "all",
  cart: new Map(),
  activeOrderId: localStorage.getItem("ksActiveOrderId") || "",
  hindi: false,
  paymentMode: "pay_at_store",
  route: routeFromPath(),
  wishlist: new Set(readJsonStorage("ksWishlist", []))
};

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const $ = (selector) => document.querySelector(selector);
const resetForm = (target) => {
  const form = typeof target === "string" ? $(target) : target;
  if (form && typeof form.reset === "function") form.reset();
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

const translations = {
  en: {
    storeName: "Kushwaha Store",
    storeShort: "KS",
    storeHomeLabel: "Kushwaha Store home",
    taglineShort: "Kinare Ka Kirana",
    taglineFull: "Kinare Ka Kirana, Bachat Ka Thikana",
    navCatalog: "Dukaan",
    navAdmin: "Admin",
    navLoyalty: "Loyalty",
    navInfo: "Info",
    navUdhaar: "Udhaar",
    navGallery: "Gallery",
    navReviews: "Reviews",
    navContact: "Contact",
    cart: "Cart",
    account: "Account",
    accountTitle: "Customer Account",
    accountLoggedOutTitle: "Login to order in your name",
    accountLoggedOutCopy: "Past orders, loyalty points, and pickup orders will show here.",
    accountLoggedInCopy: "You are ordering as",
    name: "Name",
    phone: "Phone",
    password: "Password",
    namePlaceholder: "Your name",
    phonePlaceholder: "10 digit mobile number",
    passwordPlaceholder: "At least 4 characters",
    login: "Login",
    createAccount: "Create / reset account",
    logout: "Logout",
    pastOrders: "Past Orders",
    noPastOrders: "No past orders yet. Place a pickup order and it will show here.",
    heroEyebrow: "Local kirana, now online",
    browse: "Browse samaan",
    whatsapp: "Kushwaha Store WhatsApp",
    address: "Address",
    hours: "Hours",
    call: "Call",
    pickup: "Pickup",
    readyShort: "Ready in 10-15 min",
    catalogEyebrow: "Mohalle wali shelf",
    catalogTitle: "Aaiye, Dukaan Mein Dekhiye",
    catalogCopy: "Daily groceries, stationery, cleaning supplies, pooja essentials and general-use items — reserve what you need online and pick it up from the store in 10-15 minutes.",
    search: "Search",
    searchPlaceholder: "Search atta, chai, namak...",
    stock: "Stock",
    allItems: "All items",
    inStock: "In stock",
    lowStock: "Only few left",
    outOfStock: "Out of stock",
    pickupFirst: "Pickup-first",
    orderJourney: "Simple order journey",
    orderJourneyCopy: "Customers see this same journey inside their account after placing an order.",
    orderPlaced: "Order Placed",
    orderPlacedCopy: "Cart shared by website or WhatsApp",
    beingPacked: "Being Packed",
    beingPackedCopy: "Owner checks shelf stock",
    readyPickup: "Ready for Pickup",
    readyPickupCopy: "Customer gets WhatsApp/account status update",
    completed: "Completed",
    completedCopy: "Cash/UPI at store",
    bahi: "Bahi-khata digital",
    ledger: "Udhaar Ledger",
    due: "due",
    clear: "clear",
    addAdjustment: "Add adjustment",
    signature: "Signature feature",
    ledgerTitle: "A familiar notebook, made searchable",
    ledgerCopy: "For monthly customers, each purchase can be added to the current month and paid once at month-end. Customers can see month-wise dues; admin can add entries, mark paid, or share the monthly statement.",
    totalDues: "Total dues",
    ledgerAccounts: "Ledger accounts",
    toggleReady: "Toggle ready",
    galleryEyebrow: "Chanakya Place ki purani dukaan",
    galleryTitle: "Established by Chandrama Bhagat",
    galleryCopy: "Since 1992, Kushwaha Store has served Chanakya Place with honest weighing, familiar faces, and everyday items kept ready for the neighborhood. The full store gallery is now on its own page.",
    publicRating: "public listing rating",
    ratingsSeen: "ratings seen online",
    photosListed: "store/product photos listed",
    chanakyaPlace: "Chanakya Place, Delhi",
    galleryFront: "Store Front Photo",
    galleryFrontCopy: "Main shutter and open counter",
    galleryShelves: "Shelves",
    galleryShelvesCopy: "Dabbas, packets, daily-use items",
    galleryCounter: "Counter",
    galleryCounterCopy: "Billing, UPI QR and weighing scale",
    galleryFounder: "Founder",
    galleryFounderCopy: "Chandrama Bhagat",
    galleryPageEyebrow: "Dukaan ki asli tasveerein",
    galleryPageTitle: "Store Gallery",
    galleryPageCopy: "Store front, shelves, counter, open sacks, and everyday shop moments from Kushwaha Store.",
    galleryMoreTitle: "Inside Kushwaha Store",
    reviewsEyebrow: "Mohalle ki awaaz",
    reviewsTitle: "Customer Reviews",
    reviewsCopy: "Share a meaningful review about Kushwaha Store: product quality, behavior, pickup experience, rates, or anything that helps the next customer.",
    writeReview: "Write a review",
    writeReviewCopy: "Your review appears on this page after posting.",
    reviewPhoneOptional: "Phone optional",
    reviewPhonePlaceholder: "For store follow-up only",
    reviewRating: "Rating",
    reviewText: "Review",
    reviewPlaceholder: "Write a useful review for other customers...",
    postReview: "Post review",
    customerRating: "Customer rating",
    noReviews: "No reviews yet. Be the first to write one.",
    reviewSuccess: "Thank you. Your review has been posted.",
    contactEyebrow: "Visit the dukaan",
    contactTitle: "Contact Kushwaha Store",
    contactCopy: "Call, WhatsApp, or visit the shop for pickup orders, udhaar settlement, product availability, and monthly rewards queries.",
    contactPhoneTitle: "Phone",
    contactPhoneValue: "9136278478",
    contactPhoneCopy: "Call for pickup status, product availability, or urgent order help.",
    contactWhatsappTitle: "WhatsApp",
    contactWhatsappValue: "Message Kushwaha Store",
    contactWhatsappCopy: "Best for sharing order lists and quick confirmations.",
    contactAddressTitle: "Address",
    contactAddressValue: "Chanakya Place, C-39, Part - 1, Rani Bagh, Delhi, 110059",
    contactAddressCopy: "Pickup-first store. Home delivery is coming later.",
    contactTimingsTitle: "Timings",
    contactTimingsValue: "Open daily, 6 am-10 pm",
    contactTimingsCopy: "Lunch break is usually around 2:30-4:00 pm. If the shop is closed, please call before visiting again.",
    contactPickupTitle: "Pickup",
    contactPickupValue: "Ready in 10-15 min",
    contactPickupCopy: "Minimum online reservation value is ₹29.",
    ownerPanel: "Owner phone panel",
    adminTitle: "Admin dashboard",
    adminCopy: "Made for quick taps: stock, orders, restocking, invoices, daily summary, and module toggles.",
    adminExplainerTitle: "How the shop sees orders",
    adminExplainerCopy: "Website checkout orders appear below automatically with customer name, phone, items, payable amount, payment mode, and status buttons. WhatsApp orders still open directly in Kushwaha Store WhatsApp.",
    todaySales: "Today Sales",
    lowStockTitle: "Low Stock",
    lowStockAdminCopy: "Scan barcode or add manual stock",
    bestSeller: "Best Seller",
    receipts: "Receipts",
    printable: "Printable",
    receiptsCopy: "Download, print, or share with customers",
    incomingOrders: "Incoming Orders",
    refreshOrders: "Refresh",
    adminLogin: "Admin Login",
    adminLoginCopy: "Owner/family access for orders, stock, payments and udhaar.",
    adminPhone: "Admin phone",
    adminPassword: "Admin password",
    adminUnlock: "Unlock Admin",
    adminLocked: "Login as admin to manage orders, payments, stock and udhaar.",
    adminUnlocked: "Admin unlocked",
    markPaid: "Mark Paid",
    refund: "Refund",
    cancelOrder: "Cancel",
    paymentStatus: "Payment",
    paymentDuePickup: "Due at pickup",
    paymentPendingOnline: "UPI pending",
    paymentPaid: "Paid",
    paymentFailed: "Failed",
    paymentCancelled: "Cancelled",
    paymentRefunded: "Refunded",
    paymentMonthlyDue: "Monthly udhaar due",
    receiptId: "Receipt",
    timeline: "Timeline",
    rewardsModules: "Rewards modules",
    loyaltyTitle: "Loyalty, gifts, and community rewards",
    pointsTitle: "1% Loyalty Points",
    pointsCopy: "Every order earns 1% loyalty points on total order value. Points are added to your account and can be redeemed on your next order. Contact the store for details.",
    monthlyGifts: "Monthly Shopping Gifts",
    monthlyGiftsCopy: "Customers crossing ₹5,000 monthly shopping can receive gifts at month-end. Gift details are confirmed by the store.",
    communityRewards: "Lucky Draw Program",
    communityRewardsCopy: "Enroll with ₹1,000/month. One monthly winner receives groceries worth ₹10,500, excluding dairy, ghee, atta and sugar. After 10 months, non-winners also receive groceries worth ₹10,500. Contact the store for full terms.",
    enabled: "Enabled",
    trustPages: "Trust pages",
    infoTitle: "Store details, history, FAQ, and policies",
    about: "About Us",
    aboutCopy: "Neighborhood service, honest rates, and a family-run counter that knows regular customers by name.",
    faq: "FAQ",
    faqCopy: "Pickup timing, WhatsApp orders, payment at counter, order changes, and account dues.",
    blog: "Blog",
    blogCopy: "Founder story, festival lists, bachat tips, and community posts.",
    policies: "Policies",
    policiesCopy: "Pickup, cancellation, refund, privacy, terms, udhaar, rewards, and GST invoice notes.",
    readStory: "Read story",
    viewPolicies: "View policies",
    legacy: "Legacy & History",
    legacyCopy: "Kushwaha Store began in 1992 when Chandrama Bhagat left a steady job to build apna kuch in Chanakya Place. What started as a small kirana counter became a trusted mohalla shop built on sahi cheez, sahi daam, and sahi tarazu. Today, the same legacy continues through pickup orders, digital udhaar, loyalty rewards, and a shop story that will keep growing with family photos and customer memories.",
    aboutShop: "About the Shop",
    aboutShopCopy: "Placeholder for family details, values, regular customer service, and the store's role in the neighbourhood.",
    faqLong: "Frequently Asked Questions",
    faqLongCopy: "Placeholder for pickup, returns, udhaar, receipts, online orders, and monthly account questions.",
    footer: "Serving Chanakya Place since 1992 · Pickup-first online ordering",
    tokri: "Your tokri",
    subtotal: "Subtotal",
    storeDiscount: "Store discount",
    discountLabel: "Discount",
    toPay: "To pay",
    payableLabel: "Payable",
    loyaltyEarned: "Loyalty earned",
    pointsSuffix: "pts",
    payOnline: "Pay online or at pickup",
    paymentCopy: "Scan UPI QR now or pay cash/UPI when picking up.",
    payAtPickup: "Pay at pickup",
    payAtPickupHelp: "Cash or UPI when collecting from store",
    upiNow: "UPI now",
    upiNowHelp: "Pay immediately using UPI QR/app",
    addToKhaata: "Add to khaata",
    addToKhaataHelp: "Add this order to your monthly udhaar account",
    applyForKhaata: "Apply for khaata",
    applyForKhaataHelp: "Request owner approval for monthly udhaar",
    khaataPendingTitle: "Khaata request pending",
    khaataPendingHelp: "Use Pay at pickup until admin approves",
    udhaarPaymentHelp: "First time? Tap Apply for khaata to request owner approval. After approval, future orders can go straight to khaata.",
    udhaarPaymentApprovedHelp: "Approved udhaar customers can add this order to their monthly khaata and clear dues at the store at month-end.",
    udhaarCheckoutDenied: "Udhaar checkout is available only after store approval. Please request an Udhaar Account first.",
    udhaarCheckoutPending: "Your khaata request is pending. Please use Pay at pickup or UPI now for this order.",
    udhaarCheckoutRejected: "Khaata is not approved for this account yet. Please contact the store.",
    udhaarApprovalRequested: "Khaata approval request sent to admin. For this order, please use Pay at pickup or UPI now.",
    udhaarOrderSuccess: "Order added to your khaata. Please clear the month-end due at the store.",
    paymentPending: "Payment is pending. Admin can confirm after UPI is received.",
    receiptNote: "Digital receipt is generated on-site after order placement and can be printed, downloaded later, or shared on WhatsApp.",
    activeOrderTitle: "Order placed",
    activeOrderHelp: "Your tokri is reserved with the store. Track it here until pickup is completed.",
    activeOrderPickup: "Pickup in 10-15 min",
    viewInAccount: "View in Account",
    activeOrderButton: "Order already placed",
    activeOrderWhatsapp: "Order is already with store",
    activeOrderCleared: "This order is completed. Your tokri is clear now.",
    activeOrderAddBlocked: "One order is already active. Please wait for pickup completion before changing the tokri.",
    reservedInOrder: "Reserved",
    fulfillmentNote: "Pickup only: ready in 10-15 min. Delivery is not available yet.",
    placeOrder: "Place website order",
    sendWhatsapp: "Send to Kushwaha Store WhatsApp",
    quickView: "Quick view",
    saveForLater: "Save",
    savedForLater: "Saved",
    removeSaved: "Remove saved item",
    wishlistEmpty: "No saved items yet.",
    searchSuggestions: "Suggestions",
    noSuggestions: "No matching items.",
    viewDetails: "View details",
    startShopping: "Start shopping",
    popularPicks: "Popular picks",
    quickCategoryLinks: "Quick category links",
    currentOffers: "Aaj ki bachat",
    homeOfferTitle: "Pickup orders, local prices, regular dukaan service.",
    homeOfferCopy: "Reserve samaan online, pay by UPI or at pickup, and collect from Kushwaha Store when it is ready.",
    homeQuickCopy: "Jump straight to common shelves.",
    popularPicksCopy: "Fast-moving items from the current catalog.",
    apiErrorGeneric: "Something went wrong. Please refresh and try again.",
    backendPageMissing: "Backend route is missing. Please redeploy the latest version.",
    home: "Home",
    addToTokri: "Add to tokri",
    itemWord: "item",
    itemsWord: "items",
    unavailable: "Unavailable",
    noItems: "No items found. Try another category or search.",
    chooseCategory: "Choose a category above to see matching samaan, or tap All Products if you want the full list.",
    emptyCart: "Your tokri is empty. Add rozmarra samaan from the shelf.",
    each: "each",
    websiteNeedsBackend: "Website backend is not reachable yet. Please refresh after deployment finishes.",
    customerNamePrompt: "Customer name for pickup order",
    customerPhonePrompt: "Customer phone number",
    loginBeforeOrder: "Please login or create an account so this order is saved under your name.",
    minimumOrderValue: "Minimum online order value is ₹29.",
    orderSuccess: "Stock updated and loyalty points added.",
    feedbackPrompt: "Care to drop a feedback?",
    blogPrompt: "Also, take a minute to read the story of Kushwaha Store?",
    ordersReady: "orders",
    readyForPickup: "ready for pickup",
    orderedSeed: "ordered in seed data",
    pickupOrder: "pickup order",
    apply: "Apply",
    applied: "Applied",
    eligible: "Eligible",
    notEligible: "Not eligible",
    rewardApplications: "Reward Applications",
    loginBeforeReward: "Please login or create an account before applying.",
    rewardApplySuccess: "Application saved. Admin can now check eligibility.",
    noRewardApplications: "No reward applications yet.",
    rewardLoyaltyHelp: "Login to apply from your account.",
    rewardMonthlyHelp: "Admin can verify eligibility.",
    rewardLuckyHelp: "Store will confirm enrollment.",
    udhaarRequests: "Udhaar Requests",
    udhaarRequestsCopy: "Approve monthly ledger access for trusted customers.",
    requestUdhaar: "Request Udhaar Account",
    udhaarRequestHelp: "For trusted monthly customers. Store owner approval required.",
    udhaarRequestPending: "Request sent. Store will approve after checking.",
    udhaarRequestApproved: "Udhaar account approved. Monthly ledger is active.",
    udhaarRequestRejected: "Request not approved yet. Please contact the store.",
    udhaarRequestSuccess: "Udhaar request sent to the store.",
    noUdhaarRequests: "No udhaar requests yet.",
    approve: "Approve",
    reject: "Reject",
    monthlySpendLabel: "Monthly spend",
    receipt: "Receipt",
    shareReceipt: "Share",
    reorder: "Reorder",
    reorderLastCart: "Reorder last cart",
    reorderSuccess: "Items from this order have been added to your tokri.",
    reorderUnavailable: "Some items are unavailable right now and were skipped.",
    monthLabels: ["Jul", "Aug", "Sep", "Oct"],
    markPacking: "Mark Packing",
    markReady: "Mark Ready",
    markCompleted: "Complete",
    looseQty: "Loose qty",
    addLoose: "Add loose",
    invalidQty: "Enter a valid quantity.",
    notEnoughStock: "Not enough stock for this quantity.",
    backendFallbackPayment: "Payment: Cash/UPI on pickup",
    whatsappGreeting: "Namaste Kushwaha Store,",
    whatsappIntro: "I want to place this pickup order:",
    whatsappCustomer: "Ordering customer",
    whatsappAccountId: "Account ID",
    loginBeforeWhatsapp: "Please login or create an account before sending a WhatsApp order, so the shop receives your name and contact details.",
    receiptRequest: "Namaste Kushwaha Store, please share receipt for",
    receiptTitle: "Kushwaha Store Receipt",
    receiptCustomer: "Customer",
    receiptStatus: "Status",
    receiptItem: "Item",
    receiptQty: "Qty",
    receiptTotal: "Total",
    receiptPayment: "Pickup-first digital receipt. Payment: Cash/UPI as selected."
  },
  hi: {
    storeName: "कुशवाहा स्टोर",
    storeShort: "कु",
    storeHomeLabel: "कुशवाहा स्टोर होम",
    taglineShort: "किनारे का किराना",
    taglineFull: "किनारे का किराना, बचत का ठिकाना",
    navCatalog: "दुकान",
    navAdmin: "एडमिन",
    navLoyalty: "लॉयल्टी",
    navInfo: "जानकारी",
    navUdhaar: "उधार",
    navGallery: "गैलरी",
    navReviews: "समीक्षा",
    navContact: "संपर्क",
    cart: "टोकरी",
    account: "खाता",
    accountTitle: "ग्राहक खाता",
    accountLoggedOutTitle: "अपने नाम से ऑर्डर करने के लिए लॉगिन करें",
    accountLoggedOutCopy: "पिछले ऑर्डर, लॉयल्टी पॉइंट और पिकअप ऑर्डर यहाँ दिखेंगे.",
    accountLoggedInCopy: "आप इस नंबर से ऑर्डर कर रहे हैं",
    name: "नाम",
    phone: "फोन",
    password: "पासवर्ड",
    namePlaceholder: "आपका नाम",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    passwordPlaceholder: "कम से कम 4 अक्षर",
    login: "लॉगिन",
    createAccount: "खाता बनाएं / reset करें",
    logout: "लॉगआउट",
    pastOrders: "पिछले ऑर्डर",
    noPastOrders: "अभी कोई पिछला ऑर्डर नहीं है. पिकअप ऑर्डर करेंगे तो यहाँ दिखेगा.",
    heroEyebrow: "आपकी लोकल किराना दुकान, अब ऑनलाइन",
    browse: "सामान देखें",
    whatsapp: "कुशवाहा स्टोर व्हाट्सऐप",
    address: "पता",
    hours: "समय",
    call: "कॉल",
    pickup: "पिकअप",
    readyShort: "10-15 मिनट में तैयार",
    catalogEyebrow: "मोहल्ले वाली शेल्फ",
    catalogTitle: "आइए, दुकान में देखिए",
    catalogCopy: "रोज़ के किराना items, stationery, सफाई का सामान, पूजा सामग्री और general-use चीज़ें — जो घर और दुकान दोनों में काम आएं, यहीं से reserve करके 10-15 मिनट में pickup कर लें.",
    search: "खोजें",
    searchPlaceholder: "atta, chai, namak खोजें...",
    stock: "स्टॉक",
    allItems: "सारे आइटम",
    inStock: "स्टॉक में है",
    lowStock: "थोड़ा बचा है",
    outOfStock: "स्टॉक खत्म",
    pickupFirst: "पहले पिकअप",
    orderJourney: "ऑर्डर का आसान सफर",
    orderJourneyCopy: "ग्राहक खाते में ऑर्डर के बाद यही tracking दिखेगी.",
    orderPlaced: "ऑर्डर हो गया",
    orderPlacedCopy: "वेबसाइट या व्हाट्सऐप से टोकरी भेजी गई",
    beingPacked: "पैक हो रहा है",
    beingPackedCopy: "दुकान वाला शेल्फ स्टॉक चेक करता है",
    readyPickup: "पिकअप के लिए तैयार",
    readyPickupCopy: "ग्राहक को WhatsApp/account status update मिलेगा",
    completed: "पूरा हुआ",
    completedCopy: "दुकान पर कैश/UPI",
    bahi: "डिजिटल बही-खाता",
    ledger: "उधार खाता",
    due: "बाकी",
    clear: "साफ",
    addAdjustment: "लेन-देन जोड़ें",
    signature: "खास सुविधा",
    ledgerTitle: "पुरानी बही जैसी, पर महीने के हिसाब से",
    ledgerCopy: "जो customer महीने के अंत में एक बार payment करते हैं, उनके हर महीने का हिसाब यहाँ रहेगा. Customer dues देखेगा, admin entry जोड़कर paid mark कर सकेगा.",
    totalDues: "कुल बाकी",
    ledgerAccounts: "खाते",
    toggleReady: "GST तैयार",
    galleryEyebrow: "Chanakya Place की पुरानी दुकान",
    galleryTitle: "चंद्रमा भगत द्वारा स्थापित",
    galleryCopy: "1992 से Kushwaha Store Chanakya Place में ईमानदार तौल, पहचाने हुए चेहरे और रोज़मर्रा का सामान तैयार रखकर सेवा कर रहा है. पूरी store gallery अब अपने अलग page पर है.",
    publicRating: "पब्लिक लिस्टिंग रेटिंग",
    ratingsSeen: "ऑनलाइन रेटिंग",
    photosListed: "दुकान/प्रोडक्ट फोटो listed",
    chanakyaPlace: "Chanakya Place, Delhi",
    galleryFront: "दुकान की फोटो",
    galleryFrontCopy: "मुख्य शटर और खुला counter",
    galleryShelves: "शेल्फ",
    galleryShelvesCopy: "डब्बे, पैकेट और रोज़ का सामान",
    galleryCounter: "काउंटर",
    galleryCounterCopy: "Billing, UPI QR और weighing scale",
    galleryFounder: "संस्थापक",
    galleryFounderCopy: "चंद्रमा भगत",
    galleryPageEyebrow: "दुकान की असली तस्वीरें",
    galleryPageTitle: "स्टोर गैलरी",
    galleryPageCopy: "Kushwaha Store का store front, shelves, counter, खुले बोरे और रोज़ की दुकान वाली moments.",
    galleryMoreTitle: "Kushwaha Store के अंदर",
    reviewsEyebrow: "मोहल्ले की आवाज़",
    reviewsTitle: "ग्राहक Reviews",
    reviewsCopy: "Kushwaha Store के बारे में useful review लिखें: सामान की quality, व्यवहार, pickup experience, rates या ऐसी बात जो अगले customer की मदद करे.",
    writeReview: "Review लिखें",
    writeReviewCopy: "Post करने के बाद आपका review इस page पर दिखेगा.",
    reviewPhoneOptional: "Phone optional",
    reviewPhonePlaceholder: "सिर्फ store follow-up के लिए",
    reviewRating: "Rating",
    reviewText: "Review",
    reviewPlaceholder: "दूसरे customers के लिए useful review लिखें...",
    postReview: "Review post करें",
    customerRating: "Customer rating",
    noReviews: "अभी कोई review नहीं है. पहला review आप लिखें.",
    reviewSuccess: "धन्यवाद. आपका review post हो गया.",
    contactEyebrow: "दुकान पर आइए",
    contactTitle: "कुशवाहा स्टोर संपर्क",
    contactCopy: "Pickup orders, udhaar settlement, product availability और monthly rewards queries के लिए call, WhatsApp या दुकान पर visit करें.",
    contactPhoneTitle: "फोन",
    contactPhoneValue: "9136278478",
    contactPhoneCopy: "Pickup status, product availability या urgent order help के लिए call करें.",
    contactWhatsappTitle: "WhatsApp",
    contactWhatsappValue: "Kushwaha Store को message करें",
    contactWhatsappCopy: "Order list और quick confirmation के लिए सबसे convenient.",
    contactAddressTitle: "पता",
    contactAddressValue: "Chanakya Place, C-39, Part - 1, Rani Bagh, Delhi, 110059",
    contactAddressCopy: "Pickup-first store. Home delivery बाद में आएगी.",
    contactTimingsTitle: "समय",
    contactTimingsValue: "हर दिन खुला, 6 am-10 pm",
    contactTimingsCopy: "Lunch break usually 2:30-4:00 pm के around होता है. दुकान बंद मिले तो दोबारा आने से पहले call कर लें.",
    contactPickupTitle: "पिकअप",
    contactPickupValue: "10-15 min में ready",
    contactPickupCopy: "Online reservation minimum value ₹29 है.",
    ownerPanel: "मालिक का मोबाइल पैनल",
    adminTitle: "एडमिन डैशबोर्ड",
    adminCopy: "आसान टैप के लिए बना: स्टॉक, ऑर्डर, रीस्टॉकिंग, बिल, रोज़ की बिक्री और module toggles.",
    adminExplainerTitle: "दुकान वाले orders कैसे देखेंगे",
    adminExplainerCopy: "वेबसाइट checkout orders नीचे अपने-आप दिखेंगे: ग्राहक नाम, फोन, सामान, payable amount, payment mode और status buttons. व्हाट्सऐप orders सीधे कुशवाहा स्टोर व्हाट्सऐप में खुलेंगे.",
    todaySales: "आज की बिक्री",
    lowStockTitle: "कम स्टॉक",
    lowStockAdminCopy: "बारकोड scan करें या manual stock जोड़ें",
    bestSeller: "सबसे ज्यादा बिका",
    receipts: "रसीदें",
    printable: "प्रिंट तैयार",
    receiptsCopy: "Customer को download, print या share करें",
    incomingOrders: "नए ऑर्डर",
    refreshOrders: "Refresh",
    adminLogin: "एडमिन लॉगिन",
    adminLoginCopy: "Orders, stock, payments और उधार के लिए owner/family access.",
    adminPhone: "Admin phone",
    adminPassword: "Admin password",
    adminUnlock: "Admin खोलें",
    adminLocked: "Orders, payments, stock और उधार manage करने के लिए admin login करें.",
    adminUnlocked: "Admin खुल गया",
    markPaid: "Paid mark करें",
    refund: "Refund",
    cancelOrder: "Cancel",
    paymentStatus: "Payment",
    paymentDuePickup: "Pickup पर बाकी",
    paymentPendingOnline: "UPI pending",
    paymentPaid: "Paid",
    paymentFailed: "Failed",
    paymentCancelled: "Cancelled",
    paymentRefunded: "Refunded",
    paymentMonthlyDue: "Monthly udhaar बाकी",
    receiptId: "रसीद",
    timeline: "Timeline",
    rewardsModules: "इनाम modules",
    loyaltyTitle: "लॉयल्टी, गिफ्ट और community rewards",
    pointsTitle: "1% लॉयल्टी पॉइंट",
    pointsCopy: "हर order पर total value का 1% loyalty points account में जुड़ता है. Points next order में redeem हो सकते हैं. Details के लिए store contact करें.",
    monthlyGifts: "मासिक shopping gifts",
    monthlyGiftsCopy: "₹5,000+ monthly shopping करने वाले customers को month-end gifts मिल सकते हैं. Gift details store confirm करेगा.",
    communityRewards: "Lucky Draw Program",
    communityRewardsCopy: "₹1,000/month देकर enroll करें. हर month lucky draw होगा; winner को ₹10,500 तक groceries मिलेंगी, dairy, ghee, atta और sugar exclude. 10 months बाद non-winners को भी ₹10,500 groceries मिलेंगी. Full terms के लिए store contact करें.",
    enabled: "चालू",
    trustPages: "भरोसे की जानकारी",
    infoTitle: "दुकान की जानकारी, इतिहास, सवाल और नीतियां",
    about: "हमारे बारे में",
    aboutCopy: "मोहल्ले की service, honest rates और family-run counter जो regular customers को नाम से जानता है.",
    faq: "सवाल",
    faqCopy: "पिकअप timing, व्हाट्सऐप orders, counter payment, order changes और account dues.",
    blog: "ब्लॉग",
    blogCopy: "संस्थापक की कहानी, त्योहार lists, बचत tips और community posts.",
    policies: "नीतियां",
    policiesCopy: "Pickup, cancellation, refund, privacy, terms, udhaar, rewards और GST invoice notes.",
    readStory: "कहानी पढ़ें",
    viewPolicies: "नीतियां देखें",
    legacy: "विरासत और इतिहास",
    legacyCopy: "कुशवाहा स्टोर की शुरुआत 1992 में हुई, जब चंद्रमा भगत जी ने steady job छोड़कर Chanakya Place में apna kuch बनाने का फैसला लिया. छोटा kirana counter धीरे-धीरे sahi cheez, sahi daam और sahi tarazu वाली भरोसेमंद मोहल्ले की दुकान बन गया. आज वही legacy pickup orders, digital udhaar, loyalty rewards और family/customer memories के साथ आगे बढ़ रही है.",
    aboutShop: "दुकान के बारे में",
    aboutShopCopy: "परिवार, भरोसे और मोहल्ले की सेवा से जुड़ी बातें यहां पढ़ें.",
    faqLong: "अक्सर पूछे जाने वाले सवाल",
    faqLongCopy: "पिकअप, returns, उधार, रसीद, online orders और monthly account से जुड़े जवाब.",
    footer: "1992 से Chanakya Place की सेवा · Pickup-first online ordering",
    tokri: "आपकी टोकरी",
    subtotal: "कुल सामान",
    storeDiscount: "दुकान छूट",
    discountLabel: "छूट",
    toPay: "देय राशि",
    payableLabel: "देय राशि",
    loyaltyEarned: "लॉयल्टी पॉइंट",
    pointsSuffix: "पॉइंट",
    payOnline: "ऑनलाइन या पिकअप पर भुगतान करें",
    paymentCopy: "अभी UPI QR scan करें या pickup पर Cash/UPI दें.",
    payAtPickup: "Pickup पर payment",
    payAtPickupHelp: "Store से pickup करते समय Cash या UPI दें",
    upiNow: "अभी UPI",
    upiNowHelp: "UPI QR/app से अभी payment करें",
    addToKhaata: "खाते में जोड़ें",
    addToKhaataHelp: "इस order को monthly उधार खाते में जोड़ें",
    applyForKhaata: "खाते के लिए apply करें",
    applyForKhaataHelp: "Monthly उधार के लिए owner approval request करें",
    khaataPendingTitle: "खाता request pending है",
    khaataPendingHelp: "Admin approval तक Pay at pickup use करें",
    udhaarPaymentHelp: "पहली बार? खाते के लिए apply करें. Approval के बाद future orders सीधे खाते में जुड़ेंगे.",
    udhaarPaymentApprovedHelp: "Approved उधार customers इस order को monthly खाते में जोड़ सकते हैं और month-end पर store में dues clear कर सकते हैं.",
    udhaarCheckoutDenied: "उधार checkout सिर्फ store approval के बाद available है. पहले उधार account request करें.",
    udhaarCheckoutPending: "आपकी khaata request pending है. इस order के लिए Pay at pickup या UPI now use करें.",
    udhaarCheckoutRejected: "इस account के लिए khaata अभी approve नहीं है. कृपया store contact करें.",
    udhaarApprovalRequested: "Khaata approval request admin को भेज दी गई. इस order के लिए Pay at pickup या UPI now use करें.",
    udhaarOrderSuccess: "Order आपके खाते में जोड़ दिया गया है. Month-end due store पर clear करें.",
    paymentPending: "Payment pending है. UPI मिलने के बाद admin confirm कर सकता है.",
    receiptNote: "डिजिटल रसीद ऑर्डर के बाद वेबसाइट पर बनेगी; प्रिंट, डाउनलोड या व्हाट्सऐप शेयर हो सकेगी.",
    activeOrderTitle: "Order place हो गया",
    activeOrderHelp: "आपकी टोकरी store के पास reserve है. Pickup complete होने तक status यहां देखें.",
    activeOrderPickup: "Pickup 10-15 min में",
    viewInAccount: "Account में देखें",
    activeOrderButton: "Order already placed",
    activeOrderWhatsapp: "Order store के पास है",
    activeOrderCleared: "यह order complete हो गया. आपकी टोकरी अब clear है.",
    activeOrderAddBlocked: "एक order already active है. टोकरी बदलने से पहले pickup complete होने दें.",
    reservedInOrder: "Reserved",
    fulfillmentNote: "सिर्फ pickup: order 10-15 मिनट में ready. Delivery अभी available नहीं है.",
    placeOrder: "वेबसाइट ऑर्डर करें",
    sendWhatsapp: "कुशवाहा स्टोर व्हाट्सऐप पर भेजें",
    quickView: "Details देखें",
    saveForLater: "Save करें",
    savedForLater: "Saved",
    removeSaved: "Saved item हटाएं",
    wishlistEmpty: "अभी कोई saved item नहीं है.",
    searchSuggestions: "Suggestions",
    noSuggestions: "Matching item नहीं मिला.",
    viewDetails: "Details देखें",
    startShopping: "Shopping शुरू करें",
    popularPicks: "Popular picks",
    quickCategoryLinks: "Quick category links",
    currentOffers: "आज की बचत",
    homeOfferTitle: "Pickup order, local price, aur regular dukaan service.",
    homeOfferCopy: "Samaan online reserve करें, UPI या pickup पर pay करें, और ready होने पर Kushwaha Store से collect करें.",
    homeQuickCopy: "Common shelves पर सीधे जाएं.",
    popularPicksCopy: "Current catalog के fast-moving items.",
    apiErrorGeneric: "कुछ गलत हुआ. Refresh करके दोबारा try करें.",
    backendPageMissing: "Backend route missing है. Latest version redeploy करें.",
    home: "होम",
    addToTokri: "टोकरी में जोड़ें",
    itemWord: "सामान",
    itemsWord: "सामान",
    unavailable: "उपलब्ध नहीं",
    noItems: "कोई item नहीं मिला. दूसरी category या search try करें.",
    chooseCategory: "सामान देखने के लिए ऊपर से category चुनें, या पूरी list के लिए All Products दबाएं.",
    emptyCart: "आपकी टोकरी खाली है. रोज़मर्रा सामान शेल्फ से जोड़ें.",
    each: "प्रति item",
    websiteNeedsBackend: "Website backend अभी reachable नहीं है. Deployment finish होने के बाद refresh करें.",
    customerNamePrompt: "पिकअप order के लिए ग्राहक नाम",
    customerPhonePrompt: "ग्राहक फोन नंबर",
    loginBeforeOrder: "Order आपके नाम से save करने के लिए login या खाता बनाएं.",
    minimumOrderValue: "Online order की minimum value ₹29 है.",
    orderSuccess: "स्टॉक update हो गया और लॉयल्टी पॉइंट जुड़ गए.",
    feedbackPrompt: "एक feedback देना चाहेंगे?",
    blogPrompt: "और एक मिनट निकालकर Kushwaha Store की कहानी पढ़ेंगे?",
    ordersReady: "orders",
    readyForPickup: "pickup ready",
    orderedSeed: "seed data में ordered",
    pickupOrder: "pickup order",
    apply: "Apply करें",
    applied: "Applied",
    eligible: "Eligible",
    notEligible: "Eligible नहीं",
    rewardApplications: "Reward applications",
    loginBeforeReward: "Apply करने से पहले login या account बनाएं.",
    rewardApplySuccess: "Application save हो गई. Admin eligibility check कर सकता है.",
    noRewardApplications: "अभी कोई reward application नहीं.",
    rewardLoyaltyHelp: "अपने account से apply करने के लिए login करें.",
    rewardMonthlyHelp: "Admin eligibility verify कर सकता है.",
    rewardLuckyHelp: "Store enrollment confirm करेगा.",
    udhaarRequests: "उधार requests",
    udhaarRequestsCopy: "Trusted customers के monthly ledger access को approve करें.",
    requestUdhaar: "उधार account request करें",
    udhaarRequestHelp: "Monthly payment वाले trusted customers के लिए. Owner approval जरूरी है.",
    udhaarRequestPending: "Request भेज दी गई है. Store checking के बाद approve करेगा.",
    udhaarRequestApproved: "उधार account approved है. Monthly ledger active है.",
    udhaarRequestRejected: "Request अभी approve नहीं हुई. कृपया store contact करें.",
    udhaarRequestSuccess: "उधार request store को भेज दी गई.",
    noUdhaarRequests: "अभी कोई उधार request नहीं.",
    approve: "Approve",
    reject: "Reject",
    monthlySpendLabel: "Monthly spend",
    receipt: "रसीद",
    shareReceipt: "शेयर",
    reorder: "फिर से ऑर्डर",
    reorderLastCart: "पिछली टोकरी दोहराएं",
    reorderSuccess: "इस order का सामान आपकी टोकरी में जोड़ दिया गया है.",
    reorderUnavailable: "कुछ items अभी available नहीं हैं, इसलिए skip हो गए.",
    monthLabels: ["जुलाई", "अगस्त", "सितंबर", "अक्टूबर"],
    markPacking: "Packing",
    markReady: "Ready",
    markCompleted: "Complete",
    looseQty: "Loose मात्रा",
    addLoose: "Loose जोड़ें",
    invalidQty: "सही quantity डालें.",
    notEnoughStock: "इस मात्रा के लिए stock नहीं है.",
    backendFallbackPayment: "भुगतान: पिकअप पर Cash/UPI",
    whatsappGreeting: "नमस्ते कुशवाहा स्टोर,",
    whatsappIntro: "मैं यह पिकअप order देना चाहता/चाहती हूँ:",
    whatsappCustomer: "Order करने वाले customer",
    whatsappAccountId: "Account ID",
    loginBeforeWhatsapp: "WhatsApp order भेजने से पहले login या account create करें, ताकि दुकान को आपका नाम और contact details मिलें.",
    receiptRequest: "नमस्ते कुशवाहा स्टोर, कृपया इस order की रसीद भेजें:",
    receiptTitle: "कुशवाहा स्टोर रसीद",
    receiptCustomer: "ग्राहक",
    receiptStatus: "स्थिति",
    receiptItem: "सामान",
    receiptQty: "मात्रा",
    receiptTotal: "कुल",
    receiptPayment: "पहले पिकअप वाली डिजिटल रसीद. चुने गए तरीके से Cash/UPI payment."
  }
};

function t(key) {
  return translations[state.hindi ? "hi" : "en"][key] || translations.en[key] || key;
}

const storyContent = {
  en: {
    summary: "Ek Dukaan, Ek Kahani: The Story of Kushwaha Store",
    eyebrow: "Ek Dukaan, Ek Kahani",
    title: "The Story of Kushwaha Store",
    tagline: "Kinare Ka Kirana, Bachat Ka Thikana",
    sections: [
      ["Gaon Se Shehar Tak", [
        "Every shutter has a story behind it. Ours begins in 1992, on a narrow lane in Chanakya Place, with one man, one small counter, and a decision that most people around him thought was reckless.",
        "Chandrama Bhagat was not born into business. Like thousands of others of his generation, he left his hometown and came to Delhi in search of rozi-roti: a steady job, a steady wage, a life that felt secure on paper.",
        "For a while, that is exactly what he had. A job. A salary. A routine. But routine and restlessness rarely sit well together."
      ]],
      ["Naukri Chhodi, Sapna Pakda", [
        "There is a particular kind of courage in walking away from something stable to build something uncertain. Chandrama ji had that courage. He quit his job with a quiet conviction that he wanted to build apna kuch.",
        "In 1992, with modest savings and resolve, he opened a small kirana counter in Chanakya Place: sacks of daal, tins of tel, a weighing scale, and a promise to the neighbourhood: sahi cheez, sahi daam, sahi tarazu."
      ]],
      ["Mohalle Ki Dukaan Ban Gayi Mohalle Ki Pehchaan", [
        "Regular customers stopped being just customers. They became apne log. Udhaar was written in a notebook, children came for sooji and left with a toffee, and festival lists were remembered before customers asked.",
        "This is the quiet magic of a kirana store. Morning chai patti runs, evening doodh pickups, Diwali dry fruit boxes, monsoon phenyl restocks: Kushwaha Store has been present for all of it for over three decades."
      ]],
      ["Bachat Ka Thikana", [
        "The tagline is a philosophy. Bachat means saving, but here it also means saving trust, relationships, and the kind of neighbourhood shopping that should not disappear when bigger stores move in.",
        "That same spirit sits behind the udhaar ledger, loyalty points, and lucky draw program for regulars: old-fashioned goodwill, written down and made a little more official."
      ]],
      ["Legacy Ab Digital Bhi Hai", [
        "More than 30 years later, the counter still stands in Chanakya Place with the same honesty, same tarazu, and the same shutter opened every morning.",
        "The digital catalog, month-wise udhaar ledger, and account rewards are not meant to replace the neighbourhood feeling. They are here to make sure it reaches further and lasts longer.",
        "Chandrama Bhagat started this with one simple belief: apna kaam, apni mehnat, apni pehchaan. Everything Kushwaha Store is today still stands on that."
      ]]
    ],
    note: "Have a memory of Kushwaha Store or the founder you would like to share? This page will keep growing with more photos, more stories, and more neighbourhood history."
  },
  hi: {
    summary: "एक दुकान, एक कहानी: कुशवाहा स्टोर की कहानी",
    eyebrow: "एक दुकान, एक कहानी",
    title: "कुशवाहा स्टोर की कहानी",
    tagline: "किनारे का किराना, बचत का ठिकाना",
    sections: [
      ["गांव से शहर तक", [
        "हर दुकान के शटर के पीछे एक कहानी होती है. हमारी कहानी 1992 में Chanakya Place की एक गली से शुरू हुई: एक आदमी, एक छोटा counter, और एक फैसला जिसे कई लोगों ने जोखिम समझा.",
        "चंद्रमा भगत जी व्यापार में पैदा नहीं हुए थे. अपनी पीढ़ी के हजारों लोगों की तरह वे rozi-roti की तलाश में Delhi आए: नौकरी, पगार और कागज पर सुरक्षित लगने वाली जिंदगी.",
        "कुछ समय तक यही routine था. नौकरी, salary और रोज़ का तय काम. लेकिन अंदर का सपना चुप नहीं बैठा."
      ]],
      ["नौकरी छोड़ी, सपना पकड़ा", [
        "स्थिर चीज़ छोड़कर अपना अनिश्चित काम शुरू करना अलग तरह का साहस मांगता है. चंद्रमा जी में वह साहस था. उन्होंने नौकरी छोड़ी क्योंकि वे apna kuch बनाना चाहते थे.",
        "1992 में सीमित बचत और बहुत हिम्मत के साथ उन्होंने Chanakya Place में छोटा kirana counter खोला: daal के बोरे, tel के tin, तराजू और मोहल्ले से वादा: sahi cheez, sahi daam, sahi tarazu."
      ]],
      ["मोहल्ले की दुकान, मोहल्ले की पहचान", [
        "धीरे-धीरे ग्राहक सिर्फ customer नहीं रहे, apne log बन गए. उधार notebook में लिखा जाता था, बच्चे sooji लेने आते थे और कभी-कभी toffee लेकर लौटते थे, त्योहार की list ग्राहक के पूछने से पहले याद रहती थी.",
        "यही kirana store की असली बात है. सुबह chai patti, शाम doodh pickup, Diwali dry fruit, monsoon phenyl: Kushwaha Store तीन दशक से मोहल्ले की rhythm का हिस्सा रहा है."
      ]],
      ["बचत का ठिकाना", [
        "यह tagline सिर्फ line नहीं, सोच है. Bachat का मतलब पैसा बचाना है, पर यहाँ इसका मतलब भरोसा, रिश्ते और मोहल्ले वाली shopping culture बचाना भी है.",
        "इसी भावना से udhaar ledger, loyalty points और regular customers का lucky draw program बना: पुरानी goodwill को थोड़ा official और digital रूप देना."
      ]],
      ["Legacy अब Digital भी है", [
        "30 साल से ज्यादा बाद भी counter Chanakya Place में है: वही ईमानदारी, वही tarazu और हर सुबह खुलने वाला वही shutter.",
        "Digital catalog, month-wise udhaar ledger और account rewards मोहल्ले की feeling को बदलने के लिए नहीं हैं. ये उसे और लंबे समय तक संभालने के लिए हैं.",
        "चंद्रमा भगत जी ने इसे एक belief से शुरू किया था: apna kaam, apni mehnat, apni pehchaan. आज भी Kushwaha Store उसी पर खड़ा है."
      ]]
    ],
    note: "अगर आपके पास Kushwaha Store या founder से जुड़ी कोई याद है, यह page आगे और photos, stories और मोहल्ले की history के साथ बढ़ता रहेगा."
  }
};

const policyContent = {
  en: {
    title: "Store Policies",
    sections: [
      ["Pickup Policy", ["All orders are for in-store pickup only; home delivery is not yet available and is coming soon.", "Orders are typically ready in 10-15 minutes after placing.", "Customers will be notified via WhatsApp/account status when the order is marked Ready for Pickup.", "Orders not picked up within 24 hours may be cancelled and restocked.", "Minimum order value for online reservation is ₹29."]],
      ["Cancellation Policy", ["Orders can be cancelled free of charge as long as they have not been marked Being Packed.", "Once an order is being packed, cancellation may not be possible for perishable or loose items such as dairy, loose daal, atta, and similar goods.", "To cancel, contact the store via WhatsApp or phone before pickup."]],
      ["Refund & Replacement Policy", ["Refunds/replacements are honored for damaged, expired, or incorrect items reported within 24 hours of pickup, with the item brought back to the store.", "Refunds are issued via the original payment method or as store credit; cash refunds are at the owner's discretion.", "Loose items such as grains and spices are non-returnable once weighed and packed, unless defective.", "No returns on Festival Specials or perishable dairy items unless damaged at handover."]],
      ["Udhaar Credit Ledger Policy", ["Udhaar accounts are extended at the store owner's discretion to known or regular customers.", "Monthly dues must be settled by month-end; the ledger resets each cycle.", "The store may pause udhaar privileges for accounts with repeated late settlement.", "Customers can view their month-wise statement after logging in."]],
      ["Loyalty & Rewards Policy", ["1% loyalty points are earned on order value and credited to the customer's account; redeemable on future orders.", "Monthly Shopping Gifts for ₹5,000+ monthly spend and Lucky Draw Program terms are confirmed and verified by the store owner.", "Items and eligibility are subject to change; dairy, ghee, atta, and sugar are excluded from Lucky Draw prizing.", "Loyalty points and gifts have no cash-equivalent value and cannot be transferred between accounts."]],
      ["Privacy Policy", ["Customer data collected, including name, phone number, and address for udhaar accounts, is used only for order fulfillment, udhaar tracking, and store communication.", "No data is sold or shared with third parties outside payment processing and WhatsApp order coordination.", "Customers can request account/data deletion by contacting the store."]],
      ["Terms of Use", ["Prices listed online reflect in-store rates but may vary slightly due to daily rate changes for loose grains, oil, produce, and similar goods.", "Stock availability shown online is indicative; final confirmation happens at pickup.", "The store reserves the right to refuse orders or udhaar extension at its discretion."]],
      ["GST & Invoicing", ["Kushwaha Store operates as a local retail store; GST invoices are provided where applicable based on turnover/registration status.", "Customers requiring formal GST invoices for bulk or business purchases can request this at the counter."]]
    ]
  },
  hi: {
    title: "स्टोर नीतियां",
    sections: [
      ["पिकअप नीति", ["सभी orders केवल store pickup के लिए हैं; home delivery अभी उपलब्ध नहीं है, जल्द आएगी.", "Order place करने के बाद सामान आमतौर पर 10-15 मिनट में ready हो जाता है.", "Order Ready for Pickup mark होने पर customer को WhatsApp/account status से पता चलेगा.", "24 घंटे तक pickup न होने पर order cancel करके सामान restock किया जा सकता है.", "Online reservation की minimum value ₹29 है."]],
      ["Cancellation Policy", ["Order Being Packed mark होने से पहले free cancel किया जा सकता है.", "Packing शुरू होने के बाद dairy, loose daal, atta जैसे perishable या loose items cancel करना संभव न हो सकता है.", "Cancel करने के लिए pickup से पहले WhatsApp या phone पर store contact करें."]],
      ["Refund & Replacement Policy", ["Damaged, expired या wrong item के लिए pickup के 24 घंटे के अंदर item store पर लाकर refund/replacement लिया जा सकता है.", "Refund original payment method या store credit में होगा; cash refund owner के discretion पर रहेगा.", "Loose grains/spices तौलकर pack होने के बाद non-returnable हैं, जब तक item defective न हो.", "Festival Specials और perishable dairy items handover पर damaged न हों तो return नहीं होंगे."]],
      ["उधार Credit Ledger Policy", ["Udhaar accounts केवल known/regular customers को owner के discretion पर मिलते हैं.", "Monthly dues month-end तक settle करने होंगे; ledger हर cycle में reset होगा.", "Repeated late settlement पर store udhaar सुविधा pause कर सकता है.", "Login करने के बाद customers month-wise statement देख सकते हैं."]],
      ["Loyalty & Rewards Policy", ["Order value पर 1% loyalty points customer account में जुड़ते हैं और future orders में redeem हो सकते हैं.", "₹5,000+ monthly spend पर Monthly Shopping Gifts और Lucky Draw terms store owner confirm/verify करेगा.", "Items और eligibility बदल सकती है; Lucky Draw prizing में dairy, ghee, atta और sugar शामिल नहीं हैं.", "Loyalty points और gifts cash value नहीं रखते और दूसरे account में transfer नहीं हो सकते."]],
      ["Privacy Policy", ["Customer data जैसे name, phone number और udhaar account address केवल order fulfillment, udhaar tracking और store communication के लिए use होगा.", "Payment processing और WhatsApp order coordination के अलावा data किसी third party को बेचा/share नहीं किया जाएगा.", "Customer account/data deletion के लिए store contact कर सकते हैं."]],
      ["Terms of Use", ["Online prices in-store rates को reflect करती हैं, पर loose grains, oil, produce जैसी चीज़ों में daily rate के कारण थोड़ा फर्क हो सकता है.", "Online stock availability indicative है; final confirmation pickup पर packing के समय होगी.", "Store order या udhaar extension refuse करने का अधिकार रखता है."]],
      ["GST और Invoicing", ["Kushwaha Store local retail store है; GST invoice जहां applicable हो turnover/registration status के अनुसार दिया जाएगा.", "Bulk/business purchase के लिए formal GST invoice चाहिए तो counter पर request करें."]]
    ]
  }
};

const faqContent = {
  en: {
    title: "Frequently Asked Questions",
    sections: [
      ["Ordering (Currently Pickup/In-Store Only)", [["Can I order online and pick up in-store?", "Yes. You can reserve items online and pick them up from Kushwaha Store."], ["Do you currently offer home delivery?", "Not yet. Home delivery is coming soon; for now, browse and reserve items online, then pick them up at the store."], ["Can I place an order via WhatsApp?", "Yes. The cart can be sent directly to Kushwaha Store WhatsApp with your account name and contact details."], ["How do I know when my order is ready for pickup?", "Your account shows order tracking. The owner can mark it Ready for Pickup from the admin panel."], ["Is there a minimum order value to reserve items online?", "Yes. The minimum online reservation value is ₹29 for now."]]],
      ["Order Tracking", [["What are the order status steps?", "Order Placed means the cart has been shared by website or WhatsApp. Being Packed means the owner is checking shelf stock. Ready for Pickup means the order can be collected from the store. Completed means pickup and cash/UPI payment are done."], ["Where can I see my order journey?", "After login, customers can see the order journey inside their account for each website order."]]],
      ["Payments", [["What payment methods do you accept?", "Cash and UPI are supported right now. Card/Razorpay can be added later if needed."], ["Can I pay online in advance or only at pickup?", "You can choose UPI now or pay at pickup."], ["Is it safe to pay online on your site?", "UPI opens through your phone's UPI app/QR flow. Do not share UPI PIN with anyone."], ["What if my payment failed but money was deducted?", "Contact the store with your order ID and UPI reference so the owner can verify and update payment status."], ["Can I get a refund if I return an item?", "Refunds can be recorded by the admin after checking the item and order."]]],
      ["Products & Availability", [["Do you sell loose/unpackaged items by weight?", "Yes. Loose items can be entered by custom quantity such as 50g, 200g or 1kg."], ["What if an item I reserved is out of stock when I arrive?", "The owner will confirm stock while packing and suggest a replacement or remove the item."]]],
      ["Udhaar / Khaata", [["How do I apply for udhaar?", "Login to your customer account and tap Request Udhaar Account. The store owner will approve it for trusted monthly customers."], ["How do I add an order to my khaata?", "After approval, checkout will show Add to khaata. Orders placed with this option are added to your monthly udhaar ledger."], ["How do I clear my month-end due?", "Open the Udhaar page after login to see your month-wise debit, credit/paid amount, and final due. Please clear the amount at the store at month-end."]]],
      ["Store Info", [["What are your store hours?", "The shop is open from 6 am-10 pm, Monday to Sunday. Lunch break is usually around 2:30-4:00 pm."], ["Where is the store located?", "Chanakya Place, C-39, Part - 1, Rani Bagh, Delhi, 110059, India."], ["Are you open on Sundays and holidays?", "Yes, regular listed hours are 6 am-10 pm every day, with lunch break usually around 2:30-4:00 pm. If the shop appears closed, please call or WhatsApp 9136278478 before visiting."]]],
      ["Loyalty & Offers", [["How do I earn and redeem loyalty points?", "Every order earns 1% loyalty points on the total order value. Points are added to your account and can be redeemed on your next order. For more information, please contact the store."], ["How do monthly gifts work?", "Customers crossing ₹5,000 shopping in a month can receive monthly gifts at month-end. Gift details are confirmed by the store."], ["How does the Lucky Draw program work?", "Customers can enroll by paying ₹1,000 every month. One lucky draw is taken out each month, and the winner receives products worth ₹10,500, excluding dairy, ghee, atta and sugar. The scheme runs for 10 months; at the end, customers who have not won also receive products worth ₹10,500. Please contact the store for full terms before enrolling."]]],
      ["Language & Accessibility", [["Can I use the website in Hindi?", "Yes. Use the Hindi/English toggle in the header."], ["Can I talk to someone directly about my order?", "Yes. Use the call or WhatsApp button to contact Kushwaha Store directly."]]],
      ["Returns & Support", [["What is your return/replacement policy for damaged or wrong items?", "Bring the item and order/receipt details to the store. The owner can verify and replace/refund as appropriate."], ["How do I contact customer support?", "Call 9136278478 or use the Kushwaha Store WhatsApp button."]]],
      ["Future Scope", [["When will home delivery be available?", "We're working on it. Delivery will be added in an upcoming update."]]]
    ]
  },
  hi: {
    title: "अक्सर पूछे जाने वाले सवाल",
    sections: [
      ["Ordering (अभी Pickup/In-Store Only)", [["क्या मैं online order करके store से pickup कर सकता/सकती हूं?", "हां. आप items online reserve करके Kushwaha Store से pickup कर सकते हैं."], ["क्या home delivery है?", "अभी नहीं. Home delivery जल्द आएगी; फिलहाल online browse/reserve करें और store से pickup करें."], ["क्या WhatsApp से order कर सकते हैं?", "हां. Cart सीधे Kushwaha Store WhatsApp पर आपके account name और contact details के साथ जा सकता है."], ["Order ready कैसे पता चलेगा?", "Account में order tracking दिखेगी. Owner admin panel से Ready for Pickup mark कर सकता है."], ["Minimum order value है?", "हां. Online reservation की minimum value अभी ₹29 है."]]],
      ["Order Tracking", [["Order status steps क्या हैं?", "Order Placed का मतलब cart website या WhatsApp से share हो गया. Being Packed का मतलब owner shelf stock check कर रहा है. Ready for Pickup का मतलब order store से collect किया जा सकता है. Completed का मतलब pickup और cash/UPI payment complete हो गए."], ["Order journey कहां दिखेगी?", "Login के बाद customers अपने account में हर website order की journey देख सकते हैं."]]],
      ["Payments", [["Payment methods क्या हैं?", "अभी Cash और UPI supported हैं. Card/Razorpay बाद में जरूरत पड़े तो add हो सकता है."], ["Advance online pay कर सकते हैं या pickup पर?", "आप UPI now या pickup पर payment choose कर सकते हैं."], ["Online payment safe है?", "UPI आपके phone के UPI app/QR flow से खुलता है. UPI PIN किसी से share न करें."], ["Payment failed पर पैसा कट गया तो?", "Order ID और UPI reference के साथ store contact करें ताकि owner verify करके payment status update कर सके."], ["Return पर refund मिलेगा?", "Item और order check करने के बाद admin refund record कर सकता है."]]],
      ["Products & Availability", [["क्या loose/unpackaged items weight से मिलते हैं?", "हां. Loose items में 50g, 200g या 1kg जैसी custom quantity डाल सकते हैं."], ["Reserved item out of stock निकला तो?", "Owner packing के समय stock confirm करेगा और replacement suggest करेगा या item remove करेगा."]]],
      ["उधार / खाता", [["उधार के लिए apply कैसे करें?", "Customer account में login करके Request Udhaar Account दबाएं. Store owner trusted monthly customers के लिए approve करेगा."], ["Order खाते में कैसे जोड़ें?", "Approval के बाद checkout में खाते में जोड़ें option दिखेगा. इस option से placed order monthly udhaar ledger में जुड़ जाएगा."], ["Month-end due कैसे clear करना है?", "Login के बाद Udhaar page पर month-wise debit, credit/paid amount और final due दिखेगा. Month-end पर store में amount clear करें."]]],
      ["Store Info", [["Store hours क्या हैं?", "दुकान Monday-Sunday 6 am-10 pm खुली रहती है. Lunch break usually 2:30-4:00 pm के around होता है."], ["Store कहां है?", "Chanakya Place, C-39, Part - 1, Rani Bagh, Delhi, 110059, India."], ["Sundays और holidays पर खुले हैं?", "हां, regular timing हर दिन 6 am-10 pm है. Lunch break usually 2:30-4:00 pm. अगर दुकान बंद मिले तो आने से पहले 9136278478 पर call/WhatsApp करें."]]],
      ["Loyalty & Offers", [["Loyalty points कैसे मिलेंगे?", "हर order की total value पर 1% loyalty points account में जुड़ेंगे और next order में redeem हो सकते हैं. ज्यादा जानकारी के लिए store contact करें."], ["Monthly gifts कैसे मिलेंगे?", "महीने में ₹5,000 shopping cross करने वाले customers को month-end gifts मिल सकते हैं. Gift details store confirm करेगा."], ["Lucky Draw program कैसे काम करता है?", "Customer हर month ₹1,000 देकर enroll कर सकते हैं. हर month lucky draw होगा और winner को ₹10,500 तक products मिलेंगे, dairy, ghee, atta और sugar छोड़कर. Scheme 10 months चलेगी; अंत में जिन customers को कुछ नहीं मिला उन्हें भी ₹10,500 तक products मिलेंगे. Full terms के लिए store contact करें."]]],
      ["Language & Accessibility", [["क्या website Hindi में use कर सकते हैं?", "हां. Header में Hindi/English toggle use करें."], ["क्या order के बारे में सीधे बात कर सकते हैं?", "हां. Call या WhatsApp button से Kushwaha Store directly contact करें."]]],
      ["Returns & Support", [["Damaged या wrong item की return policy क्या है?", "Item और order/receipt details store पर लेकर आएं. Owner verify करके replacement/refund करेगा."], ["Customer support कैसे contact करें?", "9136278478 पर call करें या Kushwaha Store WhatsApp button use करें."]]],
      ["Future Scope", [["Home delivery कब आएगी?", "इस पर काम चल रहा है. Delivery upcoming update में add होगी."]]]
    ]
  }
};

function renderStoryContent() {
  const content = storyContent[state.hindi ? "hi" : "en"];
  const dropdown = document.querySelector(".story-dropdown");
  if (!dropdown) return;
  dropdown.querySelector("summary").textContent = content.summary;
  dropdown.querySelector(".story-paper").innerHTML = `
    <p class="eyebrow">${content.eyebrow}</p>
    <h1>${content.title}</h1>
    <p class="story-tagline">${content.tagline}</p>
    ${content.sections.map(([heading, paragraphs]) => `
      <h2>${heading}</h2>
      ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    `).join("")}
    <p class="story-note">${content.note}</p>
  `;
}

function renderDetailsPanel(selector, content, type) {
  const panel = document.querySelector(selector);
  if (!panel) return;
  panel.innerHTML = `
    <h3>${content.title}</h3>
    ${content.sections.map(([heading, rows]) => `
      <details>
        <summary>${heading}</summary>
        ${type === "faq"
          ? `<div class="faq-list">${rows.map(([question, answer]) => `<p><strong>${question}</strong><span>${answer}</span></p>`).join("")}</div>`
          : `<ul>${rows.map((item) => `<li>${item}</li>`).join("")}</ul>`}
      </details>
    `).join("")}
  `;
}

function renderLongInfoContent() {
  renderStoryContent();
  renderDetailsPanel(".policy-panel", policyContent[state.hindi ? "hi" : "en"], "policy");
  renderDetailsPanel(".faq-panel", faqContent[state.hindi ? "hi" : "en"], "faq");
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
  const category = String(product.category || "").toLowerCase();
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
    { test: /ariel detergent powder|arial detergent powder/, url: "https://imgs.search.brave.com/c7eKuCsQu-AWrbohTiCP6dptIOQ1WMvhhVcxZgmo-Z4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFENUxmQ3VtWUwu/anBn" },
    { test: /rin detergent powder|rin detergent/, url: "https://imgs.search.brave.com/YQBqT_2r0UJ5zj128Zf2v0fQq8emEwKaovzxY7GtMRA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3RhcnF1aWsuY29t/L2Nkbi9zaG9wL2Zp/bGVzL1NRMTAyNTA5/X0ZPUF8xN2FlZWYz/NS02NGRkLTRkMzgt/ODdiNS1mZjQxMzg0/ZjM2MTguanBnP3Y9/MTc3Njg0NzMxNCZ3/aWR0aD0xNDQ1" },
    { test: /surf excel easy wash detergent powder/, url: "https://imgs.search.brave.com/SyKGkC6nrut-T_NGRIwW8c6QbWb_2t4ZlFDXqpT20C0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cGFuY2hhbXJ1dGhh/LmNvbS9jZG4vc2hv/cC9maWxlcy9TY3Jl/ZW5zaG90XzIxMi5w/bmc_dj0xNzU0OTIw/NjU0JndpZHRoPTc0/Mg" },
    { test: /surf excel quick wash detergent powder/, url: "https://imgs.search.brave.com/RqH107fpGLWGuZFgZqUJ0bloxucpv9CF6X7IjON2P28/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIyLzkv/RlgvWEEvR0MvNDI0/MDE5MjUvc3VyZi1l/eGNlbC1kZXRlcmdl/bnQtcG93ZGVyLTUw/MHg1MDAuanBn" },
    { test: /tide detergent powder/, url: "https://imgs.search.brave.com/Q8kzfRt-Qpdp4qA6tyE81nrXmrVXoFTdrkzfTOgK3Fc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFPb2FvbkVKOUwu/anBn" },
    { test: /wheel green detergent powder|wheel green/, url: "https://imgs.search.brave.com/ZljZkY8e70GToPSf79nDP1iUvub1YQ4C-j4s0FpzsI0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/ODU4L2FjdGl2ZS13/aGVlbC0yLWluLTEt/c3BhcmtsaW5nLXJh/cGlkLXdhc2hlZC1k/ZXRlcmdlbnQtcG93/ZGVyLWZvci1jbG90/aGVzLTI5OS5qcGc" },
    { test: /wheel blue detergent powder|wheel blue/, url: "https://imgs.search.brave.com/hUmPL8O9ucPE39kyKQ6GzJYXRQMldqmXVRmQwpmQ0dA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI1LzEy/LzU3MDA4MDQ1NC9K/S9FQy9aWi8xMzY1/ODc3MzEvMWtnLWFj/dGl2ZS13aGVlbC1k/ZXRlcmdlbnQtcG93/ZGVyLTUwMHg1MDAu/anBn" },
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
    { test: /surf excel easy wash detergent powder/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Surf+Excel+Easy+Wash" },
    { test: /surf excel quick wash detergent powder/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Surf+Excel+Quick+Wash" },
    { test: /rin detergent powder/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Rin+Powder" },
    { test: /tide detergent powder/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Tide+Powder" },
    { test: /ariel|arial/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Ariel+Powder" },
    { test: /wheel blue/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Wheel+Blue" },
    { test: /wheel green/, url: "https://placehold.co/640x480/fff8e8/111d4a/png?text=Wheel+Green" },
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

// Cache for product images to improve performance
const imageCache = new Map();
const brokenProductImages = new Set();

function isPlaceholderImage(url) {
  return /placehold\.co/i.test(String(url || ""));
}

function productFallbackImage(product) {
  const categoryId = product?.categoryId || "";
  const subgroup = productSubgroup(product);
  if (/tooth|personal care/i.test(subgroup)) return categoryCoverImages.toothpaste;
  if (/soap|handwash/i.test(subgroup)) return categoryCoverImages.soapsHandwash;
  if (/shampoo/i.test(subgroup)) return categoryCoverImages.shampooConditioner;
  if (/dals/i.test(subgroup)) return categoryCoverImages.dals;
  if (/rice/i.test(subgroup)) return categoryCoverImages.rice;
  if (/cold drink|juice/i.test(subgroup)) return categoryCoverImages.coldDrinksJuices;
  if (/water/i.test(subgroup)) return categoryCoverImages.water;
  if (/tea|coffee/i.test(subgroup)) return categoryCoverImages.teaCoffee;
  if (/biscuit/i.test(subgroup)) return categoryCoverImages.biscuits;
  if (/noodle|pasta/i.test(subgroup)) return categoryCoverImages.noodlesPasta;
  if (/chocolate|candy/i.test(subgroup)) return categoryCoverImages.chocolates;
  if (/laundry|dishwash|cleaner|freshener|mosquito|pest/i.test(subgroup)) return categoryCoverImages.homeCare;
  if (categoryId === "cat-masale") return categoryCoverImages.powderedSpices;
  if (categoryId === "cat-tel-ghee") return categoryCoverImages.oilGhee;
  if (categoryId === "cat-cheeni-bura-khand") return categoryCoverImages.sugarJaggery;
  if (categoryId === "cat-basics") return categoryCoverImages.salt;
  if (categoryId === "cat-chai-patti") return categoryCoverImages.teaCoffee;
  if (categoryId === "cat-nashta") return categoryCoverImages.healthDrinks;
  if (categoryId === "cat-biscuits-namkeen") return categoryCoverImages.biscuits;
  if (categoryId === "cat-saaf-safai") return categoryCoverImages.homeCare;
  if (categoryId === "cat-personal-care") return categoryCoverImages.soapsHandwash;
  if (categoryId === "cat-pooja") return categoryCoverImages.pooja;
  if (categoryId === "cat-cold-drinks") return categoryCoverImages.coldDrinksJuices;
  if (categoryId === "cat-doodh-dairy") return categoryCoverImages.dairy;
  return "./assets/kirana-hero.png";
}

function getCachedImageUrl(product) {
  if (imageCache.has(product.id)) {
    return imageCache.get(product.id);
  }
  const url = productImageUrl(product);
  imageCache.set(product.id, url);
  return url;
}

function catalogImageUrl(product) {
  if (brokenProductImages.has(product.id)) return productFallbackImage(product);
  const url = getCachedImageUrl(product);
  return isPlaceholderImage(url) ? productFallbackImage(product) : url;
}

function unitMeta(product) {
  const match = String(product.unit || "").toLowerCase().match(/([\d.]+)?\s*(kg|g|gram|grams|litre|liter|l|ml)/);
  if (!match) return { kind: "count", baseAmount: 1, displayUnit: product.unit || "piece", inputUnits: ["piece"] };
  const value = Number(match[1] || 1);
  const unit = match[2];
  if (unit === "kg") return { kind: "weight", baseAmount: value * 1000, displayUnit: "g", inputUnits: ["g", "kg"] };
  if (unit === "g" || unit === "gram" || unit === "grams") return { kind: "weight", baseAmount: value, displayUnit: "g", inputUnits: ["g", "kg"] };
  if (unit === "litre" || unit === "liter" || unit === "l") return { kind: "volume", baseAmount: value * 1000, displayUnit: "ml", inputUnits: ["ml", "litre"] };
  return { kind: "volume", baseAmount: value, displayUnit: "ml", inputUnits: ["ml", "litre"] };
}

function amountToProductQty(product, amount, inputUnit) {
  const meta = unitMeta(product);
  let baseAmount = Number(amount);
  if (!Number.isFinite(baseAmount) || baseAmount <= 0) return 0;
  if (inputUnit === "kg" || inputUnit === "litre") baseAmount *= 1000;
  return Number((baseAmount / meta.baseAmount).toFixed(4));
}

function formatQuantity(product, qty) {
  if (!product?.loose) {
    return `${Number(qty).toLocaleString("en-IN")} ${Number(qty) === 1 ? t("itemWord") : t("itemsWord")}`;
  }
  const meta = unitMeta(product);
  const baseAmount = Number((qty * meta.baseAmount).toFixed(2));
  if (meta.kind === "weight") {
    return baseAmount >= 1000 ? `${Number((baseAmount / 1000).toFixed(2)).toLocaleString("en-IN")} kg` : `${baseAmount.toLocaleString("en-IN")} g`;
  }
  if (meta.kind === "volume") {
    return baseAmount >= 1000 ? `${Number((baseAmount / 1000).toFixed(2)).toLocaleString("en-IN")} litre` : `${baseAmount.toLocaleString("en-IN")} ml`;
  }
  return `${qty} ${meta.displayUnit}`;
}

function looseControls(product) {
  if (!product.loose) return "";
  const meta = unitMeta(product);
  const isLooseAtta = product.id === "prod-loose-atta-1kg";
  const defaultQty = isLooseAtta ? 1 : meta.kind === "weight" ? 100 : meta.kind === "volume" ? 100 : 1;
  const defaultUnit = isLooseAtta ? "kg" : meta.displayUnit;
  return `
    <div class="loose-controls">
      ${isLooseAtta ? `
        <label class="loose-quick">
          <span>Quick size</span>
          <select data-loose-quick="${product.id}">
            <option value="1" selected>1 kg</option>
            <option value="2">2 kg</option>
            <option value="5">5 kg</option>
            <option value="10">10 kg</option>
            <option value="custom">Custom</option>
          </select>
        </label>
      ` : ""}
      <label>
        <span>${t("looseQty")}</span>
        <input type="number" min="1" step="1" value="${defaultQty}" inputmode="decimal" data-loose-value="${product.id}" />
      </label>
      <select data-loose-unit="${product.id}">
        ${meta.inputUnits.map((unit) => `<option value="${unit}" ${unit === defaultUnit ? "selected" : ""}>${unit}</option>`).join("")}
      </select>
    </div>
  `;
}

async function api(path, options = {}, meta = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (meta.admin && adminSession?.token) {
    headers.Authorization = `Bearer ${adminSession.token}`;
  }
  const response = await fetch(`${API_BASE}?path=${encodeURIComponent(path)}`, {
    headers,
    ...options
  });
  const raw = await response.text();
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { error: raw || `Unexpected non-JSON response from ${path}` };
  }
  if (!response.ok) {
    throw new Error(friendlyApiError(response.status, payload.error || raw, path));
  }
  if (payload?.error && !raw.trim().startsWith("{") && !raw.trim().startsWith("[")) {
    throw new Error(payload.error);
  }
  return payload;
}

function friendlyApiError(status, error, path) {
  const message = String(error || "");
  if (status === 404 || /page could not be found|NOT_FOUND/i.test(message)) {
    return `${t("backendPageMissing")} (${path})`;
  }
  if (/JWT issued at future/i.test(message)) {
    return "Supabase clock/token issue. Wait 1 minute, refresh, and try again.";
  }
  if (/ENOENT|seed\.json/i.test(message)) {
    return "Backend seed file is missing in deployment. Redeploy the latest committed project.";
  }
  if (/Phone logins are disabled/i.test(message)) {
    return "Use the website account form, not Supabase phone OTP login.";
  }
  if (/Invalid admin credentials/i.test(message)) {
    return "Invalid admin credentials. Use phone 9136278478 and password 1234.";
  }
  return message || t("apiErrorGeneric");
}

function friendlyOrderError(error) {
  const message = String(error?.message || "");
  if (/Supabase|foreign key|constraint|order_items|orders|JWT|PGRST/i.test(message)) {
    return "Order save had a temporary server issue. Please try once more, or send the order on WhatsApp.";
  }
  return message || "Something went wrong. Please try again.";
}

function saveAdminSession(session) {
  adminSession = session || null;
  if (adminSession) localStorage.setItem("ksAdmin", JSON.stringify(adminSession));
  else localStorage.removeItem("ksAdmin");
  renderAdminGate();
}

function renderAdminGate() {
  const admin = document.querySelector("#admin");
  if (!admin) return;
  admin.classList.toggle("admin-unlocked", Boolean(adminSession?.token));
  admin.classList.toggle("admin-locked", !adminSession?.token);
  const status = admin.querySelector(".admin-login-panel small");
  if (status) status.textContent = adminSession?.admin ? `${t("adminUnlocked")} · ${adminSession.admin.role}` : t("adminLocked");
}

function selectedPaymentMode() {
  return document.querySelector('input[name="paymentMode"]:checked')?.value || state.paymentMode || "pay_at_store";
}

function isUdhaarApproved() {
  return Boolean(currentCustomer && udhaarRequest?.status === "approved");
}

function updatePaymentModeLabels() {
  const labels = document.querySelectorAll("#paymentModes label");
  const udhaarCopy = isUdhaarApproved()
    ? { title: t("addToKhaata"), help: t("addToKhaataHelp") }
    : udhaarRequest?.status === "pending"
      ? { title: t("khaataPendingTitle"), help: t("khaataPendingHelp") }
      : { title: t("applyForKhaata"), help: t("applyForKhaataHelp") };
  const values = {
    pay_at_store: { title: t("payAtPickup"), help: t("payAtPickupHelp") },
    upi_online: { title: t("upiNow"), help: t("upiNowHelp") },
    udhaar: udhaarCopy
  };
  labels.forEach((label) => {
    const input = label.querySelector("input");
    label.textContent = "";
    if (!input) return;
    const copy = values[input.value] || { title: input.value, help: "" };
    const text = document.createElement("span");
    text.className = "payment-option-copy";
    text.innerHTML = `<strong>${copy.title}</strong>${copy.help ? `<small>${copy.help}</small>` : ""}`;
    label.append(input, text);
  });
}

function renderPaymentModes() {
  const approved = isUdhaarApproved();
  const udhaarLabel = $("#udhaarPaymentMode");
  const udhaarInput = udhaarLabel?.querySelector("input");
  const help = $("#udhaarPaymentHelp");
  if (udhaarLabel) udhaarLabel.hidden = false;
  if (udhaarInput) udhaarInput.disabled = false;
  if (!approved && selectedPaymentMode() === "udhaar") {
    const pickup = document.querySelector('input[name="paymentMode"][value="pay_at_store"]');
    if (pickup) pickup.checked = true;
    state.paymentMode = "pay_at_store";
  }
  if (help) {
    help.textContent = approved
      ? t("udhaarPaymentApprovedHelp")
      : udhaarRequest?.status === "pending"
        ? t("udhaarCheckoutPending")
        : udhaarRequest?.status === "rejected"
          ? t("udhaarCheckoutRejected")
          : t("udhaarPaymentHelp");
  }
  updatePaymentModeLabels();
}

function selectPayAtPickup() {
  const pickup = document.querySelector('input[name="paymentMode"][value="pay_at_store"]');
  if (pickup) pickup.checked = true;
  state.paymentMode = "pay_at_store";
  renderPaymentModes();
}

async function handleUdhaarPaymentChoice() {
  if (isUdhaarApproved()) return true;
  selectPayAtPickup();
  if (!currentCustomer) {
    alert(t("loginBeforeOrder"));
    $("#accountDrawer").classList.add("open");
    renderAccount();
    return false;
  }
  if (udhaarRequest?.status === "pending") {
    alert(t("udhaarCheckoutPending"));
    return false;
  }
  if (udhaarRequest?.status === "rejected") {
    alert(t("udhaarCheckoutRejected"));
    return false;
  }
  await requestUdhaarAccount({ successMessage: t("udhaarApprovalRequested") });
  return false;
}

function highlightPaymentOptions() {
  const paymentModes = $("#paymentModes");
  if (!paymentModes) return;
  paymentModes.scrollIntoView({ behavior: "smooth", block: "center" });
  paymentModes.classList.remove("payment-attention");
  void paymentModes.offsetWidth;
  paymentModes.classList.add("payment-attention");
  window.setTimeout(() => paymentModes.classList.remove("payment-attention"), 1000);
}

async function refreshPaymentOptions() {
  if (!backendOnline) return;
  const totals = checkoutTotals(cartLines());
  try {
    paymentOptions = await api(`/payments/options?amount=${encodeURIComponent(totals.payable)}`);
    const qr = $("#upiQrLink");
    if (qr && paymentOptions.upiQrUrl) {
      qr.href = paymentOptions.upiIntentUrl || "#";
      qr.classList.add("has-qr");
      qr.innerHTML = `<img src="${paymentOptions.upiQrUrl}" alt="UPI QR for Kushwaha Store" onerror="this.onerror=null;this.src='${paymentOptions.generatedUpiQrUrl || paymentOptions.upiQrUrl}'" />`;
    }
  } catch {
    paymentOptions = null;
  }
}

function normalizeBootstrap(payload) {
  backendOnline = true;
  if (payload.categories?.length) categories = payload.categories;
  if (payload.products?.length) products = payload.products;
  reviews = payload.reviews || reviews;
  if (payload.orders?.length) orders = payload.orders;
  if (payload.ledger?.length) ledger = payload.ledger;
  latestSummary = payload.summary || latestSummary;
  renderAdminSummary(payload.summary);
  renderLedger();
  renderReviews();
  renderHomeSections();
}

function saveCustomer(customer) {
  currentCustomer = customer || null;
  if (currentCustomer) localStorage.setItem("ksCustomer", JSON.stringify(currentCustomer));
  else localStorage.removeItem("ksCustomer");
}

async function loadBackendData() {
  try {
    const payload = await api("/bootstrap");
    backendBootError = "";
    normalizeBootstrap(payload);
  } catch (error) {
    backendBootError = error.message || "Backend data did not load";
    try {
      await api("/health");
      backendOnline = true;
    } catch {
      backendOnline = false;
    }
  }
}

async function ensureBackendOnline() {
  if (backendOnline) return true;
  try {
    await api("/health");
    backendOnline = true;
    return true;
  } catch {
    alert(backendBootError || t("websiteNeedsBackend"));
    return false;
  }
}

function stockText(product) {
  const lowStockAt = Number(product.lowStockAt || 4);
  if (product.stock === 0) return { label: t("outOfStock"), cls: "out" };
  if (product.stock <= lowStockAt) return { label: state.hindi ? `सिर्फ ${product.stock} बचे` : `Only ${product.stock} left`, cls: "low" };
  return { label: t("inStock"), cls: "in" };
}

function paymentStatusInfo(status) {
  const key = String(status || "due_on_pickup");
  const labels = {
    due_on_pickup: t("paymentDuePickup"),
    pending_online: t("paymentPendingOnline"),
    paid: t("paymentPaid"),
    failed: t("paymentFailed"),
    cancelled: t("paymentCancelled"),
    refunded: t("paymentRefunded"),
    monthly_due: t("paymentMonthlyDue")
  };
  const cls = key === "paid"
    ? "paid"
    : key === "failed" || key === "cancelled" || key === "refunded"
      ? "out"
      : "due";
  return { label: labels[key] || key.replaceAll("_", " "), cls };
}

function categoryById(id) {
  return categories.find((category) => category.id === id);
}

const categoryCoverImages = {
  allProducts: "https://imgs.search.brave.com/ScnkFzqB1uj2pwsOIVtgM8xPe4DcSUxB0H5gxUAIW48/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzI2/MjQ2OS9wZXhlbHMt/cGhvdG8tNzI2MjQ2/OS5qcGVnP2NzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw",
  powderedSpices: "https://imgs.search.brave.com/aeM8Tak3Ohne2tEL4MJS93-BqtQsLnwfHKUR9O1QOX4/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhLzFi/MTZlYTUxLWFmNzIt/NDU0Ny1iODZjLWI0/ZTgwZGIyYTEzYy5f/X0NSMCwwLDk3MCwz/MDBfUFQwX1NYOTcw/X1YxX19fLmpwZw",
  wholeSpices: "https://imgs.search.brave.com/-t-T32QWNALkyYc4JWTbvzZVtjQgMOJ8ZCPU7XU_heU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jcGlt/Zy50aXN0YXRpYy5j/b20vMTE3Nzg3NDYv/Yi80L01peC1XaG9s/ZS1TcGljZXMuLndl/YnA",
  dryFruitsNuts: "https://imgs.search.brave.com/0lH4LgKgCTmpZO4blhGnZFJK9NNXgB6YDUQsAp5mluY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L2ZyZWUtcGhvdG8v/dG9wLXZpZXctZGlm/ZmVyZW50LW51dHMt/d2l0aC1yYWlzaW5z/LWRyaWVkLWZydWl0/cy1ncmV5LWJhY2tn/cm91bmQtbnV0LXNu/YWNrLXJhaXNpbi1k/cnktZnJ1aXQtbnV0/c18xNDA3MjUtNjQ2/MjUuanBnP2dhPUdB/MS4xLjE5ODE2OTk5/ODUuMTc4MjM5Nzk3/NyZzZW10PWFpc19o/eWJyaWQmdz03NDAm/cT04MA",
  rice: "https://imgs.search.brave.com/pLlKcw-X0ndkkTqOkZtZjuBS1xu87mBfgDJ57QLDOZE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTEv/MTQyLzU3OS9zbWFs/bC9pbmRpYW4tY3Vp/c2luZS1zdGVhbWVk/LWJhc21hdGktcmlj/ZS1waG90by5qcGc",
  attaMaidaSoojiBesan: "https://imgs.search.brave.com/YeT1nYf-S70SmyedAH3GnZc1UfZcTuM4WyEvt7jR1cQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90d29i/cm90aGVyc2Zvb2Qu/Y29tL2Nkbi9zaG9w/L2FydGljbGVzL0Rl/c2lnbl8zLnBuZz92/PTE3ODIzMDY0Mzcm/d2lkdGg9MTUwMA",
  dals: "https://imgs.search.brave.com/VGKppCQpOICj9oqxxuP2FhM_sPJOJvzVLW9T536U4tE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9vb29m/YXJtcy5jb20vY2Ru/L3Nob3AvZmlsZXMv/T09PX0Zhcm1zX0Rh/bF9XaG9sZV9HcmFp/bi5qcGc_dj0xNzI3/MTAwODk2JndpZHRo/PTE1MDA",
  oilGhee: "https://imgs.search.brave.com/OX5jKsyvk5L1nktO_8tucUzVHVb92krAjdNhjqcr31o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzA1/NjYvNjIyNi8xODk3/L2ZpbGVzL0doZWVf/YW5kX29pbF9wcmVw/YXJhdGlvbl90ZWNo/bmlxdWVzXzQ4MHg0/ODAuanBnP3Y9MTY4/MjY1NTMwMw",
  sugarJaggery: "https://imgs.search.brave.com/fHCdHkbl0nBazKf_wOMr6jRP-v5vLDLWbS7rmCKTYH8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vYmxvZy50/aGVheXVydmVkYWV4/cGVyaWVuY2UuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzA4L0phZ2dlcnl2/c1N1Z2FyLndlYnA_/Zml0PTEyMDAsNTUw/JnNzbD0x",
  salt: "https://imgs.search.brave.com/Vs1g13aVWSkb5sFlA8vfg92LCBkLDXXmXHFU8z5bKfo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/dGF0YS5jb20vY29u/dGVudC9kYW0vdGF0/YS9pbWFnZXMvYnJh/bmRzL2Rlc2t0b3Av/dGF0YV9zYWx0X29j/dDIwMjFfYnJhbmRz/X3RodW1ibmFpbF9k/ZXNrdG9wXzI2NXgx/NzUuanBn",
  coldDrinksJuices: "https://imgs.search.brave.com/5QHWLc_eeXOMWrxHbtsjHXlUjWWf5WbOQxjD6SwqPIM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDc3/NTY3NTUwL3Bob3Rv/L2ljZS1jb2xkLWJl/dmVyYWdlcy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9dFB3/VHpvM250Yi1vVU1j/VVFNZWlVTDVvM1Qw/OVRxWndYYnc2TWNX/V1NIbz0",
  water: "https://imgs.search.brave.com/5mVZh_ckEjcAQ6GNCN-WN_sVdhtl1h6qrTgNPII7PSg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI1LzEw/LzU1MTY1MjgyNS9X/TS9GWi9HSi8zNTA3/NDI4L2Jpc2xlcmkt/d2F0ZXItYm90dGxl/cy01MDAtbWwtNTAw/eDUwMC5qcGc",
  teaCoffee: "https://imgs.search.brave.com/pqlLMPH41yeIHNvkQbJiUt6ZfzilNiuSp62Z_ct56ks/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzAv/MDc4LzU2Mi9zbWFs/bC9hLWN1cC1vZi10/ZWEtYW5kLWEtY3Vw/LW9mLWNvZmZlZS1v/bi1hLXdvb2Rlbi10/YWJsZS1haS1nZW5l/cmF0ZWQtZnJlZS1w/aG90by5qcGc",
  healthDrinks: "https://imgs.search.brave.com/ssfb4olWQTzWn9ukvs1tphP7EKz7aZ0uAOxKmJ9UATA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudXBzdG94LmNv/bS9jb250ZW50L2Fz/c2V0cy9pbWFnZXMv/Y21zLzIwMjQ0MjUv/SG9ybGlja3Mud2Vi/cA",
  biscuits: "https://imgs.search.brave.com/QJ9NkzgQPqCuuxi1Bt4iSLeXyMdby_FGwm_nxQAkRp4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzgxLzkxLzAw/LzM2MF9GXzM4MTkx/MDA3MF9Vb3ZBSnJv/aGY4b1RnQ2lRb2dt/a2dqR05wdFRPYmxT/di5qcGc",
  noodlesPasta: "https://imgs.search.brave.com/RuWCVPyLNPTr0_FLvzHmhzefNQIoWtIw9GKleoXXbco/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTIv/NTQxLzExNC9zbWFs/bC9wYXN0YS1ub29k/bGVzLWZvci1jb29r/aW5nLWl0YWxpYW4t/Zm9vZC1waG90by5q/cGc",
  chocolates: "https://imgs.search.brave.com/rgUwrAUjHdu1Um63OsQXoU7qZ7skz7CT88j3o7NEVd0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzc2L2I4/L2U0Lzc2YjhlNDg0/NWQyMzkxNjBlMjhi/YTIxOGRkZTQ4YTU3/LmpwZw",
  shampooConditioner: "https://imgs.search.brave.com/j0VsXWDqi42jM_2piG87A5TjpmniWMdFSzEee3RQIdA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi92YXJp/b3VzLWJyYW5kcy1z/aGFtcG9vLXByb2R1/Y3RzLXNoZWxmLXN0/b3JlLXN1cGVybWFy/a2V0LWt1YWxhLWx1/bXB1ci1tYWxheXNp/YS1mZWJydWFyeS1o/YWlyLWNhcmUtcHJv/ZHVjdC0yNDA3Nzgx/NjMuanBn",
  soapsHandwash: "https://imgs.search.brave.com/Mxtuqa-2CR18MflIU3Xj7D5y1bwA3rQT_x6XP58pm7E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jcGlt/Zy50aXN0YXRpYy5j/b20vMTAzOTQ2MDAv/Yi80L0RldHRvbC1I/YW5kd2FzaC1Gb2Ft/LVNvYXAtUG91Y2gt/MjAwbWwuanBn",
  toothpaste: "https://imgs.search.brave.com/UN5PrxkrSwAb_j7nVfYn-Ve_j3vvi6_2qz4SSK4b3-A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvMC1DOXFwaTV5/QVEvaHFkZWZhdWx0/LmpwZw",
  homeCare: "https://imgs.search.brave.com/0qptU7Qz1Z6FTfwlWyTKdlERK2LgYdSBzoKuRrI9vKw/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhLzM4/ZDdkMmVjLWM1NGYt/NDBiZC1hMTYzLWYx/YWQzNDc1M2RhYi5f/X0NSMCwwLDk3MCwz/MDBfUFQwX1NYOTcw/X1YxX19fLmpwZw",
  pooja: "https://commons.wikimedia.org/wiki/Special:FilePath/Incense_sticks.jpg",
  dairy: "https://commons.wikimedia.org/wiki/Special:FilePath/Milk_glass.jpg"
};

function categoryTileImage(tile) {
  if (tile.imageUrl) return tile.imageUrl;
  const hints = (tile.imageHints || [tile.imageHint || tile.label]).map((hint) => String(hint || "").toLowerCase());
  const product = products.find((item) => {
    if (item.categoryId !== tile.categoryId) return false;
    const name = String(item.name || "").toLowerCase();
    return hints.some((hint) => hint && name.includes(hint));
  }) || products.find((item) => item.categoryId === tile.categoryId);
  if (product) return productImageUrl(product);
  return `https://placehold.co/420x260/fff8e8/111d4a/png?text=${encodeURIComponent(tile.label)}`;
}

function categorySections() {
  const hi = state.hindi;
  return [
    {
      title: hi ? "जल्दी ब्राउज़ करें" : "Quick Browse",
      tiles: [
        { label: hi ? "सारे Products" : "All Products", categoryId: "all", imageUrl: categoryCoverImages.allProducts, filter: "" }
      ]
    },
    {
      title: hi ? "मसाले और ड्राई फ्रूट्स" : "Spices & Dry Fruits",
      tiles: [
        { label: hi ? "Powdered Spices" : "Powdered Spices", categoryId: "cat-masale", imageUrl: categoryCoverImages.powderedSpices, filter: "haldi|mirch|dhaniya|garam|powder|masala" },
        { label: hi ? "Whole Spices" : "Whole Spices", categoryId: "cat-masale", imageUrl: categoryCoverImages.wholeSpices, filter: "jeera|sabut|whole|laung|elaichi|kali mirch|dalchini" },
        { label: hi ? "Dry Fruits & Nuts" : "Dry Fruits & Nuts", categoryId: "cat-festival", imageUrl: categoryCoverImages.dryFruitsNuts, filter: "dry fruit|almond|badam|kaju|cashew|kishmish|raisin|pista|nuts" }
      ]
    },
    {
      title: hi ? "अनाज, आटा और दाल" : "Cereals, Atta & Dals",
      tiles: [
        { label: hi ? "Rice" : "Rice", categoryId: "cat-atta-daal-chawal", imageUrl: categoryCoverImages.rice, filter: "chawal|rice|mogra|dubar|rozana|classic|tibar|sella|basmati|parmal" },
        { label: hi ? "Atta, Maida, Sooji & Besan" : "Atta, Maida, Sooji & Besan", categoryId: "cat-atta-maida-sooji-besan", imageUrl: categoryCoverImages.attaMaidaSoojiBesan },
        { label: hi ? "Dals" : "Dals", categoryId: "cat-atta-daal-chawal", imageUrl: categoryCoverImages.dals, filter: "daal|dal|masoor|arhar|chana|moong|urhad|rajma|lobia" }
      ]
    },
    {
      title: hi ? "तेल, चीनी और नमक" : "Oil, Sugar & Salt",
      tiles: [
        { label: hi ? "Oil & Ghee" : "Oil & Ghee", categoryId: "cat-tel-ghee", imageUrl: categoryCoverImages.oilGhee },
        { label: hi ? "Sugar & Jaggery" : "Sugar & Jaggery", categoryId: "cat-cheeni-bura-khand", imageUrl: categoryCoverImages.sugarJaggery },
        { label: hi ? "Salt" : "Salt", categoryId: "cat-basics", imageUrl: categoryCoverImages.salt, filter: "namak|salt" }
      ]
    },
    {
      title: hi ? "नाश्ता और पेय" : "Snacks & Beverages",
      tiles: [
        { label: hi ? "Cold Drinks & Juices" : "Cold Drinks & Juices", categoryId: "cat-cold-drinks", imageUrl: categoryCoverImages.coldDrinksJuices, filter: "coca|limca|thums|sprite|fanta|pepsi|mirinda|mountain dew|frooti|juice|sting|hell|red bull|lahori|nimbooz|arora" },
        { label: hi ? "Water" : "Water", categoryId: "cat-cold-drinks", imageUrl: categoryCoverImages.water, filter: "water|bisleri|avoca" },
        { label: hi ? "Tea & Coffee" : "Tea & Coffee", categoryId: "cat-chai-patti", imageUrl: categoryCoverImages.teaCoffee, filter: "tea|chai|coffee|tata|today|red label|taj|taaza|lipton" },
        { label: hi ? "Health Drinks & Premixes" : "Health Drinks & Premixes", categoryId: "cat-nashta", imageUrl: categoryCoverImages.healthDrinks, filter: "health|boost|horlicks|bournvita|complan|premix|ors" },
        { label: hi ? "Biscuits" : "Biscuits", categoryId: "cat-biscuits-namkeen", imageUrl: categoryCoverImages.biscuits, filter: "biscuit|cookie|parle|marie|cream" },
        { label: hi ? "Noodles & Pasta" : "Noodles & Pasta", categoryId: "cat-nashta", imageUrl: categoryCoverImages.noodlesPasta, filter: "noodle|noodles|pasta|maggi|yippee" },
        { label: hi ? "Chocolates & Candies" : "Chocolates & Candies", categoryId: "cat-nashta", imageUrl: categoryCoverImages.chocolates, filter: "chocolate|candy|toffee|eclair|dairy milk|munch|kitkat" }
      ]
    },
    {
      title: hi ? "दूध और डेयरी" : "Doodh & Dairy",
      tiles: [
        { label: hi ? "दूध" : "Milk", categoryId: "cat-doodh-dairy", imageHint: "amul full cream", filter: "milk|doodh|full cream|toned|cow|buffalo|super-t" },
        { label: hi ? "दही / छाछ" : "Dahi & Chaas", categoryId: "cat-doodh-dairy", imageHints: ["dahi", "chaas"], filter: "dahi|curd|chaas|buttermilk" },
        { label: hi ? "Butter / Paneer" : "Butter & Paneer", categoryId: "cat-doodh-dairy", imageHints: ["butter", "paneer"], filter: "butter|paneer" }
      ]
    },
    {
      title: hi ? "Home Care" : "Home Care",
      tiles: [
        { label: hi ? "Laundry Soaps" : "Laundry Soaps", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/0qptU7Qz1Z6FTfwlWyTKdlERK2LgYdSBzoKuRrI9vKw/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhLzM4/ZDdkMmVjLWM1NGYt/NDBiZC1hMTYzLWYx/YWQzNDc1M2RhYi5f/X0NSMCwwLDk3MCwz/MDBfUFQwX1NYOTcw/X1YxX19fLmpwZw", filter: "laundry soap|sabun|rin laundry|surf excel laundry|tide laundry|ghadi|naulakha|maruti|nirol" },
        { label: hi ? "Laundry Powder" : "Laundry Powder", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/KvCZNknLWEnQPkbQQVmbSdjTE2zM_nTWFQeLBgesgC0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c3RhcnF1aWsuY29t/L2Nkbi9zaG9wL2Zp/bGVzL1NRMTAyNTIw/XzNfNDgyYzljOTIt/NDFjMi00YTQ1LThk/ZDgtMzg5NWZmNTNl/OWRkLmpwZz92PTE3/NzY4NDc4MTUmd2lk/dGg9MTQ0NQ", filter: "detergent powder|surf excel blue detergent powder|surf excel easy wash detergent powder|surf excel quick wash detergent powder|rin detergent powder|tide detergent powder|ariel detergent powder|wheel blue detergent powder|wheel green detergent powder|powder" },
        { label: hi ? "Laundry Liquids" : "Laundry Liquids", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/dKLx_L2bTt41OmVS3ZNNLGT1Qw3BvUS1eEZQ8xG9B3o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFwWWZ0bEE5a0wu/anBn", filter: "liquid detergent|rin liquid|godrej fab|surf excel easy wash liquid|matic top load|matic front load|ariel top load liquid|ezee|comfort|fabric conditioner|cloth softening" },
        { label: hi ? "Dishwashing Liquid & Soaps" : "Dishwashing Liquid & Soaps", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/VZkCdJ3isXCl-2msxaVA2Qq77b6SmsSukzH9gNWju7M/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhL2M5/MDQyMTBmLTUzYTct/NDIwMi04ZTI3LTk4/NTU3ZmZhMDU0My5f/X0NSMCwwLDk3MCwz/MDBfUFQwX1NYOTcw/X1YxX19fLmpwZw", filter: "dishwash|dishwashing|vim|pril|patanjali|exo|bartan" },
        { label: hi ? "Floor & Bathroom Cleaners" : "Floor & Bathroom Cleaners", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/X2mpJ5oIIvVDj5J2Afw3wuRO_mytFP6rLztsXbkIz8s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFlSUs5Z1F2R0wu/anBn", filter: "phenyl|floor|bathroom|toilet|cleaner|harpic|lizol|domex|godrej spike|rin aala|tile|gainda" },
        { label: hi ? "Surface Cleaners" : "Surface Cleaners", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/Ooo7bkHz0hjWxHSFvEmwzlKWxYZheiZydSE72u-qb00/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQQWtqaWlqbkwu/anBn", filter: "colin|glass|surface" },
        { label: hi ? "Room Fresheners" : "Room Fresheners", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/ln_C9vEBxqLoGBXscw9XQBUUyUgjIgDQF6mbEyGpu6g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zaG9w/NGhvdGVsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNi8w/My9PZG9uaWwtUm9v/bS1GcmVzaGVuZXIu/d2VicA", filter: "odonil|room freshener|air spray|jasmine|sandalwood|lavender|rose|citrus|air packet" },
        { label: hi ? "Mosquito & Pest Control" : "Mosquito & Pest Control", categoryId: "cat-saaf-safai", imageUrl: "https://imgs.search.brave.com/1GVE1Coyi4P_Im7pwfF7eegeKuMeQbM4jdg5uhrx16s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bGFsc2hhaC5jb20v/d2ViL2ltYWdlL3By/b2R1Y3QuaW1hZ2Uv/NjIxNy9pbWFnZV8x/MDI0L0dvZHJlaiUy/MEthbGElMjBIaXQl/MjBBbnRpJTIwTW9z/cXVpdG8lMjAyMDBt/bCUyMC0lMjAxMjMu/NGc_dW5pcXVlPWE3/MmU3M2U", filter: "all out|good knight|mortein|laxman rekha|\\bhit\\b|mosquito|cockroach|ants|insect" }
      ]
    },
    {
      title: hi ? "Personal Care" : "Personal Care",
      tiles: [
        { label: hi ? "Shampoo & Conditioner" : "Shampoo & Conditioner", categoryId: "cat-personal-care", imageUrl: categoryCoverImages.shampooConditioner, filter: "shampoo|conditioner|clinic|head|sunsilk|dove" },
        { label: hi ? "Soaps & Handwash" : "Soaps & Handwash", categoryId: "cat-personal-care", imageUrl: categoryCoverImages.soapsHandwash, filter: "soap|handwash|santoor|dettol|lifebuoy|lux" },
        { label: hi ? "Toothpaste & Toothbrush" : "Toothpaste & Toothbrush", categoryId: "cat-personal-care", imageUrl: categoryCoverImages.toothpaste, filter: "toothpaste|toothbrush|colgate|pepsodent|oral" }
      ]
    }
  ];
}

function renderCategories() {
  $("#categoryShelf").innerHTML = categorySections().map((section) => `
    <article class="category-group-card">
      <h3>${section.title}</h3>
      <div class="category-tile-grid">
        ${section.tiles.map((tile) => {
          const category = categoryById(tile.categoryId);
          if (!category) return "";
          const active = tile.categoryId === "all"
            ? state.categoryId === "all" && state.showAllProducts && !state.search.trim()
            : state.categoryId === tile.categoryId && (!tile.filter || state.categoryFilter === tile.filter);
          return `
            <button class="category-tile ${active ? "active" : ""}" data-category-id="${category.id}" data-category="${category.name}" data-category-filter="${tile.filter || ""}">
              <img src="${categoryTileImage(tile)}" alt="${tile.label}" loading="lazy" onerror="this.onerror=null;this.src='./assets/kirana-hero.png';" />
              <span>${tile.label}</span>
            </button>
          `;
        }).join("")}
      </div>
    </article>
  `).join("");
}

function productShelfSort(product) {
  if (product.categoryId !== "cat-atta-maida-sooji-besan") return Number(product.sort || 999);
  const name = String(product.name || "").toLowerCase();
  if (/loose atta/.test(name)) return 10;
  if (/aashirvaad/.test(name)) return 20 + unitMeta(product).baseAmount / 100000;
  if (/ashoka/.test(name)) return 30 + unitMeta(product).baseAmount / 100000;
  if (/mp atta/.test(name)) return 40 + unitMeta(product).baseAmount / 100000;
  if (/loose maida/.test(name)) return 50;
  if (/maida/.test(name)) return 55 + unitMeta(product).baseAmount / 100000;
  if (/loose sooji/.test(name)) return 60;
  if (/sooji|suji|rava/.test(name)) return 65 + unitMeta(product).baseAmount / 100000;
  if (/loose besan/.test(name)) return 70;
  if (/besan/.test(name)) return 75 + unitMeta(product).baseAmount / 100000;
  if (/ararot|arrowroot|starch/.test(name)) return 80;
  if (/sattu/.test(name)) return 90;
  return Number(product.sort || 999);
}

function dairyShelfSort(product) {
  if (product.categoryId !== "cat-doodh-dairy") return Number(product.sort || 999);
  const name = String(product.name || "").toLowerCase();
  if (/amul full cream/.test(name)) return 10 + unitMeta(product).baseAmount / 100000;
  if (/amul buffalo/.test(name)) return 20 + unitMeta(product).baseAmount / 100000;
  if (/amul toned/.test(name)) return 30 + unitMeta(product).baseAmount / 100000;
  if (/amul cow/.test(name)) return 40 + unitMeta(product).baseAmount / 100000;
  if (/mother dairy full cream/.test(name)) return 50 + unitMeta(product).baseAmount / 100000;
  if (/mother dairy toned/.test(name)) return 60 + unitMeta(product).baseAmount / 100000;
  if (/mother dairy cow/.test(name)) return 70 + unitMeta(product).baseAmount / 100000;
  if (/super-t|bachha milk/.test(name)) return 80;
  if (/mother dairy.*dahi|mother dairy ultimate/.test(name)) return 90 + unitMeta(product).baseAmount / 100000;
  if (/ananda dahi/.test(name)) return 100 + unitMeta(product).baseAmount / 100000;
  if (/chaas/.test(name)) return 110 + Number(product.sort || 0) / 1000;
  if (/amul butter/.test(name)) return 120 + unitMeta(product).baseAmount / 100000;
  if (/paneer/.test(name)) return 130;
  if (/matar/.test(name)) return 140;
  if (/egg/.test(name)) return 150;
  return Number(product.sort || 999);
}

function filteredProducts() {
  const searchTerm = state.search.trim().toLowerCase();
  let categoryRegex = null;
  if (state.categoryFilter) {
    try {
      categoryRegex = new RegExp(state.categoryFilter, "i");
    } catch {
      categoryRegex = null;
    }
  }
  return products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.unit} ${productSubgroup(product)}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCategory = searchTerm || state.categoryId === "all" || state.category === "All" || product.categoryId === state.categoryId || product.category === state.category;
    const matchesCategoryFilter = searchTerm || !categoryRegex || categoryRegex.test(haystack);
    const stock = stockText(product).cls;
    const matchesStock = state.stock === "all" || state.stock === stock;
    return matchesCategory && matchesSearch && matchesCategoryFilter && matchesStock;
  }).sort((a, b) => {
    const shelfA = a.categoryId === "cat-doodh-dairy" ? dairyShelfSort(a) : productShelfSort(a);
    const shelfB = b.categoryId === "cat-doodh-dairy" ? dairyShelfSort(b) : productShelfSort(b);
    return shelfA - shelfB || String(a.name).localeCompare(String(b.name));
  });
}

function priceDisplay(product) {
  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);
  const showMrp = mrp > price;
  const discountPercent = showMrp ? Math.max(1, Math.round(((mrp - price) / mrp) * 100)) : 0;
  const savings = showMrp ? Math.round(mrp - price) : 0;
  return `
    <div class="price-stack">
      <strong>${rupee.format(price)}</strong>
      ${showMrp ? `<small class="mrp-line">MRP <s>${rupee.format(mrp)}</s></small>` : `<small>${product.unit}</small>`}
      ${showMrp ? `<span class="discount-chip">${discountPercent}% off · save ${rupee.format(savings)}</span>` : ""}
    </div>
  `;
}

function beverageBrand(product) {
  if (product.categoryId !== "cat-cold-drinks") return "";
  const name = String(product.name || "").toLowerCase();
  const brands = ["Coca Cola", "Limca", "Thums Up", "Sprite", "Fanta", "Pepsi", "Mirinda", "Mountain Dew", "Frooti", "Bisleri Water", "Avoca Water"];
  return brands.find((brand) => name.startsWith(brand.toLowerCase())) || "";
}

function attaPacketBrand(product) {
  if (product.categoryId !== "cat-atta-maida-sooji-besan" || product.loose) return "";
  const name = String(product.name || "").toLowerCase();
  if (/aashirvaad/.test(name)) return "Aashirvaad Atta";
  if (/ashoka/.test(name)) return "Ashoka Atta";
  if (/mp atta/.test(name)) return "MP Atta";
  return "";
}

function dairyFamily(product) {
  if (product.categoryId !== "cat-doodh-dairy") return "";
  const name = String(product.name || "").toLowerCase();
  if (/amul full cream/.test(name)) return "Amul Full Cream Milk";
  if (/amul buffalo/.test(name)) return "Amul Buffalo Milk";
  if (/amul toned/.test(name)) return "Amul Toned Milk";
  if (/amul cow/.test(name)) return "Amul Cow Milk";
  if (/mother dairy full cream/.test(name)) return "Mother Dairy Full Cream Milk";
  if (/mother dairy toned/.test(name)) return "Mother Dairy Toned Milk";
  if (/mother dairy cow/.test(name)) return "Mother Dairy Cow Milk";
  if (/mother dairy.*dahi/.test(name) && !/ultimate/.test(name)) return "Mother Dairy Dahi";
  if (/ananda dahi/.test(name)) return "Ananda Dahi";
  if (/amul butter/.test(name)) return "Amul Butter";
  return "";
}

function homeCareFamily(product) {
  if (product.categoryId !== "cat-saaf-safai") return "";
  const name = String(product.name || "").toLowerCase();
  if (/rin laundry soap/.test(name)) return "Rin Laundry Soap";
  if (/surf excel laundry soap/.test(name)) return "Surf Excel Laundry Soap";
  if (/tide laundry soap/.test(name)) return "Tide Laundry Soap";
  if (/ghadi laundry soap/.test(name)) return "Ghadi Laundry Soap";
  if (/surf excel blue detergent powder/.test(name)) return "Surf Excel Blue Detergent Powder";
  if (/surf excel easy wash detergent powder/.test(name)) return "Surf Excel Easy Wash Detergent Powder";
  if (/surf excel quick wash detergent powder/.test(name)) return "Surf Excel Quick Wash Detergent Powder";
  if (/rin detergent powder/.test(name)) return "Rin Detergent Powder";
  if (/tide detergent powder/.test(name)) return "Tide Detergent Powder";
  if (/rin liquid detergent/.test(name)) return "Rin Liquid Detergent";
  if (/godrej fab liquid detergent/.test(name)) return "Godrej Fab Liquid Detergent";
  if (/surf excel easy wash liquid detergent/.test(name)) return "Surf Excel Easy Wash Liquid Detergent";
  if (/surf excel matic top load liquid detergent/.test(name)) return "Surf Excel Matic Top Load Liquid Detergent";
  if (/surf excel matic front load liquid detergent/.test(name)) return "Surf Excel Matic Front Load Liquid Detergent";
  if (/ariel top load liquid detergent/.test(name)) return "Ariel Top Load Liquid Detergent";
  if (/ezee liquid detergent/.test(name)) return "Ezee Liquid Detergent";
  if (/comfort pink fabric conditioner/.test(name)) return "Comfort Pink Fabric Conditioner";
  if (/comfort blue fabric conditioner/.test(name)) return "Comfort Blue Fabric Conditioner";
  if (/vim.*dishwash.*bar|vim.*dishwash.*tub/.test(name)) return "Vim Dishwash Bars";
  if (/vim dishwash liquid/.test(name)) return "Vim Dishwash Liquid";
  if (/patanjali dishwash bar/.test(name)) return "Patanjali Dishwash Bars";
  if (/pril dishwash liquid/.test(name)) return "Pril Dishwash Liquid";
  if (/harpic blue toilet cleaner/.test(name)) return "Harpic Blue Toilet Cleaner";
  if (/harpic white toilet cleaner/.test(name)) return "Harpic White Toilet Cleaner";
  if (/harpic red tile cleaner/.test(name)) return "Harpic Red Tile Cleaner";
  if (/harpic purple tile cleaner/.test(name)) return "Harpic Purple Tile Cleaner";
  if (/godrej spic floor cleaner|godrej spike floor cleaner/.test(name)) return "Godrej Spic Floor Cleaner";
  if (/lizol floor cleaner/.test(name)) return "Lizol Floor Cleaner";
  if (/rin aala/.test(name)) return "Rin Aala";
  if (/domex toilet cleaner/.test(name)) return "Domex Toilet Cleaner";
  if (/colin glass/.test(name)) return "Colin Glass & Surface Cleaner";
  if (/black phenyl/.test(name)) return "Black Phenyl";
  if (/gainda phenyl/.test(name)) return "Gainda Phenyl";
  if (/phenyl balls/.test(name)) return "Phenyl Balls";
  if (/odonil room freshener pouch/.test(name)) return "Odonil Room Freshener Pouch";
  if (/aer pocket room freshener|air room freshener pouch/.test(name)) return "Aer Pocket Room Freshener";
  if (/odonil air spray/.test(name)) return "Odonil Air Spray";
  if (/all out/.test(name)) return "All Out Mosquito Repellent";
  if (/good knight/.test(name)) return "Good Knight Mosquito Repellent";
  if (/mortein/.test(name)) return "Mortein Mosquito Repellent";
  if (/laxman rekha/.test(name)) return "Laxman Rekha";
  if (/hit red/.test(name)) return "HIT Red Cockroach Spray";
  if (/hit black/.test(name)) return "HIT Black Insect Spray";
  if (/ariel|arial/.test(name)) return "Ariel Detergent Powder";
  if (/wheel blue detergent powder/.test(name)) return "Wheel Blue Detergent Powder";
  if (/wheel green detergent powder/.test(name)) return "Wheel Green Detergent Powder";
  return "";
}

function productKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function productEntries(visibleProducts) {
  const entries = [];
  const grouped = new Map();
  visibleProducts.forEach((product) => {
    const brand = beverageBrand(product) || attaPacketBrand(product) || dairyFamily(product) || homeCareFamily(product);
    if (!brand) {
      entries.push({ type: "single", product });
      return;
    }
    if (!grouped.has(brand)) {
      const entry = { type: "variant", brand, product, variants: [] };
      grouped.set(brand, entry);
      entries.push(entry);
    }
    grouped.get(brand).variants.push(product);
  });
  grouped.forEach((entry) => {
    const variants = entry.variants;
    variants.sort((a, b) => unitMeta(a).baseAmount - unitMeta(b).baseAmount || Number(a.price || 0) - Number(b.price || 0));
    const firstAvailable = variants.find((variant) => Number(variant.price || 0) > 0 && variant.stock > 0) || variants[0];
    entry.type = variants.length > 1 ? "variant" : "single";
    entry.product = firstAvailable;
  });
  return entries;
}

function productSubgroup(product) {
  const name = String(product.name || "").toLowerCase();
  
  if (product.categoryId === "cat-atta-daal-chawal") {
    if (/chawal|rice|mogra|dubar|rozana|classic|tibar|sella|basmati|parmal/.test(name)) return "Chawal";
    return "Daal / Pulses";
  }
  
  if (product.categoryId === "cat-atta-maida-sooji-besan") {
    if (/atta|flour/.test(name)) return "Atta";
    if (/maida/.test(name)) return "Maida";
    if (/sooji|suji|rava/.test(name)) return "Sooji";
    if (/besan/.test(name)) return "Besan";
    if (/ararot|arrowroot|starch/.test(name)) return "Ararot";
    if (/sattu/.test(name)) return "Sattu";
    return "Other Flours";
  }
  
  if (product.categoryId === "cat-doodh-dairy") {
    if (/full cream/.test(name)) return "Full Cream Milk";
    if (/buffalo/.test(name)) return "Buffalo Milk";
    if (/toned/.test(name)) return "Toned Milk";
    if (/cow/.test(name)) return "Cow Milk";
    if (/dahi|curd|yogurt/.test(name)) return "Dahi / Curd";
    if (/ultimate/.test(name)) return "Ultimate Dahi";
    return "Other Dairy";
  }

  if (product.categoryId === "cat-cold-drinks") {
    if (/frooti/.test(name)) return "Juices / Frooti";
    if (/sting|hell|red bull/.test(name)) return "Energy Drinks";
    if (/lahori|nimbooz|arora lemon|soda/.test(name)) return "Soda Drinks";
    if (/water/.test(name)) return "Water";
    return "Cold Drinks";
  }

  if (product.categoryId === "cat-saaf-safai") {
    if (/dishwash|vim|pril|patanjali|exo|bartan/.test(name)) return "Dishwash";
    if (/colin|glass|surface/.test(name)) return "Surface Cleaners";
    if (/odonil|room freshener|air spray/.test(name)) return "Room Fresheners";
    if (/all out|good knight|mortein|laxman rekha|\bhit\b|mosquito|cockroach|ants|insect/.test(name)) return "Mosquito & Pest Control";
    if (/phenyl|floor|bathroom|toilet|cleaner|harpic|lizol|domex|godrej spic|godrej spike|rin aala|tile|gainda/.test(name)) return "Floor & Bathroom";
    if (/liquid detergent|godrej fab|ezee|comfort|fabric conditioner|cloth softening|matic top load|matic front load/.test(name)) return "Laundry Liquids";
    if (/detergent powder|wheel blue detergent powder|wheel green detergent powder/.test(name)) return "Laundry Powder";
    if (/laundry|rin|surf|tide|ghadi|sabun|naulakha|maruti|nirol/.test(name)) return "Laundry Soaps";
    return "Home Care";
  }
  
  return "";
}

function persistWishlist() {
  localStorage.setItem("ksWishlist", JSON.stringify([...state.wishlist]));
}

function toggleWishlist(productId) {
  if (state.wishlist.has(productId)) state.wishlist.delete(productId);
  else state.wishlist.add(productId);
  persistWishlist();
  renderProducts();
  renderHomeSections();
  renderWishlist();
}

function miniProductCard(product) {
  if (!product) return "";
  const badge = stockText(product);
  const saved = state.wishlist.has(product.id);
  return `
    <article class="mini-product-card">
      <img src="${catalogImageUrl(product)}" alt="${escapeHtml(product.name)}" loading="lazy" data-product-img="${product.id}" data-fallback-src="${productFallbackImage(product)}" />
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <small>${escapeHtml(product.category || "")} · ${escapeHtml(product.unit || "")}</small>
        <span>${priceDisplay(product)}</span>
      </div>
      <button class="mini-btn" type="button" data-quick-view="${product.id}">${t("viewDetails")}</button>
      <button class="wishlist-action ${saved ? "saved" : ""}" type="button" data-wishlist="${product.id}" aria-pressed="${saved}">
        ${saved ? "★" : "☆"}
      </button>
      <small class="stock-badge ${badge.cls}">${badge.label}</small>
    </article>
  `;
}

function discountedProducts(limit = 4) {
  return products
    .filter((product) => Number(product.price || 0) > 0 && Number(product.stock || 0) > 0)
    .sort((a, b) => {
      const aSave = Number(a.mrp || 0) - Number(a.price || 0);
      const bSave = Number(b.mrp || 0) - Number(b.price || 0);
      return bSave - aSave;
    })
    .slice(0, limit);
}

function renderHomeSections() {
  const quickTarget = $("#homeCategoryLinks");
  const featuredTarget = $("#featuredProducts");
  if (!quickTarget || !featuredTarget) return;

  const quickTiles = categorySections().flatMap((section) => section.tiles).slice(1, 9);
  quickTarget.innerHTML = quickTiles.map((tile) => {
    const category = categoryById(tile.categoryId);
    if (!category) return "";
    return `
      <button class="home-category-link" type="button" data-category-id="${category.id}" data-category="${category.name}" data-category-filter="${tile.filter || ""}">
        <img src="${categoryTileImage(tile)}" alt="${escapeHtml(tile.label)}" loading="lazy" />
        <span>${escapeHtml(tile.label)}</span>
      </button>
    `;
  }).join("");

  featuredTarget.innerHTML = discountedProducts(4).map(miniProductCard).join("") || `<p class="category-empty">${t("noItems")}</p>`;
}

function renderWishlist() {
  const target = $("#wishlistList");
  if (!target) return;
  const savedProducts = [...state.wishlist].map((id) => products.find((product) => product.id === id)).filter(Boolean);
  target.innerHTML = savedProducts.map((product) => `
    <div class="wishlist-row">
      <button type="button" data-quick-view="${product.id}">
        <strong>${escapeHtml(product.name)}</strong>
        <small>${escapeHtml(product.unit)} · ${rupee.format(product.price || 0)}</small>
      </button>
      <button class="mini-btn" type="button" data-wishlist="${product.id}">${t("removeSaved")}</button>
    </div>
  `).join("") || `<p>${t("wishlistEmpty")}</p>`;
}

function renderSearchSuggestions() {
  const target = $("#searchSuggestions");
  if (!target) return;
  const query = state.search.trim().toLowerCase();
  if (!query) {
    target.hidden = true;
    target.innerHTML = "";
    return;
  }
  const suggestions = products
    .filter((product) => `${product.name} ${product.category} ${product.unit}`.toLowerCase().includes(query))
    .slice(0, 6);
  target.hidden = false;
  target.innerHTML = suggestions.map((product) => `
    <button type="button" data-search-suggestion="${product.id}">
      <span>${escapeHtml(product.name)}</span>
      <small>${escapeHtml(product.category)} · ${escapeHtml(product.unit)}</small>
    </button>
  `).join("") || `<p>${t("noSuggestions")}</p>`;
}

function openQuickView(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const badge = stockText(product);
  const saved = state.wishlist.has(product.id);
  $("#quickViewContent").innerHTML = `
    <div class="quick-view-art">
      <img src="${catalogImageUrl(product)}" alt="${escapeHtml(product.name)}" data-product-img="${product.id}" data-fallback-src="${productFallbackImage(product)}" />
    </div>
    <div class="quick-view-copy">
      <span class="subgroup-chip">${escapeHtml(productSubgroup(product) || product.category || "Dukaan item")}</span>
      <h2>${escapeHtml(product.name)}</h2>
      <small>${escapeHtml(product.category)} · ${escapeHtml(product.unit)}</small>
      <div class="price-line">
        <span>${priceDisplay(product)}</span>
        <span class="stock-badge ${badge.cls}">${badge.label}</span>
      </div>
      <p>Pickup from Kushwaha Store. Final availability is confirmed by the shop while packing.</p>
      <div class="quick-view-actions">
        <button class="primary-btn" type="button" data-add="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>${t("addToTokri")}</button>
        <button class="secondary-btn" type="button" data-wishlist="${product.id}">${saved ? t("savedForLater") : t("saveForLater")}</button>
      </div>
    </div>
  `;
  $("#quickViewModal").classList.add("open");
  $("#quickViewModal").setAttribute("aria-hidden", "false");
}

function closeQuickView() {
  $("#quickViewModal").classList.remove("open");
  $("#quickViewModal").setAttribute("aria-hidden", "true");
}

function catalogSkeleton(count = 8) {
  return Array.from({ length: count }, () => `
    <article class="product-card skeleton-card" aria-hidden="true">
      <div class="product-art"></div>
      <span></span>
      <span></span>
      <span></span>
    </article>
  `).join("");
}

function renderProducts() {
  if ((state.categoryId === "all" || state.category === "All") && !state.search.trim() && !state.showAllProducts) {
    $("#productGrid").innerHTML = `<p class="category-empty">${t("chooseCategory")}</p>`;
    return;
  }
  let visibleProducts = filteredProducts();
  if (!visibleProducts.length && state.categoryFilter && !state.search.trim()) {
    const previousFilter = state.categoryFilter;
    state.categoryFilter = "";
    visibleProducts = filteredProducts();
    state.categoryFilter = previousFilter;
  }
  const visible = productEntries(visibleProducts);
  $("#productGrid").innerHTML = visible.map((entry) => {
    const isVariant = entry.type === "variant";
    const product = entry.product;
    const imageUrl = catalogImageUrl(product);
    const badge = stockText(product);
    const canOrder = Number(product.price || 0) > 0 && product.stock > 0;
    const subgroup = productSubgroup(product);
    const groupId = isVariant ? productKey(entry.brand) : "";
    const saved = state.wishlist.has(product.id);
    return `
      <article class="product-card">
        <div class="product-art">
          <img src="${imageUrl}" alt="${escapeHtml(product.name)}" loading="lazy" data-product-img="${product.id}" data-fallback-src="${productFallbackImage(product)}" />
          <button class="wishlist-floating ${saved ? "saved" : ""}" type="button" data-wishlist="${product.id}" aria-pressed="${saved}" aria-label="${saved ? t("savedForLater") : t("saveForLater")}">${saved ? "★" : "☆"}</button>
        </div>
        <h3>${escapeHtml(isVariant ? entry.brand : product.name)}</h3>
        ${subgroup ? `<span class="subgroup-chip">${subgroup}</span>` : ""}
        <small>${escapeHtml(product.category)} · ${isVariant ? "Choose size" : escapeHtml(product.unit)}</small>
        ${isVariant ? `
          <label class="variant-controls">
            <span>Size</span>
            <select data-variant-select="${groupId}">
              ${entry.variants.map((variant) => `<option value="${variant.id}" ${variant.id === product.id ? "selected" : ""} ${variant.stock <= 0 ? "disabled" : ""}>${variant.unit} · ${rupee.format(variant.price)}</option>`).join("")}
            </select>
          </label>
        ` : ""}
        <div class="price-line">
          <span data-variant-price="${groupId}">${priceDisplay(product)}</span>
          <span class="stock-badge ${badge.cls}" data-variant-stock="${groupId}">${badge.label}</span>
        </div>
        ${looseControls(product)}
        <div class="product-card-actions">
          <button class="mini-btn" type="button" data-quick-view="${product.id}">${t("quickView")}</button>
          <button class="mini-btn subtle" type="button" data-wishlist="${product.id}">${saved ? t("savedForLater") : t("saveForLater")}</button>
        </div>
        <button class="add-btn" ${isVariant ? `data-add-selected="${groupId}"` : product.loose ? `data-add-loose="${product.id}"` : `data-add="${product.id}"`} ${!canOrder ? "disabled" : ""}>
          ${!canOrder ? t("unavailable") : product.loose ? t("addLoose") : t("addToTokri")}
        </button>
      </article>
    `;
  }).join("") || `<p>${t("noItems")}</p>`;
}

function cartLines() {
  return [...state.cart.entries()].map(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    return { ...product, qty, lineTotal: product.price * qty };
  });
}

function checkoutTotals(lines) {
  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = subtotal >= 500 ? Math.floor(subtotal * 0.02) : 0;
  const payable = Math.max(0, subtotal - discount);
  const loyalty = Math.floor(payable * 0.01);
  return { subtotal, discount, payable, loyalty };
}

function setActiveCartOrder(order) {
  state.activeOrderId = order?.id || "";
  if (state.activeOrderId) localStorage.setItem("ksActiveOrderId", state.activeOrderId);
  else localStorage.removeItem("ksActiveOrderId");
  configureLiveRefresh();
}

function activeCartOrder() {
  if (!state.activeOrderId) return null;
  const order = customerOrders.find((item) => item.id === state.activeOrderId)
    || orders.find((item) => item.id === state.activeOrderId);
  if (!order) return null;
  if (["Completed", "Cancelled"].includes(order.status)) {
    state.cart.clear();
    setActiveCartOrder(null);
    return null;
  }
  return order;
}

function syncActiveOrderFromLoadedOrders() {
  if (state.activeOrderId && currentCustomer && !customerOrders.some((order) => order.id === state.activeOrderId)) {
    setActiveCartOrder(null);
  }
  return activeCartOrder();
}

function configureLiveRefresh() {
  if (orderRefreshTimer) {
    window.clearInterval(orderRefreshTimer);
    orderRefreshTimer = null;
  }
  if (adminRefreshTimer) {
    window.clearInterval(adminRefreshTimer);
    adminRefreshTimer = null;
  }
  if (backendOnline && currentCustomer && state.activeOrderId) {
    orderRefreshTimer = window.setInterval(() => {
      if (!state.activeOrderId || !currentCustomer) return;
      loadCustomerOrders().catch(() => {});
    }, 15000);
  }
  if (backendOnline && adminSession?.token) {
    adminRefreshTimer = window.setInterval(() => {
      loadAdminOrders().catch(() => {});
    }, 20000);
  }
}

function activeOrderCard(order) {
  if (!order) return "";
  const steps = ["Placed", "Being Packed", "Ready", "Completed"];
  const activeIndex = Math.max(0, steps.indexOf(order.status));
  const paymentInfo = paymentStatusInfo(order.paymentStatus);
  return `
    <div class="active-order-card">
      <div>
        <span class="status-chip">${escapeHtml(order.status || "Placed")}</span>
        <strong>${t("activeOrderTitle")} · ${escapeHtml(order.id)}</strong>
        <small>${t("activeOrderHelp")}</small>
      </div>
      <div class="active-order-meta">
        <span>${t("activeOrderPickup")}</span>
        <span>${t("toPay")}: ${rupee.format(order.payable || order.total || 0)}</span>
        <span>${t("paymentStatus")}: ${paymentInfo.label}</span>
      </div>
      <div class="tracking-mini" aria-label="Order tracking">
        ${steps.map((_, index) => `<span class="${index <= activeIndex ? "done" : ""}"></span>`).join("")}
      </div>
      <button class="mini-btn" type="button" data-open-account-nav>${t("viewInAccount")}</button>
    </div>
  `;
}

function whatsappCustomerLines() {
  if (!currentCustomer) return [];
  return [
    `${t("whatsappCustomer")}: ${currentCustomer.name || t("receiptCustomer")}`,
    `${t("phone")}: ${currentCustomer.phone || ""}`,
    currentCustomer.id ? `${t("whatsappAccountId")}: ${currentCustomer.id}` : ""
  ].filter(Boolean);
}

function whatsappOrderUrl(lines = cartLines()) {
  if (!lines.length || !currentCustomer) return "#";
  const totals = checkoutTotals(lines);
  const message = encodeURIComponent([
    t("whatsappGreeting"),
    ...whatsappCustomerLines(),
    t("whatsappIntro"),
    ...lines.map((item) => `- ${item.name} (${formatQuantity(item, item.qty)}) = ${rupee.format(item.lineTotal)}`),
    `${t("subtotal")}: ${rupee.format(totals.subtotal)}`,
    `${t("discountLabel")}: -${rupee.format(totals.discount)}`,
    `${t("payableLabel")}: ${rupee.format(totals.payable)}`,
    `${t("loyaltyEarned")}: ${totals.loyalty} ${t("pointsSuffix")}`,
    t("backendFallbackPayment")
  ].join("\n"));
  return `https://wa.me/${storePhone}?text=${message}`;
}

function renderCart() {
  const lines = cartLines();
  const activeOrder = activeCartOrder();
  const totalQty = lines.length;
  const totals = checkoutTotals(lines);
  renderPaymentModes();
  $("#cartCount").textContent = totalQty;
  $("#cartTotal").textContent = rupee.format(totals.subtotal);
  $("#cartDiscount").textContent = `-${rupee.format(totals.discount)}`;
  $("#cartPayable").textContent = rupee.format(totals.payable);
  $("#loyaltyEarned").textContent = `${totals.loyalty} ${t("pointsSuffix")}`;
  $("#cartItems").innerHTML = `${activeOrderCard(activeOrder)}${lines.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${formatQuantity(item, item.qty)} · ${rupee.format(item.price)} / ${item.unit}</small>
      </div>
      ${activeOrder ? `
      <small class="cart-item-locked">${t("reservedInOrder")}</small>
      ` : item.loose ? `
      <div class="qty-controls">
        <button data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
      </div>
      ` : `
      <div class="qty-controls">
        <button data-dec="${item.id}" aria-label="Decrease ${item.name}">-</button>
        <strong>${item.qty}</strong>
        <button data-inc="${item.id}" aria-label="Increase ${item.name}">+</button>
      </div>
      `}
    </div>
  `).join("") || (activeOrder ? "" : `<p>${t("emptyCart")}</p>`)}`;

  $("#websiteOrder").disabled = Boolean(activeOrder) || !lines.length;
  $("#websiteOrder").textContent = activeOrder ? t("activeOrderButton") : t("placeOrder");
  $("#whatsappOrder").href = activeOrder ? "#" : whatsappOrderUrl(lines);
  $("#whatsappOrder").classList.toggle("disabled", Boolean(activeOrder));
  $("#whatsappOrder").textContent = activeOrder ? t("activeOrderWhatsapp") : t("sendWhatsapp");
  refreshPaymentOptions().catch(() => {});
}

function renderOrders() {
  if (backendOnline && !adminSession?.token) {
    $("#orderList").innerHTML = `<p>${t("adminLocked")}</p>`;
    renderAdminGate();
    return;
  }
  $("#orderList").innerHTML = orders.map((order) => {
    const items = (order.items || [])
      .map((item) => `${item.name || item.productName || item.productId} (${item.quantityLabel || formatQuantity(item, item.qty)})`)
      .join(", ");
    const contact = order.phone ? ` · ${order.phone}` : "";
    const paymentStatus = order.paymentStatus || "due_on_pickup";
    const paymentInfo = paymentStatusInfo(paymentStatus);
    const isOpenOrder = ["Placed", "Being Packed"].includes(order.status);
    const timeline = (order.timeline || [])
      .slice(-3)
      .map((item) => `<span>${item.status} · ${new Date(item.at || order.createdAt || Date.now()).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>`)
      .join("");
    const paid = paymentStatus === "paid";
    return `
    <div class="order-row ${isOpenOrder ? "new-order-row" : ""}">
      <div>
        <strong>${order.id} · ${order.name || "Customer"}${contact}</strong>
        <small>${rupee.format(order.total || order.subtotal || 0)} ${t("pickupOrder")}</small>
        <div class="admin-order-meta">
          <span class="payment-pill ${paymentInfo.cls}">${t("paymentStatus")}: ${paymentInfo.label}</span>
          <span>${t("receiptId")}: ${order.receiptId || order.id}</span>
          <span>${order.paymentMode || "pay_at_store"}</span>
        </div>
        <div class="admin-order-items">${items || "Items unavailable"}</div>
        <div class="admin-timeline"><strong>${t("timeline")}</strong>${timeline || `<span>${order.status}</span>`}</div>
        <div class="admin-order-actions">
          <button class="mini-btn" data-status-order="${order.id}" data-status="Being Packed">${t("markPacking")}</button>
          <button class="mini-btn" data-status-order="${order.id}" data-status="Ready">${t("markReady")}</button>
          <button class="mini-btn" data-status-order="${order.id}" data-status="Completed">${t("markCompleted")}</button>
          <button class="mini-btn" data-pay-order="${order.id}" ${paid ? "disabled" : ""}>${t("markPaid")}</button>
          <button class="mini-btn" data-refund-order="${order.id}" ${paid ? "" : "disabled"}>${t("refund")}</button>
          <button class="mini-btn" data-status-order="${order.id}" data-status="Cancelled">${t("cancelOrder")}</button>
          <button class="mini-btn" data-receipt="${order.id}">${t("receipt")}</button>
        </div>
      </div>
      <span class="status-chip ${paid ? "paid" : "due"}">${order.status}</span>
    </div>
  `;
  }).join("");
}

function renderCustomerOrders() {
  const target = $("#customerOrders");
  if (!target) return;
  if (!currentCustomer) {
    target.innerHTML = `<p>${t("noPastOrders")}</p>`;
    return;
  }
  target.innerHTML = customerOrders.map((order) => {
    const items = (order.items || [])
      .map((item) => `${item.name || item.productName || item.productId} (${item.quantityLabel || formatQuantity(item, item.qty)})`)
      .join(", ");
    const date = order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
    const steps = ["Placed", "Being Packed", "Ready", "Completed"];
    const activeIndex = Math.max(0, steps.indexOf(order.status));
    const paymentInfo = paymentStatusInfo(order.paymentStatus);
    return `
      <article class="customer-order-card">
        <strong>${order.id} · ${rupee.format(order.total || order.subtotal || 0)}</strong>
        <small>${date}</small>
        <small>${items}</small>
        <span class="payment-pill ${paymentInfo.cls}">${t("paymentStatus")}: ${paymentInfo.label}</span>
        <div class="tracking-mini" aria-label="Order tracking">
          ${steps.map((_, index) => `<span class="${index <= activeIndex ? "done" : ""}"></span>`).join("")}
        </div>
        <span class="status-chip">${order.status}</span>
        <div class="receipt-actions">
          <button class="mini-btn" data-receipt="${order.id}">${t("receipt")}</button>
          <button class="mini-btn" data-reorder="${order.id}">${t("reorder")}</button>
          <a class="mini-btn" href="https://wa.me/${storePhone}?text=${encodeURIComponent(`${t("receiptRequest")} ${order.id}`)}" target="_blank" rel="noreferrer">${t("shareReceipt")}</a>
        </div>
      </article>
    `;
  }).join("") || `<p>${t("noPastOrders")}</p>`;
}

function stars(rating) {
  const value = Math.max(1, Math.min(5, Number(rating || 5)));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function renderReviews() {
  const list = $("#reviewList");
  if (!list) return;
  if (currentCustomer) {
    if ($("#reviewName") && !$("#reviewName").value) $("#reviewName").value = currentCustomer.name || "";
    if ($("#reviewPhone") && !$("#reviewPhone").value) $("#reviewPhone").value = currentCustomer.phone || "";
  }
  const visibleReviews = [...(reviews || [])]
    .filter((review) => review.published !== false)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const average = visibleReviews.length
    ? (visibleReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / visibleReviews.length).toFixed(1)
    : "0.0";
  const averageTarget = $("#reviewAverage");
  const summaryTarget = $("#reviewSummary");
  if (averageTarget) averageTarget.textContent = average;
  if (summaryTarget) summaryTarget.textContent = `${visibleReviews.length} ${t("customerRating")}`;
  list.innerHTML = visibleReviews.map((review) => `
    <article class="review-card">
      <div>
        <strong>${escapeHtml(review.name)}</strong>
        <span>${stars(review.rating)}</span>
      </div>
      <p>${escapeHtml(review.text)}</p>
      <small>${new Date(review.createdAt || Date.now()).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small>
    </article>
  `).join("") || `<p class="reviews-empty">${t("noReviews")}</p>`;
}

function askForFeedback() {
  window.setTimeout(() => {
    if (confirm(t("feedbackPrompt"))) {
      window.location.href = "/reviews";
      return;
    }
    if (confirm(t("blogPrompt"))) {
      window.location.href = "/blog";
    }
  }, 250);
}

function renderAccount() {
  const drawer = $("#accountDrawer");
  if (!drawer) return;
  drawer.classList.toggle("signed-in", Boolean(currentCustomer));
  setText("#accountTitle", t("accountTitle"));
  setText(".account-orders h3", t("pastOrders"));
  setText("#openAccount", currentCustomer ? String(currentCustomer.name || t("account")).split(" ")[0] : t("account"));
  setText(".account-form label:nth-child(1) span", t("name"));
  setText(".account-form label:nth-child(2) span", t("phone"));
  setText(".account-form label:nth-child(3) span", t("password"));
  $("#accountName").placeholder = t("namePlaceholder");
  $("#accountPhone").placeholder = t("phonePlaceholder");
  $("#accountPassword").placeholder = t("passwordPlaceholder");
  setText("#accountForm .primary-btn", t("login"));
  setText("#signupButton", t("createAccount"));
  setText("[data-reorder='latest']", t("reorderLastCart"));
  setText("#logoutButton", t("logout"));
  setText("#requestUdhaarButton", t("requestUdhaar"));
  const status = $("#accountStatus");
  if (currentCustomer) {
    status.innerHTML = `
      <strong>${currentCustomer.name}</strong>
      <span>${t("accountLoggedInCopy")} ${currentCustomer.phone || ""} · ${Number(currentCustomer.loyaltyPoints || 0)} ${t("pointsSuffix")}</span>
    `;
  } else {
    status.innerHTML = `
      <strong>${t("accountLoggedOutTitle")}</strong>
      <span>${t("accountLoggedOutCopy")}</span>
    `;
  }
  const reorderLatest = document.querySelector("[data-reorder='latest']");
  if (reorderLatest) reorderLatest.disabled = !customerOrders.length;
  const udhaarButton = $("#requestUdhaarButton");
  const udhaarNote = $("#udhaarRequestNote");
  const udhaarStatus = udhaarRequest?.status || "not_applied";
  if (udhaarButton) {
    udhaarButton.disabled = !currentCustomer || udhaarStatus === "pending" || udhaarStatus === "approved";
    udhaarButton.textContent = udhaarStatus === "approved"
      ? t("udhaarRequestApproved")
      : udhaarStatus === "pending"
        ? t("udhaarRequestPending")
        : t("requestUdhaar");
  }
  if (udhaarNote) {
    udhaarNote.textContent = udhaarStatus === "approved"
      ? `${t("udhaarRequestApproved")} ${udhaarRequest?.balance ? `${rupee.format(udhaarRequest.balance)} ${t("due")}.` : ""} ${t("udhaarPaymentApprovedHelp")}`.trim()
      : udhaarStatus === "pending"
        ? t("udhaarRequestPending")
        : udhaarStatus === "rejected"
          ? t("udhaarRequestRejected")
          : t("udhaarRequestHelp");
  }
  renderPaymentModes();
  renderCustomerOrders();
  renderWishlist();
}

function renderRewardCards() {
  const helpText = {
    loyalty: t("rewardLoyaltyHelp"),
    monthly_gift: t("rewardMonthlyHelp"),
    lucky_draw: t("rewardLuckyHelp")
  };
  document.querySelectorAll("[data-reward-card]").forEach((card) => {
    const type = card.dataset.rewardCard;
    const application = rewardApplications.find((item) => item.type === type);
    const button = card.querySelector("[data-apply-reward]");
    const note = card.querySelector("small");
    const applied = application && application.status !== "not_applied";
    if (button) {
      button.textContent = applied ? t("applied") : t("apply");
      button.disabled = Boolean(applied);
    }
    if (note) {
      note.textContent = application
        ? `${application.eligible ? t("eligible") : t("notEligible")} · ${application.eligibilityReason || helpText[type]}`
        : helpText[type];
    }
  });
}

function renderAdminRewardApplications() {
  const target = $("#rewardApplicationList");
  if (!target) return;
  if (backendOnline && !adminSession?.token) {
    target.innerHTML = `<p>${t("adminLocked")}</p>`;
    return;
  }
  target.innerHTML = adminRewardApplications.map((application) => {
    const customer = application.customer || {};
    const label = application.type === "monthly_gift"
      ? t("monthlyGifts")
      : application.type === "lucky_draw"
        ? t("communityRewards")
        : t("pointsTitle");
    return `
      <div class="reward-application-row">
        <div>
          <strong>${customer.name || application.name || "Customer"} · ${label}</strong>
          <small>${customer.phone || application.phone || ""}</small>
          <small>${t("monthlySpendLabel")}: ${rupee.format(customer.monthlySpend || 0)} · ${Number(customer.loyaltyPoints || 0)} ${t("pointsSuffix")}</small>
          <small>${application.eligibilityReason || ""}</small>
        </div>
        <span class="status-chip ${application.eligible ? "paid" : "due"}">${application.eligible ? t("eligible") : t("notEligible")}</span>
      </div>
    `;
  }).join("") || `<p>${t("noRewardApplications")}</p>`;
}

function renderAdminUdhaarRequests() {
  const target = $("#udhaarRequestList");
  if (!target) return;
  if (backendOnline && !adminSession?.token) {
    target.innerHTML = `<p>${t("adminLocked")}</p>`;
    return;
  }
  target.innerHTML = adminUdhaarRequests.map((application) => {
    const customer = application.customer || {};
    const status = application.status || "pending";
    const canReview = status === "pending";
    return `
      <div class="reward-application-row udhaar-request-row">
        <div>
          <strong>${escapeHtml(customer.name || application.name || "Customer")}</strong>
          <small>${escapeHtml(customer.phone || application.phone || "")}</small>
          <small>${t("paymentMonthlyDue")}: ${rupee.format(Number(application.balance || 0))}</small>
          <small>${escapeHtml(application.note || t("udhaarRequestsCopy"))}</small>
        </div>
        <div class="udhaar-review-actions">
          <span class="status-chip ${status === "approved" ? "paid" : status === "rejected" ? "due" : ""}">${escapeHtml(status)}</span>
          ${canReview ? `
            <button class="mini-btn" type="button" data-udhaar-request-id="${application.id}" data-udhaar-request-status="approved">${t("approve")}</button>
            <button class="mini-btn danger" type="button" data-udhaar-request-id="${application.id}" data-udhaar-request-status="rejected">${t("reject")}</button>
          ` : ""}
        </div>
      </div>
    `;
  }).join("") || `<p>${t("noUdhaarRequests")}</p>`;
}

async function loadRewardApplications() {
  if (!currentCustomer || !backendOnline) {
    rewardApplications = [];
    renderRewardCards();
    return;
  }
  const payload = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/rewards`);
  saveCustomer(payload.customer || currentCustomer);
  rewardApplications = payload.applications || [];
  renderRewardCards();
}

async function applyReward(type) {
  if (!currentCustomer) {
    alert(t("loginBeforeReward"));
    $("#accountDrawer").classList.add("open");
    renderAccount();
    return;
  }
  if (!(await ensureBackendOnline())) return;
  try {
    const payload = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/rewards/apply`, {
      method: "POST",
      body: JSON.stringify({ type })
    });
    saveCustomer(payload.customer || currentCustomer);
    rewardApplications = payload.applications || rewardApplications;
    renderRewardCards();
    await loadAdminRewardApplications().catch(() => {});
    alert(t("rewardApplySuccess"));
  } catch (error) {
    alert(error.message);
  }
}

async function loadAdminRewardApplications() {
  if (!backendOnline || !adminSession?.token) {
    renderAdminRewardApplications();
    return;
  }
  const payload = await api("/admin/reward-applications", {}, { admin: true });
  adminRewardApplications = payload.applications || [];
  renderAdminRewardApplications();
}

async function loadUdhaarRequest() {
  if (!currentCustomer || !backendOnline) {
    udhaarRequest = null;
    renderAccount();
    renderCart();
    return;
  }
  const payload = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/udhaar-request`);
  saveCustomer(payload.customer || currentCustomer);
  udhaarRequest = payload.application || null;
  renderAccount();
  renderCart();
}

async function requestUdhaarAccount(options = {}) {
  if (!currentCustomer) {
    alert(t("loginBeforeOrder"));
    $("#accountDrawer").classList.add("open");
    renderAccount();
    return null;
  }
  if (!(await ensureBackendOnline())) return null;
  try {
    const payload = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/udhaar-request`, { method: "POST" });
    udhaarRequest = payload.application || null;
    renderAccount();
    await loadAdminUdhaarRequests().catch(() => {});
    alert(options.successMessage || t("udhaarRequestSuccess"));
    return payload;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

async function loadAdminUdhaarRequests() {
  if (!backendOnline || !adminSession?.token) {
    renderAdminUdhaarRequests();
    return;
  }
  const payload = await api("/admin/udhaar-requests", {}, { admin: true });
  adminUdhaarRequests = payload.applications || [];
  renderAdminUdhaarRequests();
}

async function updateUdhaarRequest(id, status) {
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  try {
    const payload = await api(`/admin/udhaar-requests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, { admin: true });
    adminUdhaarRequests = adminUdhaarRequests.map((application) => application.id === id ? payload.application : application);
    renderAdminUdhaarRequests();
    await loadLedgerAccounts().catch(() => {});
  } catch (error) {
    alert(error.message);
  }
}

async function loadCustomerOrders() {
  if (!currentCustomer || !backendOnline) return;
  const payload = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/orders`);
  saveCustomer(payload.customer || currentCustomer);
  customerOrders = payload.orders || [];
  syncActiveOrderFromLoadedOrders();
  renderCart();
  renderAccount();
  await loadCustomerStatement();
  await loadRewardApplications().catch(() => {});
}

function renderLedger() {
  renderLedgerCalendar();
  renderLedgerSummary();
  populateLedgerForm();
  renderLedgerStatement();
}

function renderLedgerSummary() {
  const target = $("#ledgerRows");
  if (!target) return;
  if (!currentCustomer) {
    target.innerHTML = `
      <article><span>${state.hindi ? "Login जरूरी" : "Login needed"}</span><strong>--</strong><small>${state.hindi ? "अपना monthly calendar देखने के लिए account खोलें." : "Open your account to see the monthly udhaar calendar."}</small></article>
    `;
    return;
  }
  const statement = customerStatement || {};
  target.innerHTML = `
    <article><span>${state.hindi ? "Debit" : "Debit"}</span><strong>${rupee.format(statement.debit || 0)}</strong><small>${state.hindi ? "इस महीने की खरीद" : "Purchases added this month"}</small></article>
    <article><span>${state.hindi ? "Credit / Paid" : "Credit / Paid"}</span><strong>${rupee.format(statement.credit || 0)}</strong><small>${state.hindi ? "इस महीने जमा" : "Payments received this month"}</small></article>
    <article><span>${state.hindi ? "Month-end due" : "Month-end due"}</span><strong>${rupee.format(statement.due || 0)}</strong><small>${statement.status || "loading"}</small></article>
  `;
}

function monthChoices() {
  const base = new Date(`${selectedLedgerMonth}-01T00:00:00`);
  return [-1, 0, 1, 2].map((offset) => {
    const date = new Date(base);
    date.setMonth(base.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  });
}

function monthLabel(month) {
  return new Date(`${month}-01T00:00:00`).toLocaleString(state.hindi ? "hi-IN" : "en-IN", { month: "short", year: "2-digit" });
}

function renderLedgerCalendar() {
  const calendar = document.querySelector(".ledger-calendar");
  if (!calendar) return;
  calendar.innerHTML = monthChoices().map((month) => `
    <button class="month-chip ${month === selectedLedgerMonth ? "active" : ""}" data-ledger-month="${month}" type="button">${monthLabel(month)}</button>
  `).join("");
  const monthInput = $("#ledgerMonthInput");
  if (monthInput) monthInput.value = selectedLedgerMonth;
}

function renderLedgerStatement() {
  const target = $("#ledgerStatement");
  if (!target) return;
  if (!currentCustomer) {
    target.innerHTML = `
      <div class="udhaar-empty">
        <strong>${state.hindi ? "Customer monthly calendar" : "Customer monthly calendar"}</strong>
        <span>${state.hindi ? "Login करने पर date-wise खरीद, payment और month-end due दिखेगा." : "Login to see date-wise purchases, payments, and month-end due."}</span>
      </div>
    `;
    return;
  }
  if (!customerStatement) {
    target.innerHTML = `<div class="udhaar-empty"><strong>${monthLabel(selectedLedgerMonth)}</strong><span>Statement loading...</span></div>`;
    return;
  }
  const entriesByDay = new Map();
  for (const entry of customerStatement.entries || []) {
    const day = new Date(entry.createdAt || `${customerStatement.month}-01T00:00:00`).getDate();
    entriesByDay.set(day, [...(entriesByDay.get(day) || []), entry]);
  }
  const [year, month] = String(customerStatement.month || selectedLedgerMonth).split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const blanks = Array.from({ length: firstDay }, () => `<div class="udhaar-day muted"></div>`).join("");
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const entries = entriesByDay.get(day) || [];
    const dayTotal = entries.reduce((sum, entry) => sum + (entry.type === "credit" ? -Number(entry.amount || 0) : Number(entry.amount || 0)), 0);
    const lines = entries.map((entry) => {
      const items = entry.order?.items?.map((item) => `${item.name} ${item.quantityLabel || ""}`).join(", ");
      return `
        <div class="udhaar-entry ${entry.type}">
          <span>${entry.type === "credit" ? "Paid" : items || entry.note || "Purchase"}</span>
          <strong>${entry.type === "credit" ? "+" : ""}${rupee.format(entry.amount || 0)}</strong>
        </div>
      `;
    }).join("");
    return `
      <div class="udhaar-day ${entries.length ? "has-entry" : ""}">
        <div class="day-head"><strong>${day}</strong>${entries.length ? `<small>${dayTotal >= 0 ? rupee.format(dayTotal) : `Paid ${rupee.format(Math.abs(dayTotal))}`}</small>` : ""}</div>
        ${lines}
      </div>
    `;
  }).join("");
  target.innerHTML = `
    <div class="udhaar-statement-head">
      <div>
        <strong>${currentCustomer.name} · ${monthLabel(customerStatement.month)}</strong>
        <span>${state.hindi ? "Month-end final amount" : "Month-end final amount"}: ${rupee.format(customerStatement.due || 0)} · ${customerStatement.status}</span>
      </div>
      <span class="status-chip ${customerStatement.due > 0 ? "due" : "paid"}">${customerStatement.due > 0 ? t("due") : t("clear")}</span>
    </div>
    <div class="udhaar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
    <div class="udhaar-month-grid">${blanks}${days}</div>
  `;
}

function populateLedgerForm() {
  const select = $("#ledgerCustomerSelect");
  if (!select) return;
  select.innerHTML = ledger.map((account) => `
    <option value="${account.customerId || account.phone || account.name}">${account.name} · ${rupee.format(account.balance || 0)}</option>
  `).join("") || `<option value="">No accounts</option>`;
  $("#ledgerMonthInput").value = selectedLedgerMonth;
}

async function loadCustomerStatement() {
  if (!currentCustomer || !backendOnline) {
    customerStatement = null;
    renderLedgerStatement();
    return;
  }
  try {
    customerStatement = await api(`/customers/${encodeURIComponent(currentCustomer.id)}/statement?month=${encodeURIComponent(selectedLedgerMonth)}`);
  } catch {
    customerStatement = null;
  }
  renderLedger();
}

async function loadLedgerAccounts() {
  if (!backendOnline || !adminSession?.token) return;
  const payload = await api("/ledger", {}, { admin: true });
  ledger = payload || ledger;
  renderLedger();
}

function renderAdminSummary(summary) {
  if (!summary) return;
  latestSummary = summary;
  const cards = document.querySelectorAll(".admin-card");
  if (cards[0]) {
    cards[0].querySelector("strong").textContent = rupee.format(summary.revenue || 0);
    cards[0].querySelector("small").textContent = `${summary.totalOrders || 0} ${t("ordersReady")} · ${summary.readyForPickup || 0} ${t("readyForPickup")}`;
  }
  if (cards[1]) {
    cards[1].querySelector("strong").textContent = `${summary.lowStockCount || 0} items`;
  }
  if (cards[2] && summary.bestSeller) {
    cards[2].querySelector("strong").textContent = summary.bestSeller.name;
    cards[2].querySelector("small").textContent = `${summary.bestSeller.quantity} ${t("orderedSeed")}`;
  }
  const waitingOrders = orders.filter((order) => ["Placed", "Being Packed"].includes(order.status));
  const newOrderCard = $("#newOrderCard");
  if (newOrderCard) {
    const hasWaiting = waitingOrders.length > 0;
    newOrderCard.classList.toggle("attention", hasWaiting);
    $("#newOrderCount").textContent = hasWaiting ? `${waitingOrders.length} waiting` : "0 waiting";
    newOrderCard.querySelector("small").textContent = hasWaiting
      ? "Open orders need packing/status update"
      : "No pending website orders right now";
  }
}

function categoryOptions(selectedId = "") {
  return categories
    .filter((category) => category.id !== "all")
    .map((category) => `<option value="${category.id}" ${category.id === selectedId ? "selected" : ""}>${category.name}</option>`)
    .join("");
}

function productOptions(selectedId = "", query = "") {
  const needle = String(query || "").trim().toLowerCase();
  return [...products]
    .filter((product) => {
      if (!needle) return true;
      return `${product.name} ${product.category} ${product.unit}`.toLowerCase().includes(needle);
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
    .map((product) => `<option value="${product.id}" ${product.id === selectedId ? "selected" : ""}>${product.name} · ${product.unit}</option>`)
    .join("");
}

function selectedAdminProduct() {
  const id = $("#updateProductSelect")?.value;
  return products.find((product) => product.id === id) || products[0] || null;
}

function fillUpdateProductForm(product = selectedAdminProduct()) {
  if (!product || !$("#updateProductForm")) return;
  $("#updateProductName").value = product.name || "";
  $("#updateProductCategory").innerHTML = categoryOptions(product.categoryId);
  $("#updateProductPrice").value = Number(product.price || 0);
  $("#updateProductMrp").value = product.mrp === undefined || product.mrp === null ? "" : Number(product.mrp || 0);
  $("#updateProductUnit").value = product.unit || "";
  $("#updateProductStock").value = Number(product.stock || 0);
  $("#updateProductLowStock").value = Number(product.lowStockAt || 3);
  $("#updateProductImage").value = product.imageUrl || "";
  $("#updateProductLoose").checked = Boolean(product.loose);
  updateCatalogImagePreview("update", product.imageUrl);
}

function renderAdminCatalogManager(selectedId = $("#updateProductSelect")?.value || "") {
  if (!$("#addProductCategory") || !$("#updateProductSelect")) return;
  const defaultCategory = $("#addProductCategory").value || categories.find((category) => category.id !== "all")?.id || "";
  $("#addProductCategory").innerHTML = categoryOptions(defaultCategory);
  const query = $("#updateProductSearch")?.value || "";
  $("#updateProductSelect").innerHTML = productOptions(selectedId, query);
  const visibleIds = [...$("#updateProductSelect").options].map((option) => option.value);
  const selected = products.find((product) => product.id === selectedId && visibleIds.includes(product.id))
    || products.find((product) => product.id === visibleIds[0])
    || products[0]
    || null;
  if (selected) {
    $("#updateProductSelect").value = selected.id;
    fillUpdateProductForm(selected);
  }
}

function productFormPayload(prefix) {
  const price = Number($(`#${prefix}ProductPrice`).value || 0);
  const mrpValue = $(`#${prefix}ProductMrp`).value;
  const lowStockInput = $(`#${prefix}ProductLowStock`);
  return {
    name: $(`#${prefix}ProductName`).value.trim(),
    categoryId: $(`#${prefix}ProductCategory`).value,
    price,
    mrp: mrpValue === "" ? price : Number(mrpValue || price),
    unit: $(`#${prefix}ProductUnit`).value.trim(),
    stock: Number($(`#${prefix}ProductStock`).value || 0),
    imageUrl: $(`#${prefix}ProductImage`).value.trim(),
    loose: $(`#${prefix}ProductLoose`).checked,
    lowStockAt: Number(lowStockInput?.value || 3),
    sourceNote: "Admin catalog entry."
  };
}

function updateCatalogImagePreview(prefix, url = $(`#${prefix}ProductImage`)?.value || "") {
  const preview = $(`#${prefix}ProductImagePreview`);
  if (!preview) return;
  const cleanUrl = String(url || "").trim();
  preview.innerHTML = cleanUrl
    ? `<img src="${escapeHtml(cleanUrl)}" alt="Product image preview" loading="lazy" /><span>Image preview</span>`
    : "Image preview";
}

function renderLaunchChecklist() {
  const saved = JSON.parse(localStorage.getItem("ksLaunchChecklist") || "{}");
  document.querySelectorAll("[data-launch-check]").forEach((input) => {
    input.checked = Boolean(saved[input.dataset.launchCheck]);
  });
}

function saveLaunchChecklist(event) {
  const input = event.target.closest("[data-launch-check]");
  if (!input) return;
  const saved = JSON.parse(localStorage.getItem("ksLaunchChecklist") || "{}");
  saved[input.dataset.launchCheck] = input.checked;
  localStorage.setItem("ksLaunchChecklist", JSON.stringify(saved));
}

async function refreshCatalogAdmin() {
  if (!backendOnline) return;
  try {
    const payload = await api("/products");
    if (Array.isArray(payload) && payload.length) {
      products = payload;
      imageCache.clear();
      renderCategories();
      renderProducts();
      renderAdminCatalogManager();
    }
  } catch (error) {
    alert(error.message);
  }
}

async function addAdminProduct(event) {
  event.preventDefault();
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  const payload = productFormPayload("add");
  if (!payload.name || !payload.categoryId || !payload.unit) {
    alert("Product name, category and quantity/unit are required.");
    return;
  }
  try {
    const product = await api("/products", {
      method: "POST",
      body: JSON.stringify(payload)
    }, { admin: true });
    products = [product, ...products.filter((item) => item.id !== product.id)];
    imageCache.delete(product.id);
    resetForm(event.currentTarget);
    const stockInput = $("#addProductStock");
    if (stockInput) stockInput.value = 10;
    const lowStockInput = $("#addProductLowStock");
    if (lowStockInput) lowStockInput.value = 3;
    updateCatalogImagePreview("add", "");
    renderCategories();
    renderProducts();
    renderAdminCatalogManager(product.id);
    alert(`${product.name} added to catalog.`);
  } catch (error) {
    alert(error.message);
  }
}

async function addQuickCategory(event) {
  event.preventDefault();
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  const name = $("#quickCategoryName").value.trim();
  if (!name) {
    alert("Enter category name first.");
    return;
  }
  try {
    const category = await api("/categories", {
      method: "POST",
      body: JSON.stringify({ name })
    }, { admin: true });
    categories = [...categories.filter((item) => item.id !== category.id), category];
    $("#quickCategoryName").value = "";
    renderCategories();
    renderAdminCatalogManager();
    $("#addProductCategory").value = category.id;
    alert(`${category.name} category added.`);
  } catch (error) {
    alert(error.message);
  }
}

async function updateAdminProduct(event) {
  event.preventDefault();
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  const id = $("#updateProductSelect").value;
  if (!id) return;
  const payload = productFormPayload("update");
  try {
    const product = await api(`/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }, { admin: true });
    products = products.map((item) => item.id === product.id ? product : item);
    imageCache.delete(product.id);
    renderCategories();
    renderProducts();
    renderAdminCatalogManager(product.id);
    alert(`${product.name} updated.`);
  } catch (error) {
    alert(error.message);
  }
}

async function loadAdminOrders() {
  if (!backendOnline) {
    renderOrders();
    return;
  }
  if (!adminSession?.token) {
    renderOrders();
    return;
  }
  try {
    const payload = await api("/admin/orders", {}, { admin: true });
    const incomingOrders = payload.orders || [];
    if (lastSeenAdminOrderId && incomingOrders[0]?.id && incomingOrders[0].id !== lastSeenAdminOrderId) {
      document.body.classList.add("admin-has-new-order");
      window.setTimeout(() => document.body.classList.remove("admin-has-new-order"), 2500);
    }
    if (incomingOrders[0]?.id) {
      lastSeenAdminOrderId = incomingOrders[0].id;
      localStorage.setItem("ksLastSeenAdminOrderId", lastSeenAdminOrderId);
    }
    orders = incomingOrders.length ? incomingOrders : orders;
    renderOrders();
    renderAdminSummary(payload.summary);
  } catch (error) {
    alert(error.message);
  }
}

async function loginAdmin(event) {
  event.preventDefault();
  if (!(await ensureBackendOnline())) return;
  try {
    const payload = await api("/admin/login", {
      method: "POST",
      body: JSON.stringify({
        phone: $("#adminPhone").value,
        password: $("#adminPassword").value
      })
    });
    saveAdminSession(payload);
    await loadAdminOrders();
    renderAdminCatalogManager();
    configureLiveRefresh();
  } catch (error) {
    alert(error.message);
  }
}

function logoutAdmin() {
  saveAdminSession(null);
  adminRewardApplications = [];
  adminUdhaarRequests = [];
  configureLiveRefresh();
  renderOrders();
  renderAdminRewardApplications();
  renderAdminUdhaarRequests();
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setTexts(selector, values) {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (values[index] !== undefined) element.textContent = values[index];
  });
}

function setSwitchLabel(label, value) {
  [...label.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  label.append(` ${value}`);
}

function setStatLabel(selector, value) {
  const element = document.querySelector(selector);
  const strong = element?.querySelector("strong");
  if (!element || !strong) return;
  element.textContent = "";
  element.append(strong, value);
}

function applyRoute() {
  const blogStory = document.querySelector("#blogStory");
  const infoSection = document.querySelector("#info");
  if (blogStory && infoSection && blogStory.nextElementSibling !== infoSection) {
    infoSection.before(blogStory);
  }
  document.documentElement.dataset.route = state.route;
  document.body.classList.toggle("admin-page", state.route === "admin");
  document.body.classList.toggle("blog-page", state.route === "blog");
  document.body.classList.toggle("udhaar-page", state.route === "udhaar");
  document.body.classList.toggle("gallery-page", state.route === "gallery");
  document.body.classList.toggle("reviews-page", state.route === "reviews");
  document.body.classList.toggle("contact-page", state.route === "contact");
  document.body.classList.toggle("store-page", state.route === "store");
  const storyDropdown = document.querySelector(".story-dropdown");
  if (storyDropdown) storyDropdown.open = state.route === "blog";
  updateActiveNavigation();
}

function updateActiveNavigation() {
  const path = currentPath();
  const hash = window.location.hash || "";
  document.querySelectorAll(".desktop-nav a, .bottom-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === "#" || link.hasAttribute("data-open-cart-nav") || link.hasAttribute("data-open-account-nav")) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
      return;
    }
    const url = new URL(href, window.location.origin);
    const linkPath = url.pathname.replace(/\/$/, "") || "/";
    const linkHash = url.hash || "";
    let active = false;
    if (path === "/" && hash) {
      active = linkPath === "/" && linkHash === hash;
    } else if (path === "/") {
      active = href === "/#home" || href === "/";
    } else {
      active = linkPath === path && !linkHash;
    }
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function scrollForRoute(hash = "") {
  const target = hash ? document.querySelector(hash) : null;
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function navigateApp(url, { replace = false } = {}) {
  if (url.pathname === "/admin") sessionStorage.setItem("ksAdminNavClick", "1");
  state.route = routeFromPath();
  if (replace) history.replaceState(null, "", `${url.pathname}${url.hash}`);
  else history.pushState(null, "", `${url.pathname}${url.hash}`);
  state.route = routeFromPath();
  applyRoute();
  renderAdminGate();
  scrollForRoute(state.route === "store" ? url.hash : "");
}

function applyLanguage() {
  applyRoute();
  document.documentElement.lang = state.hindi ? "hi" : "en";
  document.title = `${t("storeName")} | ${t("taglineShort")}`;
  $("#languageToggle").textContent = state.hindi ? "EN" : "हिं";
  setText(".brand-tile", t("storeShort"));
  setText(".brand-mark strong", t("storeName"));
  setText(".brand-mark small", t("taglineShort"));
  document.querySelector(".brand-mark")?.setAttribute("aria-label", t("storeHomeLabel"));
  document.querySelector("#openCart span").textContent = t("cart");

  setTexts(".desktop-nav a", [t("navCatalog"), t("navUdhaar"), t("navGallery"), t("navContact"), t("navAdmin"), t("navLoyalty"), t("navInfo"), t("navReviews")]);
  setText(".paint-label", t("heroEyebrow"));
  setText(".hero h1", t("storeName"));
  setText(".tagline", t("taglineFull"));
  setTexts(".hero-actions a", [t("browse"), t("whatsapp")]);

  setTexts(".store-strip span", [t("address"), t("hours"), t("call"), t("pickup")]);
  setText(".store-strip article:nth-child(4) strong", t("readyShort"));

  setText(".offer-banner .eyebrow", t("currentOffers"));
  setText(".offer-banner h2", t("homeOfferTitle"));
  setText(".offer-banner p:not(.eyebrow)", t("homeOfferCopy"));
  setText(".offer-banner .primary-btn", t("startShopping"));
  setTexts(".home-panel .panel-head h3", [t("quickCategoryLinks"), t("popularPicks")]);
  setTexts(".home-panel .panel-head small", [t("homeQuickCopy"), t("popularPicksCopy")]);

  setText(".store-story .eyebrow", t("galleryEyebrow"));
  setText(".store-story .section-heading h2", t("galleryTitle"));
  setText(".store-story .section-heading p:not(.eyebrow)", t("galleryCopy"));
  setTexts(".proof-grid span", [t("publicRating"), t("ratingsSeen"), t("photosListed"), t("chanakyaPlace")]);
  setTexts(".gallery-tile span", [t("galleryFront"), t("galleryShelves"), t("galleryCounter"), t("galleryFounder")]);
  setTexts(".gallery-tile figcaption", [t("galleryFrontCopy"), t("galleryShelvesCopy"), t("galleryCounterCopy"), t("galleryFounderCopy")]);
  setText("#galleryPage .eyebrow", t("galleryPageEyebrow"));
  setText("#galleryPage .section-heading h2", t("galleryPageTitle"));
  setText("#galleryPage .section-heading p:not(.eyebrow)", t("galleryPageCopy"));
  setText("#galleryPage .shop-photo-gallery h3", t("galleryMoreTitle"));
  setText("#reviewsPage .eyebrow", t("reviewsEyebrow"));
  setText("#reviewsPage .section-heading h2", t("reviewsTitle"));
  setText("#reviewsPage .section-heading p:not(.eyebrow)", t("reviewsCopy"));
  setText(".review-form strong", t("writeReview"));
  setText(".review-form > div small", t("writeReviewCopy"));
  setTexts(".review-form label span", [t("name"), t("reviewPhoneOptional"), t("reviewRating"), t("reviewText")]);
  $("#reviewName").placeholder = t("namePlaceholder");
  $("#reviewPhone").placeholder = t("reviewPhonePlaceholder");
  $("#reviewText").placeholder = t("reviewPlaceholder");
  setText("#reviewForm .primary-btn", t("postReview"));
  setText("#contactPage .eyebrow", t("contactEyebrow"));
  setText("#contactPage .section-heading h2", t("contactTitle"));
  setText("#contactPage .section-heading p:not(.eyebrow)", t("contactCopy"));
  setTexts(".contact-details-panel span", [t("contactPhoneTitle"), t("contactWhatsappTitle"), t("contactAddressTitle"), t("contactTimingsTitle"), t("contactPickupTitle")]);
  setText(".contact-details-panel article:nth-child(1) strong a", t("contactPhoneValue"));
  setText(".contact-details-panel article:nth-child(2) strong a", t("contactWhatsappValue"));
  setText(".contact-details-panel article:nth-child(3) strong", t("contactAddressValue"));
  setText(".contact-details-panel article:nth-child(4) strong", t("contactTimingsValue"));
  setText(".contact-details-panel article:nth-child(5) strong", t("contactPickupValue"));
  setTexts(".contact-details-panel small", [t("contactPhoneCopy"), t("contactWhatsappCopy"), t("contactAddressCopy"), t("contactTimingsCopy"), t("contactPickupCopy")]);

  setText("#catalog .eyebrow", t("catalogEyebrow"));
  setText("#catalog .section-heading h2", t("catalogTitle"));
  setText("#catalog .section-heading p:not(.eyebrow)", t("catalogCopy"));
  setText(".search-box span", t("search"));
  $("#searchInput").placeholder = t("searchPlaceholder");
  setText(".filter-box span", t("stock"));
  setTexts("#stockFilter option", [t("allItems"), t("inStock"), t("lowStock"), t("outOfStock")]);

  setText(".order-flow .eyebrow", t("pickupFirst"));
  setText(".order-flow .section-heading h2", t("orderJourney"));
  setText(".order-flow .section-heading p:not(.eyebrow)", t("orderJourneyCopy"));
  setTexts(".step-card strong", [t("orderPlaced"), t("beingPacked"), t("readyPickup"), t("completed")]);
  setTexts(".step-card small", [t("orderPlacedCopy"), t("beingPackedCopy"), t("readyPickupCopy"), t("completedCopy")]);

  setText("#udhaar .eyebrow", t("bahi"));
  setText("#udhaar .section-heading h2", t("ledger"));
  setText("#udhaar .section-heading p:not(.eyebrow)", t("ledgerCopy"));
  setText(".ledger-adjust-form .primary-btn", t("addAdjustment"));
  setTexts(".month-chip", t("monthLabels"));

  setText("#admin .eyebrow", t("ownerPanel"));
  setText("#admin .section-heading h2", t("adminTitle"));
  setText("#admin .section-heading p:not(.eyebrow)", t("adminCopy"));
  setText(".admin-explainer strong", t("adminExplainerTitle"));
  setText(".admin-explainer span", t("adminExplainerCopy"));
  setText(".admin-login-panel strong", t("adminLogin"));
  $("#adminPhone").placeholder = t("adminPhone");
  $("#adminPassword").placeholder = t("adminPassword");
  setText("#adminLoginForm .primary-btn", t("adminUnlock"));
  setText("#adminLogout", t("logout"));
  setTexts(".admin-card h3", [t("todaySales"), t("lowStockTitle"), t("bestSeller"), t("receipts")]);
  setText("#refreshOrders", t("refreshOrders"));
  const adminCards = document.querySelectorAll(".admin-card");
  if (adminCards[1]) adminCards[1].querySelector("small").textContent = t("lowStockAdminCopy");
  if (adminCards[3]) {
    adminCards[3].querySelector("strong").textContent = t("printable");
    adminCards[3].querySelector("small").textContent = t("receiptsCopy");
  }
  setText("#incomingOrdersTitle", t("incomingOrders"));
  setText("#udhaarRequestsTitle", t("udhaarRequests"));
  setText(".udhaar-admin-list .admin-list-head small", t("udhaarRequestsCopy"));
  setText("#rewardApplicationsTitle", t("rewardApplications"));
  setText("#refreshUdhaarRequests", t("refreshOrders"));
  setText("#refreshRewards", t("refreshOrders"));

  setText("#loyalty .eyebrow", t("rewardsModules"));
  setText("#loyalty .section-heading h2", t("loyaltyTitle"));
  setTexts(".module-grid h3", [t("pointsTitle"), t("monthlyGifts"), t("communityRewards")]);
  setTexts(".module-grid p", [t("pointsCopy"), t("monthlyGiftsCopy"), t("communityRewardsCopy")]);
  document.querySelectorAll(".module-grid .switch").forEach((label) => setSwitchLabel(label, t("enabled")));
  renderRewardCards();
  renderHomeSections();
  renderAdminRewardApplications();
  renderAdminUdhaarRequests();

  setText("#info .eyebrow", t("trustPages"));
  setText("#info .section-heading h2", t("infoTitle"));
  setTexts(".info-grid h3", [t("about"), t("blog"), t("policies")]);
  setTexts(".info-grid p", [t("aboutCopy"), t("blogCopy"), t("policiesCopy")]);
  setTexts(".info-link", [t("readStory"), t("viewPolicies")]);
  setTexts(".deep-info h3", [t("legacy"), t("aboutShop")]);
  setTexts(".deep-info p", [t("legacyCopy"), t("aboutShopCopy")]);
  setText(".faq-panel h3", t("faqLong"));
  renderLongInfoContent();
  setText("footer strong", t("storeName"));
  setText("footer span", t("footer"));

  setText(".cart-head h2", t("tokri"));
  setTexts(".checkout-box > div:not(.fulfillment-note):not(.upi-box) span", [t("subtotal"), t("storeDiscount"), t("toPay"), t("loyaltyEarned")]);
  setText(".upi-box strong", t("payOnline"));
  setText(".upi-box small", t("paymentCopy"));
  renderPaymentModes();
  setText(".checkout-box > small.receipt-note:last-of-type", t("receiptNote"));
  setText(".fulfillment-note", t("fulfillmentNote"));
  setText("#websiteOrder", t("placeOrder"));
  setText("#whatsappOrder", t("sendWhatsapp"));
  setTexts(".bottom-nav a", [t("home"), t("navCatalog"), t("cart"), t("account"), t("navContact")]);
  renderCart();
  renderAccount();
  renderReviews();
  renderHomeSections();
  renderAdminGate();
}

function addToCart(id) {
  if (activeCartOrder()) {
    alert(t("activeOrderAddBlocked"));
    return;
  }
  const product = products.find((item) => item.id === id);
  const current = state.cart.get(id) || 0;
  if (!product || current >= product.stock) return;
  state.cart.set(id, current + 1);
  renderCart();
}

function updateVariantCard(select) {
  const product = products.find((item) => item.id === select.value);
  if (!product) return;
  const groupId = select.dataset.variantSelect;
  const card = select.closest(".product-card");
  const badge = stockText(product);
  const priceTarget = card?.querySelector(`[data-variant-price="${groupId}"]`);
  const stockTarget = card?.querySelector(`[data-variant-stock="${groupId}"]`);
  const addButton = card?.querySelector(`[data-add-selected="${groupId}"]`);
  if (priceTarget) priceTarget.innerHTML = priceDisplay(product);
  if (stockTarget) {
    stockTarget.className = `stock-badge ${badge.cls}`;
    stockTarget.textContent = badge.label;
  }
  if (addButton) addButton.disabled = !(Number(product.price || 0) > 0 && product.stock > 0);
}

function addLooseToCart(id) {
  if (activeCartOrder()) {
    alert(t("activeOrderAddBlocked"));
    return;
  }
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const amount = Number(document.querySelector(`[data-loose-value="${id}"]`)?.value || 0);
  const inputUnit = document.querySelector(`[data-loose-unit="${id}"]`)?.value || unitMeta(product).displayUnit;
  const qty = amountToProductQty(product, amount, inputUnit);
  const current = state.cart.get(id) || 0;
  if (!qty) {
    alert(t("invalidQty"));
    return;
  }
  if (current + qty > product.stock) {
    alert(t("notEnoughStock"));
    return;
  }
  state.cart.set(id, Number((current + qty).toFixed(4)));
  renderCart();
}

async function placeWebsiteOrder() {
  if (!state.cart.size) return;
  if (!(await ensureBackendOnline())) return;
  if (!currentCustomer) {
    alert(t("loginBeforeOrder"));
    $("#accountDrawer").classList.add("open");
    renderAccount();
    return;
  }
  const totals = checkoutTotals(cartLines());
  if (totals.payable < MIN_ORDER_VALUE) {
    alert(t("minimumOrderValue"));
    return;
  }
  highlightPaymentOptions();
  const paymentMode = selectedPaymentMode();
  if (paymentMode === "udhaar" && !isUdhaarApproved()) {
    await handleUdhaarPaymentChoice();
    return;
  }
  try {
    const payload = await api("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId: currentCustomer.id,
        paymentMode,
        discount: totals.discount,
        items: cartLines().map((item) => ({ productId: item.id, qty: item.qty }))
      })
    });
    if (payload.products?.length) products = payload.products;
    orders = [payload.order, ...orders];
    saveCustomer(payload.customer || currentCustomer);
    customerOrders = [payload.order, ...customerOrders];
    setActiveCartOrder(payload.order);
    renderProducts();
    renderCart();
    renderOrders();
    renderAccount();
    renderAdminSummary(payload.summary);
    if (paymentMode === "udhaar") {
      await loadUdhaarRequest().catch(() => {});
      await loadCustomerStatement().catch(() => {});
      alert(`${payload.order.id} placed. ${t("udhaarOrderSuccess")}`);
      askForFeedback();
      return;
    }
    if (paymentMode === "upi_online") {
      const options = await api(`/payments/options?amount=${encodeURIComponent(payload.order.total || payload.order.payable || totals.payable)}&orderId=${encodeURIComponent(payload.order.id)}`);
      if (options.upiIntentUrl) window.open(options.upiIntentUrl, "_blank", "noopener,noreferrer");
      alert(`${payload.order.id} placed. ${t("paymentPending")}`);
      askForFeedback();
      return;
    }
    alert(`Order ${payload.order.id} placed. ${t("orderSuccess")}`);
    askForFeedback();
  } catch (error) {
    alert(friendlyOrderError(error));
  }
}

function reorderOrder(orderId) {
  const sortedCustomerOrders = [...customerOrders].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const order = orderId === "latest"
    ? sortedCustomerOrders[0]
    : customerOrders.find((item) => item.id === orderId) || orders.find((item) => item.id === orderId);
  if (!order?.items?.length) return;
  let skipped = 0;
  for (const item of order.items) {
    const productId = item.productId || item.id;
    const product = products.find((candidate) => candidate.id === productId);
    const qty = Number(item.qty || item.quantity || 0);
    if (!product || !qty || product.stock < qty) {
      skipped += 1;
      continue;
    }
    const current = state.cart.get(product.id) || 0;
    state.cart.set(product.id, Number((current + qty).toFixed(4)));
  }
  renderCart();
  $("#cartDrawer").classList.add("open");
  alert(skipped ? `${t("reorderSuccess")} ${t("reorderUnavailable")}` : t("reorderSuccess"));
}

function printReceipt(orderId) {
  const order = customerOrders.find((item) => item.id === orderId) || orders.find((item) => item.id === orderId);
  if (!order) return;
  const paymentInfo = paymentStatusInfo(order.paymentStatus);
  const created = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const items = (order.items || []).map((item) => `
    <tr>
      <td>${item.name || item.productName || item.productId}</td>
      <td>${item.quantityLabel || item.qty}</td>
      <td>${rupee.format((item.lineTotal || item.qty * item.price || 0))}</td>
    </tr>
  `).join("");
  const receipt = window.open("", "_blank", "width=420,height=640");
  if (!receipt) return;
  receipt.document.write(`
    <title>${t("receiptTitle")} ${order.id}</title>
    <style>
      * { box-sizing: border-box; }
      body { max-width: 480px; margin: 0 auto; font-family: Arial, sans-serif; padding: 24px; color: #101828; }
      h1 { margin: 0; color: #111d4a; font-size: 30px; }
      small, p { color: #4d5368; line-height: 1.45; }
      table { width: 100%; border-collapse: collapse; margin: 18px 0; }
      td, th { border-bottom: 1px solid #ddd; padding: 8px 0; text-align: left; }
      td:last-child, th:last-child { text-align: right; }
      .meta, .totals { padding: 14px; border: 2px solid #111d4a; border-radius: 8px; background: #fff8e8; }
      .meta span, .totals span { display: flex; justify-content: space-between; gap: 12px; padding: 4px 0; }
      .total { font-size: 1.25rem; font-weight: 800; color: #111d4a; }
      .paid { color: #16794c; font-weight: 800; }
      .due { color: #b92d23; font-weight: 800; }
      @media print { body { padding: 0; } button { display: none; } }
    </style>
    <h1>${t("storeName")}</h1>
    <small>Chanakya Place, C-39, Delhi · 9136278478</small>
    <div class="meta">
      <span><b>${t("receipt")}</b><b>${order.receiptId || order.id}</b></span>
      <span><b>Order</b><b>${order.id}</b></span>
      <span><b>${t("receiptCustomer")}</b><b>${order.name || currentCustomer?.name || "-"}</b></span>
      <span><b>${t("phone")}</b><b>${order.phone || currentCustomer?.phone || "-"}</b></span>
      <span><b>${t("receiptStatus")}</b><b>${order.status}</b></span>
      <span><b>${t("paymentStatus")}</b><b class="${paymentInfo.cls === "paid" ? "paid" : "due"}">${paymentInfo.label}</b></span>
      <span><b>Date</b><b>${created}</b></span>
    </div>
    <table><thead><tr><th>${t("receiptItem")}</th><th>${t("receiptQty")}</th><th>${t("receiptTotal")}</th></tr></thead><tbody>${items}</tbody></table>
    <div class="totals">
      <span><b>${t("subtotal")}</b><b>${rupee.format(order.subtotal || order.total || 0)}</b></span>
      <span><b>${t("discountLabel")}</b><b>-${rupee.format(order.discount || 0)}</b></span>
      <span class="total"><b>${t("receiptTotal")}</b><b>${rupee.format(order.total || order.payable || order.subtotal || 0)}</b></span>
    </div>
    <p>${t("receiptPayment")}</p>
    <script>window.print();<\/script>
  `);
  receipt.document.close();
}

async function loginCustomer(event) {
  event.preventDefault();
  if (!(await ensureBackendOnline())) return;
  try {
    const payload = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        phone: $("#accountPhone").value,
        password: $("#accountPassword").value
      })
    });
    saveCustomer(payload.customer);
    customerOrders = payload.orders || [];
    syncActiveOrderFromLoadedOrders();
    configureLiveRefresh();
    await loadRewardApplications();
    await loadUdhaarRequest();
    renderAccount();
    renderCart();
  } catch (error) {
    alert(error.message);
  }
}

async function signupCustomer() {
  if (!(await ensureBackendOnline())) return;
  try {
    const payload = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: $("#accountName").value,
        phone: $("#accountPhone").value,
        password: $("#accountPassword").value
      })
    });
    saveCustomer(payload.customer);
    customerOrders = payload.orders || [];
    syncActiveOrderFromLoadedOrders();
    configureLiveRefresh();
    await loadRewardApplications();
    await loadUdhaarRequest();
    renderAccount();
    renderCart();
  } catch (error) {
    alert(error.message);
  }
}

function logoutCustomer() {
  saveCustomer(null);
  customerOrders = [];
  rewardApplications = [];
  udhaarRequest = null;
  setActiveCartOrder(null);
  state.cart.clear();
  configureLiveRefresh();
  renderAccount();
  renderRewardCards();
  renderCart();
}

async function updateOrderStatus(orderId, status) {
  if (!backendOnline) {
    orders = orders.map((order) => order.id === orderId ? { ...order, status } : order);
    renderOrders();
    return;
  }
  try {
    const payload = await api(`/orders/${encodeURIComponent(orderId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, { admin: true });
    const updated = payload.order || payload;
    orders = orders.map((order) => order.id === orderId ? updated : order);
    customerOrders = customerOrders.map((order) => order.id === orderId ? updated : order);
    if (updated.id === state.activeOrderId && ["Completed", "Cancelled"].includes(updated.status)) {
      alert(t("activeOrderCleared"));
    }
    activeCartOrder();
    renderOrders();
    renderCart();
    renderCustomerOrders();
    renderAdminSummary(payload.summary);
  } catch (error) {
    alert(error.message);
  }
}

async function markOrderPaid(orderId) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  if (!backendOnline) {
    orders = orders.map((item) => item.id === orderId ? { ...item, paymentStatus: "paid" } : item);
    renderOrders();
    return;
  }
  try {
    const payload = await api("/payments", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        method: "upi_on_pickup",
        status: "paid",
        amount: order.total || order.payable || order.subtotal || 0
      })
    }, { admin: true });
    const updated = payload.order;
    orders = orders.map((item) => item.id === orderId ? updated : item);
    customerOrders = customerOrders.map((item) => item.id === orderId ? updated : item);
    renderOrders();
    renderCustomerOrders();
  } catch (error) {
    alert(error.message);
  }
}

async function refundOrder(orderId) {
  const order = orders.find((item) => item.id === orderId);
  if (!order || !confirm(`Refund ${order.id}?`)) return;
  try {
    const payload = await api("/payments/refunds", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        amount: order.total || order.payable || order.subtotal || 0,
        reason: "Admin refund"
      })
    }, { admin: true });
    const updated = payload.order;
    orders = orders.map((item) => item.id === orderId ? updated : item);
    customerOrders = customerOrders.map((item) => item.id === orderId ? updated : item);
    renderOrders();
    renderCustomerOrders();
  } catch (error) {
    alert(error.message);
  }
}

async function submitLedgerAdjustment(event) {
  event.preventDefault();
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  const customerId = $("#ledgerCustomerSelect").value;
  const amount = Number($("#ledgerAmountInput").value || 0);
  if (!customerId || !amount) return;
  try {
    const payload = await api("/ledger", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        amount,
        type: $("#ledgerTypeSelect").value,
        month: $("#ledgerMonthInput").value || selectedLedgerMonth,
        note: $("#ledgerNoteInput").value || "Manual ledger adjustment"
      })
    }, { admin: true });
    if (payload.account) {
      ledger = ledger.filter((account) => account.id !== payload.account.id);
      ledger.unshift(payload.account);
    }
    $("#ledgerAmountInput").value = "";
    $("#ledgerNoteInput").value = "";
    await loadCustomerStatement();
    await loadLedgerAccounts();
  } catch (error) {
    alert(error.message);
  }
}

async function settleLedgerMonth() {
  if (!adminSession?.token) {
    alert(t("adminLocked"));
    return;
  }
  const customerId = $("#ledgerCustomerSelect").value;
  if (!customerId) return;
  try {
    const payload = await api("/ledger/settle", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        month: $("#ledgerMonthInput").value || selectedLedgerMonth,
        note: `Month-end settlement ${$("#ledgerMonthInput").value || selectedLedgerMonth}`
      })
    }, { admin: true });
    if (payload.account) {
      ledger = ledger.filter((account) => account.id !== payload.account.id);
      ledger.unshift(payload.account);
    }
    await loadCustomerStatement();
    await loadLedgerAccounts();
  } catch (error) {
    alert(error.message);
  }
}

async function submitReview(event) {
  event.preventDefault();
  const body = {
    name: $("#reviewName").value,
    phone: $("#reviewPhone").value,
    rating: Number($("#reviewRating").value || 5),
    text: $("#reviewText").value,
    customerId: currentCustomer?.id || null
  };
  if (!backendOnline) {
    const review = {
      id: `review-local-${Date.now()}`,
      ...body,
      name: body.name || currentCustomer?.name || "Customer",
      published: true,
      createdAt: new Date().toISOString()
    };
    reviews.unshift(review);
    renderReviews();
    resetForm("#reviewForm");
    alert(t("reviewSuccess"));
    return;
  }
  try {
    const payload = await api("/reviews", {
      method: "POST",
      body: JSON.stringify(body)
    });
    reviews = [payload.review, ...reviews.filter((review) => review.id !== payload.review.id)];
    renderReviews();
    resetForm("#reviewForm");
    alert(t("reviewSuccess"));
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  const addButton = event.target.closest("[data-add]");
  const addLooseButton = event.target.closest("[data-add-loose]");
  const addSelectedButton = event.target.closest("[data-add-selected]");
  const incButton = event.target.closest("[data-inc]");
  const decButton = event.target.closest("[data-dec]");
  const removeButton = event.target.closest("[data-remove]");
  const statusButton = event.target.closest("[data-status-order]");
  const receiptButton = event.target.closest("[data-receipt]");
  const payButton = event.target.closest("[data-pay-order]");
  const refundButton = event.target.closest("[data-refund-order]");
  const reorderButton = event.target.closest("[data-reorder]");
  const monthButton = event.target.closest("[data-ledger-month]");
  const rewardButton = event.target.closest("[data-apply-reward]");
  const udhaarReviewButton = event.target.closest("[data-udhaar-request-id]");
  const navigateButton = event.target.closest("[data-navigate-to]");
  const openCartNav = event.target.closest("[data-open-cart-nav]");
  const openAccountNav = event.target.closest("[data-open-account-nav]");
  const unitButton = event.target.closest("[data-unit]");
  const quickViewButton = event.target.closest("[data-quick-view]");
  const wishlistButton = event.target.closest("[data-wishlist]");
  const searchSuggestionButton = event.target.closest("[data-search-suggestion]");

  if (quickViewButton) {
    event.preventDefault();
    openQuickView(quickViewButton.dataset.quickView);
    return;
  }

  if (wishlistButton) {
    event.preventDefault();
    toggleWishlist(wishlistButton.dataset.wishlist);
    return;
  }

  if (searchSuggestionButton) {
    const product = products.find((item) => item.id === searchSuggestionButton.dataset.searchSuggestion);
    if (product) {
      state.search = product.name;
      state.category = "All";
      state.categoryId = "all";
      state.categoryFilter = "";
      state.showAllProducts = false;
      $("#searchInput").value = product.name;
      renderSearchSuggestions();
      renderCategories();
      renderProducts();
      openQuickView(product.id);
    }
    return;
  }

  if (openCartNav) {
    event.preventDefault();
    $("#cartDrawer").classList.add("open");
    renderCart();
    return;
  }

  if (openAccountNav) {
    event.preventDefault();
    $("#accountDrawer").classList.add("open");
    renderAccount();
    loadCustomerOrders().catch(() => {});
    return;
  }

  if (unitButton) {
    const row = unitButton.closest("[data-unit-target]");
    const target = row ? document.querySelector(`#${row.dataset.unitTarget}`) : null;
    if (target) {
      target.value = unitButton.dataset.unit;
      target.focus();
    }
  }

  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    state.categoryId = categoryButton.dataset.categoryId || "all";
    state.categoryFilter = categoryButton.dataset.categoryFilter || "";
    state.showAllProducts = state.categoryId === "all";
    state.search = "";
    if ($("#searchInput")) $("#searchInput").value = "";
    renderCategories();
    renderProducts();
    if (state.categoryId !== "all") {
      document.querySelector("#productGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (addButton) {
    addToCart(addButton.dataset.add);
    if (addButton.closest("#quickViewModal")) closeQuickView();
    $("#cartDrawer").classList.add("open");
  }

  if (addLooseButton) {
    addLooseToCart(addLooseButton.dataset.addLoose);
    if (addLooseButton.closest("#quickViewModal")) closeQuickView();
    $("#cartDrawer").classList.add("open");
  }

  if (addSelectedButton) {
    const groupId = addSelectedButton.dataset.addSelected;
    const selectedId = document.querySelector(`[data-variant-select="${groupId}"]`)?.value;
    if (selectedId) {
      addToCart(selectedId);
      if (addSelectedButton.closest("#quickViewModal")) closeQuickView();
      $("#cartDrawer").classList.add("open");
    }
  }

  if ((incButton || decButton || removeButton) && activeCartOrder()) {
    alert(t("activeOrderAddBlocked"));
    return;
  }

  if (incButton) addToCart(incButton.dataset.inc);

  if (decButton) {
    const id = decButton.dataset.dec;
    const next = (state.cart.get(id) || 0) - 1;
    if (next > 0) state.cart.set(id, next);
    else state.cart.delete(id);
    renderCart();
  }

  if (removeButton) {
    state.cart.delete(removeButton.dataset.remove);
    renderCart();
  }

  if (statusButton) {
    updateOrderStatus(statusButton.dataset.statusOrder, statusButton.dataset.status);
  }

  if (payButton) {
    markOrderPaid(payButton.dataset.payOrder);
  }

  if (refundButton) {
    refundOrder(refundButton.dataset.refundOrder);
  }

  if (reorderButton) {
    reorderOrder(reorderButton.dataset.reorder);
  }

  if (monthButton) {
    selectedLedgerMonth = monthButton.dataset.ledgerMonth;
    renderLedgerCalendar();
    loadCustomerStatement();
  }

  if (rewardButton) {
    applyReward(rewardButton.dataset.applyReward);
  }

  if (udhaarReviewButton) {
    updateUdhaarRequest(udhaarReviewButton.dataset.udhaarRequestId, udhaarReviewButton.dataset.udhaarRequestStatus);
  }

  if (navigateButton) {
    const targetId = navigateButton.dataset.navigateTo;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (receiptButton) {
    printReceipt(receiptButton.dataset.receipt);
  }
});

document.addEventListener("error", (event) => {
  const image = event.target?.closest?.("[data-product-img]");
  if (!image) return;
  if (image.dataset.fallbackApplied === "1") {
    image.src = "./assets/kirana-hero.png";
    return;
  }
  image.dataset.fallbackApplied = "1";
  brokenProductImages.add(image.dataset.productImg);
  image.src = image.dataset.fallbackSrc || "./assets/kirana-hero.png";
}, true);

document.addEventListener("change", (event) => {
  saveLaunchChecklist(event);
  const variantSelect = event.target.closest("[data-variant-select]");
  if (variantSelect) updateVariantCard(variantSelect);
  const looseQuick = event.target.closest("[data-loose-quick]");
  if (looseQuick && looseQuick.value !== "custom") {
    const productId = looseQuick.dataset.looseQuick;
    const amountInput = document.querySelector(`[data-loose-value="${productId}"]`);
    const unitSelect = document.querySelector(`[data-loose-unit="${productId}"]`);
    if (amountInput) amountInput.value = looseQuick.value;
    if (unitSelect) unitSelect.value = "kg";
  }
});

$("#addProductImage")?.addEventListener("input", () => updateCatalogImagePreview("add"));
$("#updateProductImage")?.addEventListener("input", () => updateCatalogImagePreview("update"));

$("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.search.trim()) {
    state.category = "All";
    state.categoryId = "all";
    state.categoryFilter = "";
    state.showAllProducts = false;
    renderCategories();
  }
  renderSearchSuggestions();
  renderProducts();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-wrap")) {
    const suggestions = $("#searchSuggestions");
    if (suggestions) suggestions.hidden = true;
  }
});

$("#stockFilter").addEventListener("change", (event) => {
  state.stock = event.target.value;
  renderProducts();
});

$("#openCart").addEventListener("click", () => $("#cartDrawer").classList.add("open"));
$("#closeCart").addEventListener("click", () => $("#cartDrawer").classList.remove("open"));
$("#cartDrawer").addEventListener("click", (event) => {
  if (event.target.id === "cartDrawer") $("#cartDrawer").classList.remove("open");
});
$("#closeQuickView").addEventListener("click", closeQuickView);
$("#quickViewModal").addEventListener("click", (event) => {
  if (event.target.id === "quickViewModal") closeQuickView();
});

$("#websiteOrder").addEventListener("click", placeWebsiteOrder);
$("#paymentModes").addEventListener("change", async () => {
  state.paymentMode = selectedPaymentMode();
  if (state.paymentMode === "udhaar") {
    await handleUdhaarPaymentChoice();
  }
});
$("#whatsappOrder").addEventListener("click", (event) => {
  if (activeCartOrder()) {
    event.preventDefault();
    alert(t("activeOrderAddBlocked"));
    return;
  }
  if (!state.cart.size) {
    event.preventDefault();
    document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (!currentCustomer) {
    event.preventDefault();
    alert(t("loginBeforeWhatsapp"));
    $("#accountDrawer").classList.add("open");
    renderAccount();
    return;
  }
  event.currentTarget.href = whatsappOrderUrl();
});
$("#refreshOrders").addEventListener("click", loadAdminOrders);
$("#refreshRewards").addEventListener("click", loadAdminRewardApplications);
$("#refreshUdhaarRequests").addEventListener("click", loadAdminUdhaarRequests);
$("#refreshCatalogAdmin").addEventListener("click", refreshCatalogAdmin);
$("#quickCategoryForm").addEventListener("submit", addQuickCategory);
$("#addProductForm").addEventListener("submit", addAdminProduct);
$("#updateProductForm").addEventListener("submit", updateAdminProduct);
$("#updateProductSelect").addEventListener("change", () => fillUpdateProductForm());
$("#updateProductSearch").addEventListener("input", () => renderAdminCatalogManager());
$("#adminLoginForm").addEventListener("submit", loginAdmin);
$("#adminLogout").addEventListener("click", logoutAdmin);
document.querySelectorAll('a[href="/admin"]').forEach((link) => {
  link.addEventListener("click", () => sessionStorage.setItem("ksAdminNavClick", "1"));
});
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || link.target || link.hasAttribute("download")) return;
  const url = new URL(link.getAttribute("href"), window.location.origin);
  const appPaths = new Set(["/", "/admin", "/blog", "/udhaar", "/gallery", "/reviews", "/contact"]);
  if (url.origin !== window.location.origin || !appPaths.has(url.pathname)) return;
  event.preventDefault();
  navigateApp(url);
});
window.addEventListener("popstate", () => {
  state.route = routeFromPath();
  applyRoute();
  renderAdminGate();
  scrollForRoute(state.route === "store" ? window.location.hash : "");
});
$("#ledgerAdjustForm").addEventListener("submit", submitLedgerAdjustment);
$("#reviewForm").addEventListener("submit", submitReview);
$("#settleLedgerMonth").addEventListener("click", settleLedgerMonth);
$("#ledgerMonthInput").addEventListener("change", (event) => {
  selectedLedgerMonth = event.target.value || selectedLedgerMonth;
  renderLedgerCalendar();
  loadCustomerStatement();
});
$("#openAccount").addEventListener("click", () => {
  $("#accountDrawer").classList.add("open");
  renderAccount();
  loadCustomerOrders().catch((error) => alert(error.message));
});
$("#closeAccount").addEventListener("click", () => $("#accountDrawer").classList.remove("open"));
$("#accountDrawer").addEventListener("click", (event) => {
  if (event.target.id === "accountDrawer") $("#accountDrawer").classList.remove("open");
});
$("#accountForm").addEventListener("submit", loginCustomer);
$("#signupButton").addEventListener("click", signupCustomer);
$("#logoutButton").addEventListener("click", logoutCustomer);
$("#requestUdhaarButton").addEventListener("click", requestUdhaarAccount);

$("#languageToggle").addEventListener("click", () => {
  state.hindi = !state.hindi;
  applyLanguage();
  renderProducts();
  renderCart();
  renderOrders();
  renderLedger();
  renderRewardCards();
  renderAdminRewardApplications();
  renderAdminUdhaarRequests();
  renderAdminSummary(latestSummary);
  renderReviews();
  renderAdminCatalogManager();
  renderLaunchChecklist();
});

async function boot() {
  if ($("#productGrid")) $("#productGrid").innerHTML = catalogSkeleton();
  await loadBackendData();
  if (currentCustomer) {
    await loadCustomerOrders().catch(() => {
      saveCustomer(null);
      customerOrders = [];
    });
    await loadUdhaarRequest().catch(() => {
      udhaarRequest = null;
    });
  }
  if (backendOnline && adminSession?.token) {
    await loadAdminOrders();
  }
  applyLanguage();
  renderAdminGate();
  renderCategories();
  renderHomeSections();
  renderProducts();
  renderAdminCatalogManager();
  renderLaunchChecklist();
  renderCart();
  renderOrders();
  renderLedger();
  renderReviews();
  configureLiveRefresh();
  if (state.route === "store" && !window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}

boot();
