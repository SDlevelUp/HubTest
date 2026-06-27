import path from "node:path";
import fs from "node:fs";
import type {
  Product,
  Client,
  Sale,
  Expense,
  Goal,
  Task,
  ContentItem,
  Launch,
  Account,
  PublicAccount,
} from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataPath = path.join(dataDir, "hub.json");

type DbShape = {
  seq: Record<string, number>;
  products: Product[];
  clients: Client[];
  sales: Sale[];
  expenses: Expense[];
  goals: Goal[];
  tasks: Task[];
  content: ContentItem[];
  launches: Launch[];
  accounts: Account[];
};

function empty(): DbShape {
  return {
    seq: {
      products: 0,
      clients: 0,
      sales: 0,
      expenses: 0,
      goals: 0,
      tasks: 0,
      content: 0,
      launches: 0,
      accounts: 0,
    },
    products: [],
    clients: [],
    sales: [],
    expenses: [],
    goals: [],
    tasks: [],
    content: [],
    launches: [],
    accounts: [],
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

// ---------- Tasks ----------
export function listTasks(): Task[] {
  return [...load().tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done - b.done;
    const da = a.due_date ?? "9999";
    const db = b.due_date ?? "9999";
    return da.localeCompare(db);
  });
}
export function createTask(
  title: string,
  priority: string,
  due_date: string | null
) {
  const data = load();
  data.tasks.push({
    id: nextId(data, "tasks"),
    title,
    done: 0,
    priority,
    due_date,
    created_at: nowSql(),
  });
  persist(data);
}
export function toggleTask(id: number, done: boolean) {
  const data = load();
  const t = data.tasks.find((x) => x.id === id);
  if (t) t.done = done ? 1 : 0;
  persist(data);
}
export function deleteTask(id: number) {
  const data = load();
  data.tasks = data.tasks.filter((t) => t.id !== id);
  persist(data);
}

// ---------- Content ----------
export function listContent(): ContentItem[] {
  return [...load().content].sort((a, b) =>
    (a.date ?? "").localeCompare(b.date ?? "")
  );
}
export function createContent(input: {
  title: string;
  channel: string;
  status: string;
  date: string | null;
  notes: string | null;
}) {
  const data = load();
  data.content.push({
    id: nextId(data, "content"),
    ...input,
    created_at: nowSql(),
  });
  persist(data);
}
export function updateContentStatus(id: number, status: string) {
  const data = load();
  const c = data.content.find((x) => x.id === id);
  if (c) c.status = status;
  persist(data);
}
export function deleteContent(id: number) {
  const data = load();
  data.content = data.content.filter((c) => c.id !== id);
  persist(data);
}

// ---------- Launches ----------
export function listLaunches(): Launch[] {
  return [...load().launches].sort((a, b) =>
    (b.start_date ?? "").localeCompare(a.start_date ?? "")
  );
}
export function createLaunch(input: {
  name: string;
  start_date: string | null;
  end_date: string | null;
  goal_amount: number;
  status: string;
  notes: string | null;
}) {
  const data = load();
  data.launches.push({
    id: nextId(data, "launches"),
    ...input,
    created_at: nowSql(),
  });
  persist(data);
}
export function deleteLaunch(id: number) {
  const data = load();
  data.launches = data.launches.filter((l) => l.id !== id);
  persist(data);
}

// ---------- Pending installments (alerts) ----------
export function pendingInstallments(): SaleRow[] {
  return listSales().filter(
    (s) => s.payment_plan !== "comptant" && s.installments_paid < s.installments_total
  );
}

// ---------- Accounts (espace client) ----------
function toPublic(a: Account): PublicAccount {
  const { password_hash: _h, salt: _s, ...rest } = a;
  void _h;
  void _s;
  return rest;
}

export function findAccountByUsername(username: string): Account | undefined {
  return load().accounts.find(
    (a) => a.username.toLowerCase() === username.toLowerCase()
  );
}

export function getAccount(id: number): Account | undefined {
  return load().accounts.find((a) => a.id === id);
}

export function listAccounts(): PublicAccount[] {
  return [...load().accounts]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(toPublic);
}

export function createAccount(input: {
  username: string;
  password_hash: string;
  salt: string;
  answers: Record<string, string>;
  status: "brouillon" | "soumis";
}): PublicAccount {
  const data = load();
  const now = nowSql();
  const account: Account = {
    id: nextId(data, "accounts"),
    ...input,
    created_at: now,
    updated_at: now,
  };
  data.accounts.push(account);
  persist(data);
  return toPublic(account);
}

export function updateAccountProfile(
  id: number,
  fields: { answers?: Record<string, string>; status?: "brouillon" | "soumis" }
): PublicAccount | undefined {
  const data = load();
  const a = data.accounts.find((x) => x.id === id);
  if (!a) return undefined;
  if (fields.answers) a.answers = fields.answers;
  if (fields.status) a.status = fields.status;
  a.updated_at = nowSql();
  persist(data);
  return toPublic(a);
}

export function deleteAccount(id: number) {
  const data = load();
  data.accounts = data.accounts.filter((a) => a.id !== id);
  persist(data);
}

export function publicAccount(a: Account): PublicAccount {
  return toPublic(a);
}

// ---------- Revenue by product ----------
export function revenueByProduct(sinceISO: string): { name: string; total: number }[] {
  const data = load();
  const map = new Map<string, number>();
  for (const s of data.sales) {
    if (s.sold_at < sinceISO) continue;
    const name =
      data.products.find((p) => p.id === s.product_id)?.name ?? "Sans produit";
    map.set(name, (map.get(name) ?? 0) + s.amount_gross);
  }
  return [...map.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}
