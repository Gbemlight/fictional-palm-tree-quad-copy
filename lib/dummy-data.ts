// ================= TYPES =================

export type TransactionStatus = "success" | "pending" | "failed";

export type TransactionType =
  | "airtime"
  | "data"
  | "electricity"
  | "tv";

// ================= USER =================

export const mockUser = {
  id: "user_001",
  name: "Sadiq Ahmad",
  email: "sadiq@quickpay.app",
  phone: "+2348012345678",
  walletBalance: 125000,
  currency: "NGN",
};

// ================= TRANSACTIONS =================

export const mockTransactions = [
  {
    id: "txn_001",
    type: "credit",
    amount: 25000,
    status: "success",
    description: "Wallet Funding",
    provider: "Bank Transfer",
    reference: "QKP-100001",
    date: "2026-03-06T10:15:00",
  },
  {
    id: "txn_002",
    type: "debit",
    amount: 2000,
    status: "success",
    description: "Airtime Purchase - MTN",
    provider: "MTN",
    reference: "QKP-100002",
    date: "2026-03-05T14:30:00",
  },
  {
    id: "txn_003",
    type: "debit",
    amount: 5000,
    status: "success",
    description: "Data Purchase - Airtel",
    provider: "Airtel",
    reference: "QKP-100003",
    date: "2026-03-04T09:00:00",
  },
  {
    id: "txn_004",
    type: "debit",
    amount: 15000,
    status: "success",
    description: "Electricity Bill - PHCN",
    provider: "PHCN",
    reference: "QKP-100004",
    date: "2026-03-03T16:45:00",
  },
  {
    id: "txn_005",
    type: "debit",
    amount: 3500,
    status: "pending",
    description: "TV Subscription - DSTV",
    provider: "DSTV",
    reference: "QKP-100005",
    date: "2026-03-02T11:20:00",
  },
  {
    id: "txn_006",
    type: "credit",
    amount: 10000,
    status: "success",
    description: "Received from John Doe",
    provider: "Wallet Transfer",
    reference: "QKP-100006",
    date: "2026-03-01T18:10:00",
  },
  {
    id: "txn_007",
    type: "debit",
    amount: 1200,
    status: "success",
    description: "Airtime Purchase - Glo",
    provider: "Glo",
    reference: "QKP-100007",
    date: "2026-02-28T08:55:00",
  },
  {
    id: "txn_008",
    type: "debit",
    amount: 8000,
    status: "failed",
    description: "Data Purchase - 9mobile",
    provider: "9mobile",
    reference: "QKP-100008",
    date: "2026-02-27T13:40:00",
  },
  {
    id: "txn_009",
    type: "credit",
    amount: 5000,
    status: "success",
    description: "Wallet Funding",
    provider: "Card Payment",
    reference: "QKP-100009",
    date: "2026-02-26T15:00:00",
  },
  {
    id: "txn_010",
    type: "debit",
    amount: 2500,
    status: "success",
    description: "Send Money to Jane Smith",
    provider: "Wallet Transfer",
    reference: "QKP-100010",
    date: "2026-02-25T19:30:00",
  },
];

// ================= SERVICE PROVIDERS =================

export const serviceProviders = {
  airtime: ["MTN", "Airtel", "Glo", "9mobile"],
  data: ["MTN", "Airtel", "Glo", "9mobile"],
  tv: ["DSTV", "GOTV"],
  electricity: ["PHCN"],
};

// ================= DATA PLANS =================

export const dataPlans = [
  { id: "data_001", provider: "MTN", name: "500MB - 7 Days", price: 500 },
  { id: "data_002", provider: "MTN", name: "1GB - 30 Days", price: 1000 },
  { id: "data_003", provider: "MTN", name: "2GB - 30 Days", price: 1800 },
  { id: "data_004", provider: "MTN", name: "5GB - 30 Days", price: 3500 },
  { id: "data_005", provider: "Airtel", name: "500MB - 7 Days", price: 500 },
  { id: "data_006", provider: "Airtel", name: "1GB - 30 Days", price: 1000 },
  { id: "data_007", provider: "Airtel", name: "2GB - 30 Days", price: 2000 },
  { id: "data_008", provider: "Airtel", name: "5GB - 30 Days", price: 3500 },
  { id: "data_009", provider: "Glo", name: "500MB - 7 Days", price: 400 },
  { id: "data_010", provider: "Glo", name: "1GB - 30 Days", price: 900 },
  { id: "data_011", provider: "Glo", name: "2GB - 30 Days", price: 1700 },
  { id: "data_012", provider: "Glo", name: "5GB - 30 Days", price: 3200 },
  { id: "data_013", provider: "9mobile", name: "500MB - 7 Days", price: 450 },
  { id: "data_014", provider: "9mobile", name: "1GB - 30 Days", price: 950 },
  { id: "data_015", provider: "9mobile", name: "2GB - 30 Days", price: 1750 },
  { id: "data_016", provider: "9mobile", name: "5GB - 30 Days", price: 3300 },
];

// ================= BENEFICIARIES =================

export const savedBeneficiaries = [
  {
    id: "ben_001",
    name: "Mum",
    type: "airtime",
    phone: "+2348098765432",
    provider: "MTN",
  },
  {
    id: "ben_002",
    name: "Home Electricity",
    type: "electricity",
    meterNumber: "12345678901",
    provider: "PHCN",
  },
];