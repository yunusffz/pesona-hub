// Product interface based on the API schema
export interface ApiProduct {
  id?: number;
  name: string;
  description?: string | null;
  product_usage?: string | null;
  value_chain?: string | null;
  thumbnails?: unknown[] | null;
  price?: number | null;
  unit?: string | null;
  social_forestry_business_group_id?: number | null;
  commodity_id?: number | null;
  metadatas?: Record<string, unknown>[] | Record<string, unknown> | null;
  // Additional fields that might be populated
  social_forestry_group?: {
    name?: string;
    [key: string]: unknown;
  };
  social_forestry_business_group?: {
    name?: string;
    contact?: {
      chief_contact?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  // Allow for additional unknown fields
  [key: string]: unknown;
}
