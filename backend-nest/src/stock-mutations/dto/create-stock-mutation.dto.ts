export interface CreateStockMutationDto {
  productId: number;
  type: string;
  condition: string;
  quantity: number;
  date: string;
  reseller?: string;
  productionDate?: string | null;
}

