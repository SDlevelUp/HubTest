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
