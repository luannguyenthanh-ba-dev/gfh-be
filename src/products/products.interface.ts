import { ProductCurrencies } from "./products.const";

export interface IProductFilters {
  id?: string;
  name?: string;
  price?: number;
  currency?: ProductCurrencies;
  brand?: string;
  from?: string | number; // UTC Timestamp | Unix Timestamp
  to?: string | number; // UTC Timestamp | Unix Timestamp
}
