import path from "node:path";
import fs from "node:fs";
import type { Product, Client, Sale, Expense, Goal } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataPath = path.join(dataDir, "hub.json");

type DbShape = {
  seq: Record<string, number>;
  products: Product[];
  clients: Client[];
  sales: Sale[];
  expenses: Expense[];
  goals: Goal[];
};

function empty(): DbShape {
  return {
    seq: { products: 0, clients: 0, sales: 0, expenses: 0, goals: 0 },
    products: [],
    clients: [],
    sales: [],
    expenses: [],
    goals: [],
  };
}

declare global {
  var __hubData: DbShape | undefined;
}

function load(): DbShape {
  if (global.__hubData) return global.__hubData;
  let data: DbShape;
  try {
    if (fs.existsSync(dataPath)) {
      data = { ...empty(), ...JSON.parse(fs.readFileSync(dataPath, "utf8")) };
    } else {
      data = empty();
    }
  } catch {
    data = empty();
  }
  global.__hubData = data;
  return data;
}

function persist(data: DbShape) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
}

function nextId(data: DbShape, table: keyof DbShape["seq"]): number {
  data.seq[table] = (data.seq[table] ?? 0) + 1;
  return data.seq[table];
}

function nowSql(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

// ---------- Products ----------
export function listProducts(): Product[] {
  return [...load().products].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}
export function createProduct(name: string, price: number, recurring: boolean) {
  const data = load();
  data.products.push({
    id: nextId(data, "products"),
    name,
    price,
    recurring: recurring ? 1 : 0,
    created_at: nowSql(),
  });
  persist(data);
}
export function deleteProduct(id: number) {
  const data = load();
  data.products = data.products.filter((p) => p.id !== id);
  persist(data);
}

// ---------- Clients ----------
export function listClients(): Client[] {
  return [...load().clients].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}
export function createClient(
  name: string,
  email: string | null,
  phone: string | null,
  notes: string | null
) {
  const data = load();
  data.clients.push({
    id: nextId(data, "clients"),
    name,
    email,
    phone,
    notes,
    created_at: nowSql(),
  });
  persist(data);
}
export function deleteClient(id: number) {
  const data = load();
  data.clients = data.clients.filter((c) => c.id !== id);
  persist(data);
}

// ---------- Sales ----------
export type SaleRow = Sale & {
  client_name: string | null;
  product_name: string | null;
};

export function listSales(): SaleRow[] {
  const data = load();
  return [...data.sales]
    .sort((a, b) => b.sold_at.localeCompare(a.sold_at))
    .map((s) => ({
      ...s,
      client_name: data.clients.find((c) => c.id === s.client_id)?.name ?? null,
      product_name:
        data.products.find((p) => p.id === s.product_id)?.name ?? null,
    }));
}
export function salesSince(iso: string): Sale[] {
  return load().sales.filter((s) => s.sold_at >= iso);
}
export function allSales(): Sale[] {
  return load().sales;
}
export function recurringSalesSince(iso: string): Sale[] {
  const data = load();
  const recurringIds = new Set(
    data.products.filter((p) => p.recurring === 1).map((p) => p.id)
  );
  return data.sales.filter(
    (s) => s.product_id !== null && recurringIds.has(s.product_id) && s.sold_at >= iso
  );
}
export function createSale(input: {
  client_id: number | null;
  product_id: number | null;
  amount_gross: number;
  amount_net: number;
  payment_plan: string;
  installments_paid: number;
  installments_total: number;
  sold_at: string;
}) {
  const data = load();
  data.sales.push({
    id: nextId(data, "sales"),
    ...input,
    created_at: nowSql(),
  });
  persist(data);
}
export function updateSaleInstallments(id: number, installments_paid: number) {
  const data = load();
  const sale = data.sales.find((s) => s.id === id);
  if (sale) sale.installments_paid = installments_paid;
  persist(data);
}
export function deleteSale(id: number) {
  const data = load();
  data.sales = data.sales.filter((s) => s.id !== id);
  persist(data);
}

// ---------- Expenses ----------
export function listExpenses(): Expense[] {
  return [...load().expenses].sort((a, b) => b.spent_at.localeCompare(a.spent_at));
}
export function expensesTotalSince(iso: string): number {
  return load()
    .expenses.filter((e) => e.spent_at >= iso)
    .reduce((sum, e) => sum + e.amount, 0);
}
export function createExpense(
  label: string,
  amount: number,
  category: string | null,
  spent_at: string
) {
  const data = load();
  data.expenses.push({
    id: nextId(data, "expenses"),
    label,
    amount,
    category,
    spent_at,
    created_at: nowSql(),
  });
  persist(data);
}
export function deleteExpense(id: number) {
  const data = load();
  data.expenses = data.expenses.filter((e) => e.id !== id);
  persist(data);
}

// ---------- Goals ----------
export function listGoals(): Goal[] {
  return [...load().goals].sort((a, b) => b.year - a.year);
}
export function getGoal(year: number): Goal | undefined {
  return load().goals.find((g) => g.year === year);
}
export function upsertGoal(year: number, target_amount: number) {
  const data = load();
  const existing = data.goals.find((g) => g.year === year);
  if (existing) {
    existing.target_amount = target_amount;
  } else {
    data.goals.push({ id: nextId(data, "goals"), year, target_amount });
  }
  persist(data);
}
