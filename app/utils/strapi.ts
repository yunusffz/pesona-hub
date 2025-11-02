import type {
  StrapiFilter,
  StrapiPopulate,
  UseStrapiParamsOptions,
} from "~/types/strapi";

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
// Helper functions for building Strapi query parameters
export const buildStrapiParams = (options: UseStrapiParamsOptions) => {
  const params = new URLSearchParams();

  // Search parameter
  if (options.search) {
    params.append("search", options.search);
  }

  // Filters parameter - support both nested object and string formats
  // Handle filters that might be a getter function
  const filtersValue =
    typeof options.filters === "function" ? options.filters() : options.filters;

  // Only process filters if they exist and are not empty
  if (filtersValue) {
    const isEmptyObject =
      typeof filtersValue === "object" &&
      !Array.isArray(filtersValue) &&
      filtersValue !== null &&
      Object.keys(filtersValue).length === 0;

    if (!isEmptyObject) {
      console.log("buildStrapiParams - Processing filters:", filtersValue);

      if (typeof filtersValue === "string") {
        params.append("filters", filtersValue);
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
              // Check if this object contains operators (like { $in: [...] })
              const hasOperators = Object.keys(value).some((k) =>
                k.startsWith("$")
              );

              if (hasOperators) {
                // This object contains operators, handle each operator
                Object.entries(value).forEach(([operator, operatorValue]) => {
                  // Build the final key properly
                  // We need to reconstruct the path properly
                  const pathSegments = prefix
                    ? prefix.split("[").map((seg) => seg.replace("]", ""))
                    : [];
                  pathSegments.push(key);
                  const fullPath = pathSegments.join("][");
                  const baseKey = `filters[${fullPath}][${operator}]`;

                  console.log(
                    `Building key: prefix="${prefix}", key="${key}", operator="${operator}"`
                  );
                  console.log(`Base key: ${baseKey}`);

                  if (Array.isArray(operatorValue)) {
                    // Handle array values for operators like $in
                    // Strapi expects indexed format: filters[field][$in][0]=value1&filters[field][$in][1]=value2
                    if (operatorValue.length > 0) {
                      console.log(
                        `Processing array for ${baseKey}:`,
                        operatorValue
                      );
                      operatorValue.forEach((item, index) => {
                        const paramKey = `${baseKey}[${index}]`;
                        params.append(paramKey, String(item));
                        console.log(
                          `Added filter param: ${paramKey} = ${item}`
                        );
                      });
                    } else {
                      console.warn(`Empty array for ${baseKey}, skipping`);
                    }
                  } else {
                    params.append(baseKey, String(operatorValue));
                  }
                });
              } else {
                // Recursively handle nested objects
                console.log(
                  `Recursive call: prefix="${prefix}", key="${key}", paramKey="${paramKey}"`
                );
                addNestedFilter(value, paramKey);
              }
            } else {
              // Handle primitive values
              const finalKey = prefix
                ? `filters[${prefix}][${key}]`
                : `filters[${key}]`;
              params.append(finalKey, String(value));
            }
          });
        };

        addNestedFilter(filtersValue);

        // Debug: Log the generated parameters
        console.log("Generated URL parameters:");
        for (const [key, value] of params.entries()) {
          console.log(`${key}: ${value}`);
        }
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
  }
};
