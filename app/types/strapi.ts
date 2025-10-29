export interface StrapiFilter {
  [key: string]: any;
}

export interface StrapiPopulate {
  [key: string]:
    | {
        fields?: string[];
        populate?: StrapiPopulate;
      }
    | boolean;
}

interface StrapiSort {
  [key: string]: "asc" | "desc";
}

interface StrapiPagination {
  page?: number;
  page_size?: number;
  start?: number;
  limit?: number;
}

export interface UseStrapiParamsOptions {
  // Basic search
  search?: string;

  // Strapi-style parameters
  filters?: StrapiFilter | string;
  populate?: StrapiPopulate | string | string[];
  fields?: string[];
  sort?: StrapiSort | string;
  pagination?: StrapiPagination;

  // Legacy pagination (for backward compatibility)
  page?: number;
  limit?: number;

  // Query options
  enabled?: boolean;
}
