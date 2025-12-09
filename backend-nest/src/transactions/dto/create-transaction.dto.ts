export interface TransactionItemInput {
  type?: string;
  qty?: number;
  quantity?: number;
  basePrice?: number;
  price?: number;
  cost?: number;
  discountPerUnit?: number | null;
  productId?: number | null;
  packageId?: number | null;
}

export interface CreateTransactionDto {
  userId?: number;
  date?: string;
  items: TransactionItemInput[];
}

