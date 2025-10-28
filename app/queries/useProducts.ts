import { useQuery } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";

// The API now returns generic Dict[str, Any] types
type ListResponse =
  components["schemas"]["ListResponse_Dict_str__Any__-Output"];
type BaseResponse = components["schemas"]["BaseResponse_Dict_str__Any__"];

// Strapi-style filter types
interface StrapiFilter {
  [key: string]: any;
}

interface StrapiPopulate {
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

interface UseProductsOptions {
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

// Helper functions for building Strapi query parameters
const buildStrapiParams = (options: UseProductsOptions): URLSearchParams => {
  const params = new URLSearchParams();

  // Search parameter
  if (options.search) {
    params.append("search", options.search);
  }

  // Filters parameter - support both nested object and string formats
  if (options.filters) {
    if (typeof options.filters === "string") {
      params.append("filters", options.filters);
    } else {
      // Handle nested filter objects
      const addNestedFilter = (obj: any, prefix: string = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const paramKey = prefix ? `${prefix}[${key}]` : key;

          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            // Recursively handle nested objects
            addNestedFilter(value, paramKey);
          } else {
            // Handle primitive values and arrays
            const finalKey = prefix
              ? `filters[${prefix}][${key}]`
              : `filters[${key}]`;
            params.append(finalKey, String(value));
          }
        });
      };

      addNestedFilter(options.filters);
    }
  }

  // Populate parameter - support both array and object formats
  if (options.populate) {
    if (typeof options.populate === "string") {
      // Handle comma-separated string format
      const populateFields = options.populate.split(",");
      populateFields.forEach((field, index) => {
        params.append(`populate[${index}]`, field.trim());
      });
    } else if (Array.isArray(options.populate)) {
      // Handle array format
      options.populate.forEach((field, index) => {
        params.append(`populate[${index}]`, field);
      });
    } else {
      // Handle object format (legacy)
      params.append("populate", JSON.stringify(options.populate));
    }
  }

  // Fields parameter - support both array and object formats
  if (options.fields && options.fields.length > 0) {
    options.fields.forEach((field, index) => {
      params.append(`fields[${index}]`, field);
    });
  }

  // Sort parameter
  if (options.sort) {
    if (typeof options.sort === "string") {
      params.append("sort", options.sort);
    } else {
      const sortArray = Object.entries(options.sort).map(
        ([key, value]) => `${key}:${value}`
      );
      params.append("sort", sortArray.join(","));
    }
  }

  // Pagination parameter
  if (options.pagination) {
    if (options.pagination.page !== undefined) {
      params.append("pagination[page]", options.pagination.page.toString());
    }
    if (options.pagination.page_size !== undefined) {
      params.append(
        "pagination[page_size]",
        options.pagination.page_size.toString()
      );
    }
    if (options.pagination.start !== undefined) {
      params.append("pagination[start]", options.pagination.start.toString());
    }
    if (options.pagination.limit !== undefined) {
      params.append("pagination[limit]", options.pagination.limit.toString());
    }
  } else if (options.page || options.limit) {
    // Legacy pagination support
    if (options.page !== undefined) {
      params.append("pagination[page]", options.page.toString());
    }
    if (options.limit !== undefined) {
      params.append("pagination[page_size]", options.limit.toString());
    }
  }

  return params;
};

