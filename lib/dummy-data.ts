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
    type: "airtime" as TransactionType,
    amount: 2000,
    status: "success" as TransactionStatus,
    provider: "MTN",
    reference: "QKP-982134",
    date: "2026-02-20",
  },
  {
    id: "txn_002",
    type: "electricity" as TransactionType,
    amount: 15000,
    status: "success" as TransactionStatus,
    provider: "PHCN",
    reference: "QKP-982135",
    date: "2026-02-19",
  },
  {
    id: "txn_003",
    type: "data" as TransactionType,
    amount: 5000,
    status: "pending" as TransactionStatus,
    provider: "Airtel",
    reference: "QKP-982136",
    date: "2026-02-18",
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
  {
    id: "data_001",
    provider: "MTN",
    name: "1GB - 30 Days",
    price: 1000,
  },
  {
    id: "data_002",
    provider: "Airtel",
    name: "2GB - 30 Days",
    price: 2000,
  },
  {
    id: "data_003",
    provider: "Glo",
    name: "5GB - 30 Days",
    price: 3500,
  },
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