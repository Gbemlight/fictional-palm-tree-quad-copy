// ================= TYPES =================

export type TransactionStatus = "success" | "pending" | "failed" | "processing" | "cancelled";

export type TransactionType =
  | "airtime"
  | "data"
  | "electricity"
  | "tv"
  | "wallet_credit"
  | "wallet_debit";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  provider: string;
  reference: string;
  date: string; // ISO string
  description: string;
  recipient?: string;
  fee?: number;
  paymentMethod?: string;
};

// ================= USER =================

export const mockUser = {
  id: "user_001",
  name: "Adeyanju Oluwadamilare",
  email: "oluwadamilare@quickpay.app",
  phone: "+2348012345678",
  walletBalance: 125000,
  currency: "NGN",
};

// ================= TRANSACTIONS =================

export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "airtime",
    amount: 2000,
    status: "success",
    provider: "MTN",
    reference: "QKP-982134",
    date: "2026-03-08T14:30:00Z",
    description: "MTN Airtime Top-up",
    recipient: "08012345678",
    fee: 0,
    paymentMethod: "Wallet Balance",
  },
  {
    id: "txn_002",
    type: "electricity",
    amount: 15000,
    status: "success",
    provider: "PHCN",
    reference: "QKP-982135",
    date: "2026-03-07T10:15:00Z",
    description: "PHCN Electricity Bill",
    recipient: "12345678901",
    fee: 100,
    paymentMethod: "Wallet Balance",
  },
  {
    id: "txn_003",
    type: "data",
    amount: 5000,
    status: "pending",
    provider: "Airtel",
    reference: "QKP-982136",
    date: "2026-03-06T18:00:00Z",
    description: "Airtel 5GB Data Bundle",
    recipient: "07012345678",
    fee: 0,
    paymentMethod: "Wallet Balance",
  },
  {
    id: "txn_004",
    type: "wallet_credit",
    amount: 10000,
    status: "success",
    provider: "Bank Transfer",
    reference: "QKP-982137",
    date: "2026-03-08T09:00:00Z",
    description: "Wallet Top-up",
    recipient: mockUser.name,
    fee: 0,
    paymentMethod: "Bank Transfer",
  },
  // Generate 47 more dummy transactions deterministically
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `txn_${i + 5}`, // Adjusted index for new txn_004
    type: ["airtime", "data", "electricity", "tv", "wallet_credit", "wallet_debit"][i % 6] as TransactionType,
    amount: 1000 + (i * 250) % 20000, // Vary amount
    status: (["success", "pending", "failed", "processing", "cancelled"] as const)[i % 5], // Vary status
    provider: ["MTN", "Airtel", "Glo", "9mobile", "PHCN", "DSTV", "GOTV", "Bank Transfer"][i % 8], // Vary provider
    reference: `QKP-${100000 + i * 1234}`, // Unique reference
    date: (() => {
      const baseDate = new Date('2024-01-15T12:00:00Z'); // Fixed base date for deterministic generation
      const transactionDate = new Date(baseDate);
      transactionDate.setDate(baseDate.getDate() - (i % 30)); // Subtract days deterministically
      return transactionDate.toISOString();
    })(),
    description: `${
      ["MTN Airtime", "Airtel Data", "PHCN Bill", "DSTV Subscription", "Wallet Top-up", "Wallet Withdrawal"][i % 6]
    } for ${
      ["John Doe", "Jane Smith", "08012345678", "12345678901"][i % 4]
    }`,
    recipient: ["08012345678", "12345678901", "John Doe"][i % 3],
    fee: (i % 5 === 0 && ["electricity", "tv"].includes(["airtime", "data", "electricity", "tv", "wallet_credit", "wallet_debit"][i % 6])) ? 50 : 0, // Some fees
    paymentMethod: ["Wallet Balance", "Card", "Bank Transfer"][i % 3],
  })),
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