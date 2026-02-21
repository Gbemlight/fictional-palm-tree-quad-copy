// ================= USER =================

export const mockUser = {
  id: "user_001",
  name: "Sadiq Ibrahim",
  email: "sadiq@example.com",
  phone: "+2348012345678",
  walletBalance: 125000,
};

// ================= TRANSACTIONS =================

export const mockTransactions = [
  {
    id: "txn_001",
    type: "airtime",
    amount: 2000,
    status: "success",
    provider: "MTN",
    date: "2026-02-20",
  },
  {
    id: "txn_002",
    type: "electricity",
    amount: 15000,
    status: "success",
    provider: "PHCN",
    date: "2026-02-19",
  },
  {
    id: "txn_003",
    type: "data",
    amount: 5000,
    status: "pending",
    provider: "Airtel",
    date: "2026-02-18",
  },
];

// ================= SERVICE PROVIDERS =================

export const serviceProviders = {
  airtime: ["MTN", "Airtel", "Glo", "9mobile"],
  tv: ["DSTV", "GOTV"],
  electricity: ["PHCN"],
};

// ================= DATA PLANS =================

export const dataPlans = [
  {
    id: "data_1",
    provider: "MTN",
    plan: "1GB - 30 Days",
    price: 1000,
  },
  {
    id: "data_2",
    provider: "Airtel",
    plan: "2GB - 30 Days",
    price: 2000,
  },
  {
    id: "data_3",
    provider: "Glo",
    plan: "5GB - 30 Days",
    price: 3500,
  },
];

// ================= SAVED BENEFICIARIES =================

export const savedBeneficiaries = [
  {
    id: "ben_001",
    name: "Mum",
    phone: "+2348098765432",
    provider: "MTN",
  },
  {
    id: "ben_002",
    name: "John Electricity",
    meterNumber: "12345678901",
    provider: "PHCN",
  },
];