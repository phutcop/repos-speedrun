/* =====================================================
   MOCK DATA
   Placeholder numbers only - for laying out the UI.
   Replace with real API responses once the backend
   (upload → categorize → analyze) is wired in.
   ===================================================== */

export const summaryCards = [
  {
    id: "card-1",
    label: "Total Monthly Spend",
    value: "$118,400",
    delta: "+4.2% vs last month",
    trend: "up",
  },
  {
    id: "card-2",
    label: "Savings Identified",
    value: "$19,800",
    delta: "Reinvest into Engineering",
    trend: "flag",
  },
];

export const timeVsExpense = [
  { month: "Feb", expense: 92000 },
  { month: "Mar", expense: 97500 },
  { month: "Apr", expense: 101200 },
  { month: "May", expense: 99800 },
  { month: "Jun", expense: 107300 },
  { month: "Jul", expense: 118400 },
];

export const categoryDistribution = [
  { name: "Salaries & Payroll", value: 54, color: "#212842" },
  { name: "Cloud Services", value: 14, color: "#3f5b8a" },
  { name: "Software", value: 9, color: "#6c86b8" },
  { name: "Marketing", value: 11, color: "#9eccfa" },
  { name: "Office & Ops", value: 8, color: "#c9def5" },
  { name: "Other", value: 4, color: "#e4edfa" },
];

export const departmentSpend = [
  { department: "Engineering", spend: 48200 },
  { department: "Sales", spend: 22600 },
  { department: "Marketing", spend: 17300 },
  { department: "Customer Success", spend: 11400 },
  { department: "Operations", spend: 12100 },
  { department: "Finance", spend: 6800 },
];

export const balanceSheetSummary = {
  assets: [
    { label: "Cash & Bank", value: "$185,000" },
    { label: "Accounts Receivable", value: "$142,000" },
    { label: "Inventory", value: "$174,000" },
    { label: "Equipment & Property", value: "$835,000" },
  ],
  liabilities: [
    { label: "Accounts Payable", value: "$88,000" },
    { label: "Short-term Loan", value: "$60,000" },
    { label: "Long-term Loan", value: "$260,000" },
    { label: "Lease Liability", value: "$45,000" },
  ],
};

export const reinvestmentSuggestion = {
  from: { label: "IT Office Overhead", amount: "$8,200 / mo", note: "3 of 9 seats idle · office at 40% capacity" },
  to: { label: "Engineering Cloud Capacity", amount: "$8,200 / mo", note: "Highest revenue-per-dollar department" },
  impact: "+$7,300 est. monthly profit if reinvested",
};