export const useProducts = (options: UseProductsOptions = {}) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["products", options],
    queryFn: async (): Promise<ListResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/products${queryString ? `?${queryString}` : ""}`
      );

      if (error) {
        throw new Error(`Failed to fetch products: ${error}`);
      }

      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (
  productId: string | number,
  options: Omit<UseProductsOptions, "pagination" | "page" | "limit"> = {}
) => {
  const { $apiClient } = useNuxtApp();

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["product", productId, options],
    queryFn: async (): Promise<BaseResponse> => {
      const params = buildStrapiParams(options);
      const queryString = params.toString();

      const { data, error } = await $apiClient.GET(
        `/products/{product_id}${queryString ? `?${queryString}` : ""}`,
        {
          params: {
            path: {
              product_id: productId.toString(),
            },
          },
        }
      );

      if (error) {
        throw new Error(`Failed to fetch product: ${error}`);
      }

      return data;
    },
    enabled: !!productId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Utility functions for common Strapi operations
export const createStrapiFilters = {
  // Equal filter
  eq: (field: string, value: any) => ({ [field]: { $eq: value } }),

  // Not equal filter
  ne: (field: string, value: any) => ({ [field]: { $ne: value } }),

  // Greater than filter
  gt: (field: string, value: any) => ({ [field]: { $gt: value } }),

  // Greater than or equal filter
  gte: (field: string, value: any) => ({ [field]: { $gte: value } }),

  // Less than filter
  lt: (field: string, value: any) => ({ [field]: { $lt: value } }),

  // Less than or equal filter
  lte: (field: string, value: any) => ({ [field]: { $lte: value } }),

  // Contains filter
  contains: (field: string, value: any) => ({ [field]: { $contains: value } }),

  // In filter
  in: (field: string, values: any[]) => ({ [field]: { $in: values } }),

  // Not in filter
  notIn: (field: string, values: any[]) => ({ [field]: { $notIn: values } }),

  // Between filter
  between: (field: string, start: any, end: any) => ({
    [field]: { $between: [start, end] },
  }),

  // And filter
  and: (...filters: StrapiFilter[]) => ({ $and: filters }),

  // Or filter
  or: (...filters: StrapiFilter[]) => ({ $or: filters }),

  // Not filter
  not: (filter: StrapiFilter) => ({ $not: filter }),
};

export const createStrapiPopulate = {
  // Populate all relations
  all: () => "*",

  // Populate specific fields
  fields: (relation: string, fields: string[]) => ({
    [relation]: { fields },
  }),

  // Populate nested relations
  nested: (relation: string, nestedPopulate: StrapiPopulate) => ({
    [relation]: { populate: nestedPopulate },
  }),

  // Populate with specific fields and nested populate
  fieldsAndPopulate: (
    relation: string,
    fields: string[],
    nestedPopulate: StrapiPopulate
  ) => ({
    [relation]: { fields, populate: nestedPopulate },
  }),
};

export const createStrapiSort = {
  // Sort by field ascending
  asc: (field: string) => ({ [field]: "asc" as const }),

  // Sort by field descending
  desc: (field: string) => ({ [field]: "desc" as const }),

  // Multiple sorts
  multiple: (...sorts: Array<{ [key: string]: "asc" | "desc" }>) =>
    Object.assign({}, ...sorts),
};

export const createStrapiPagination = {
  // Page-based pagination
  page: (page: number, page_size: number) => ({ page, page_size }),

  // Offset-based pagination
  offset: (start: number, limit: number) => ({ start, limit }),
};

/*
Example usage:

// Basic usage with search and pagination
const { data: products } = useProducts({
  search: "laptop",
  pagination: createStrapiPagination.page(1, 10)
});

// Advanced filtering with nested relations
const { data: filteredProducts } = useProducts({
  filters: {
    social_forestry_business_group: {
      name: {
        $eq: "KUPS Hutan Hijau"
      }
    }
  },
  populate: ["social_forestry_business_group.contact"],
  fields: ["name", "price", "description"],
  sort: createStrapiSort.desc("createdAt")
});

// Array-based populate (Strapi v4+ format)
const { data: productsWithArrayPopulate } = useProducts({
  populate: [
    "social_forestry_business_group.contact",
    "category",
    "images"
  ],
  fields: [
    "social_forestry_business_group.name",
    "name",
    "price"
  ]
});

// Single product with populate
const { data: product } = useProduct("123", {
  populate: createStrapiPopulate.fieldsAndPopulate(
    "category",
    ["name", "slug"],
    createStrapiPopulate.fields("parent", ["name"])
  ),
  fields: ["name", "price", "description", "images"]
});

// Complex populate with nested relations (object format)
const { data: productsWithRelations } = useProducts({
  populate: {
    category: {
      fields: ["name", "slug"],
      populate: {
        parent: true
      }
    },
    images: {
      fields: ["url", "alt"]
    },
    reviews: {
      fields: ["rating", "comment"],
      populate: {
        user: {
          fields: ["name", "avatar"]
        }
      }
    }
  }
});

// String-based parameters (alternative syntax)
const { data: simpleProducts } = useProducts({
  filters: '{"category":{"$eq":"electronics"},"price":{"$gte":100}}',
  populate: "category,images",
  fields: ["name", "price"],
  sort: "price:asc,createdAt:desc"
});

// Multiple nested filters
const { data: complexFilteredProducts } = useProducts({
  filters: {
    social_forestry_business_group: {
      name: {
        $eq: "KUPS Hutan Hijau"
      },
      contact: {
        email: {
          $contains: "@gmail.com"
        }
      }
    },
    price: {
      $gte: 100,
      $lte: 1000
    }
  }
});
*/
