export type Product = {
  id: number;
  name: string;
  price: number;
  recurring: number;
  created_at: string;
};

export type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export type Sale = {
  id: number;
  client_id: number | null;
  product_id: number | null;
  amount_gross: number;
  amount_net: number;
  payment_plan: string;
  installments_paid: number;
  installments_total: number;
  sold_at: string;
  created_at: string;
};

export type Expense = {
  id: number;
  label: string;
  amount: number;
  category: string | null;
  spent_at: string;
  created_at: string;
};

export type Goal = {
  id: number;
  year: number;
  target_amount: number;
};

export type Task = {
  id: number;
  title: string;
  done: number;
  priority: string;
  due_date: string | null;
  created_at: string;
};

export type ContentItem = {
  id: number;
  title: string;
  channel: string;
  status: string;
  date: string | null;
  notes: string | null;
  created_at: string;
};

export type Launch = {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  goal_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
};

export type Account = {
  id: number;
  username: string;
  password_hash: string;
  salt: string;
  full_name: string;
  email: string;
  phone: string;
  activity: string;
  level: string;
  objectives: string;
  budget: string;
  availability: string;
  message: string;
  status: "brouillon" | "soumis";
  created_at: string;
  updated_at: string;
};

// Account without secrets, safe to send to the client
export type PublicAccount = Omit<Account, "password_hash" | "salt">;
