import type { components } from "./pesona-hub-api";

// API Product type from the schema
type ApiProduct = components["schemas"]["ProductCreate"];

// Extended Product interface for UI display
interface Product extends ApiProduct {
  title?: string; // Alias for name from API
  image?: string;
  price?: string;
  contact?: string;
  catalogType?: string;
  kps?: string;
  kups?: string;
  size?: string;
  isNew?: boolean;
  link?: string;
}

export type { Product, ApiProduct };
