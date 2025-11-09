/**
 * Activity Logging Examples
 *
 * This file contains practical examples of using the useProductActivityLogger composable
 * Copy and adapt these examples for your use case
 */

import { useProductActivityLogger } from "~/composables/useProductActivityLogger";
import type { ProductWithRelations } from "~/types/product";

// ============================================================================
// Example 1: Product Catalog List - Log Click to Detail
// ============================================================================
export function useProductCatalogLogging() {
  const { logProductClick } = useProductActivityLogger();

  const handleProductClick = (product: ProductWithRelations) => {
    logProductClick(product, {
      clickTarget: "product_card",
      accessType: "public",
      extraData: {
        source: "catalog_list",
        position_in_list: product.id,
      },
    });
  };

  return { handleProductClick };
}

// ============================================================================
// Example 2: Product Detail - Track View Duration
// ============================================================================
export function useProductDetailViewTracking() {
  const { logProductView } = useProductActivityLogger();
  let viewStartTime: number | null = null;

  const startViewTracking = (product: ProductWithRelations) => {
    viewStartTime = Date.now();
    logProductView(product, {
      accessType: "public",
    });
  };

  const endViewTracking = (product: ProductWithRelations) => {
    if (viewStartTime) {
      const viewDuration = Date.now() - viewStartTime;
      logProductView(product, {
        accessType: "public",
        viewDuration,
      });
    }
  };

  return { startViewTracking, endViewTracking };
}

// ============================================================================
// Example 3: Shopping Cart - Log Add to Cart
// ============================================================================
export function useCartLogging() {
  const { logCustomEvent } = useProductActivityLogger();

  const logAddToCart = (
    product: ProductWithRelations,
    quantity: number,
    options?: {
      variant?: string;
      promo_code?: string;
    }
  ) => {
    logCustomEvent("create", product, {
      accessType: "public",
      extraData: {
        action: "add_to_cart",
        quantity,
        variant: options?.variant,
        promo_code: options?.promo_code,
        timestamp: Date.now(),
      },
    });
  };

  const logRemoveFromCart = (product: ProductWithRelations) => {
    logCustomEvent("delete", product, {
      accessType: "public",
      extraData: {
        action: "remove_from_cart",
        timestamp: Date.now(),
      },
    });
  };

  return { logAddToCart, logRemoveFromCart };
}

// ============================================================================
// Example 4: Product Comparison - Log Comparison Actions
// ============================================================================
export function useProductComparisonLogging() {
  const { logCustomEvent } = useProductActivityLogger();

  const logProductComparison = (products: ProductWithRelations[]) => {
    // Log for each product being compared
    products.forEach((product, index) => {
      logCustomEvent("view", product, {
        accessType: "public",
        extraData: {
          action: "product_comparison",
          comparison_position: index + 1,
          total_compared: products.length,
          compared_with: products
            .filter((p) => p.id !== product.id)
            .map((p) => p.id),
        },
      });
    });
  };

  return { logProductComparison };
}

// ============================================================================
// Example 5: Wishlist/Favorite - Log Save Actions
// ============================================================================
export function useWishlistLogging() {
  const { logCustomEvent } = useProductActivityLogger();

  const logAddToWishlist = (product: ProductWithRelations) => {
    logCustomEvent("create", product, {
      accessType: "public",
      extraData: {
        action: "add_to_wishlist",
        timestamp: Date.now(),
      },
    });
  };

  const logRemoveFromWishlist = (product: ProductWithRelations) => {
    logCustomEvent("delete", product, {
      accessType: "public",
      extraData: {
        action: "remove_from_wishlist",
        timestamp: Date.now(),
      },
    });
  };

  return { logAddToWishlist, logRemoveFromWishlist };
}

// ============================================================================
// Example 6: Product Export/Download - Log Export Actions
// ============================================================================
export function useProductExportLogging() {
  const { logCustomEvent } = useProductActivityLogger();

  const logProductExport = (
    product: ProductWithRelations,
    format: "pdf" | "excel" | "csv"
  ) => {
    logCustomEvent("export", product, {
      accessType: "internal",
      extraData: {
        export_format: format,
        timestamp: Date.now(),
      },
    });
  };

  const logProductImageDownload = (
    product: ProductWithRelations,
    imageUrl: string
  ) => {
    logCustomEvent("download", product, {
      accessType: "public",
      extraData: {
        download_type: "product_image",
        image_url: imageUrl,
        timestamp: Date.now(),
      },
    });
  };

  return { logProductExport, logProductImageDownload };
}

// ============================================================================
// Example 7: Search Results - Log Search Interactions
// ============================================================================
export function useSearchResultLogging() {
  const { logProductClick } = useProductActivityLogger();

  const logSearchResultClick = (
    product: ProductWithRelations,
    searchQuery: string,
    resultPosition: number
  ) => {
    logProductClick(product, {
      clickTarget: "search_result",
      accessType: "public",
      extraData: {
        search_query: searchQuery,
        result_position: resultPosition,
        timestamp: Date.now(),
      },
    });
  };

  return { logSearchResultClick };
}

// ============================================================================
// Example 8: Filter/Sort - Log User Preferences
// ============================================================================
export function useProductFilterLogging() {
  const { logCustomEvent } = useProductActivityLogger();

  const logFilterApplied = (
    products: ProductWithRelations[],
    filters: Record<string, any>
  ) => {
    // Log first product in filtered results as representative
    if (products.length > 0) {
      logCustomEvent("view", products[0], {
        accessType: "public",
        extraData: {
          action: "filter_applied",
          filters: filters,
          results_count: products.length,
          timestamp: Date.now(),
        },
      });
    }
  };

  return { logFilterApplied };
}

// ============================================================================
// Example 9: Bulk Actions - Log Multiple Products
// ============================================================================
export function useBulkProductLogging() {
  const { logCustomEvent, getProductLogData } = useProductActivityLogger();

  const logBulkExport = (products: ProductWithRelations[], format: string) => {
    // Create a summary log with all product IDs
    const productIds = products.map((p) => p.id);

    // Log on the first product with bulk context
    if (products.length > 0) {
      logCustomEvent("export", products[0], {
        accessType: "internal",
        extraData: {
          action: "bulk_export",
          export_format: format,
          product_count: products.length,
          product_ids: productIds,
          timestamp: Date.now(),
        },
      });
    }
  };

  return { logBulkExport };
}

// ============================================================================
// Example 10: Complete Component Example - Product Card
// ============================================================================
export function useProductCardLogging() {
  const {
    logProductClick,
    logProductView,
    logProductShare,
  } = useProductActivityLogger();

  // Log when card is visible (intersection observer)
  const logProductImpression = (product: ProductWithRelations) => {
    logProductView(product, {
      accessType: "public",
      viewDuration: 0, // Impression tracking
    });
  };

  // Log card click
  const logCardClick = (product: ProductWithRelations, clickTarget: string) => {
    logProductClick(product, {
      clickTarget,
      accessType: "public",
      extraData: {
        component: "product_card",
      },
    });
  };

  // Log quick view
  const logQuickView = (product: ProductWithRelations) => {
    logProductClick(product, {
      clickTarget: "quick_view_button",
      accessType: "public",
      extraData: {
        component: "product_card",
        action: "quick_view",
      },
    });
  };

  // Log share from card
  const logCardShare = (
    product: ProductWithRelations,
    method: "whatsapp" | "email" | "link"
  ) => {
    logProductShare(product, {
      shareMethod: method,
      extraData: {
        component: "product_card",
      },
    });
  };

  return {
    logProductImpression,
    logCardClick,
    logQuickView,
    logCardShare,
  };
}
