import type {
  LogActivityRequest,
  ProductLogData,
  ProductCollaborationLogData,
  ProductViewLogData,
  KUPSLogData,
  UserLogData,
  EventType,
  AccessType,
} from "~/types/activity-log";
import type { ProductWithRelations } from "~/types/product";
import { useLogActivity } from "~/queries/useActivityLogs";
import { useAuth } from "~/composables/useAuth";

/**
 * Composable for logging product-related activities
 * Provides type-safe methods for common product logging scenarios
 */
export function useProductActivityLogger() {
  const { mutate: logActivity } = useLogActivity();
  const { user } = useAuth();
  const route = useRoute();

  /**
   * Helper to get current user data for logging
   */
  const getUserLogData = (): UserLogData => {
    return {
      user_id: user.value?.id || null,
      user_name: user.value?.name || null,
      user_email: user.value?.email || null,
      user_phone: user.value?.phone || null,
    };
  };

  /**
   * Helper to extract product data for logging
   */
  const getProductLogData = (
    product: ProductWithRelations | undefined,
    quantity?: number
  ): ProductLogData => {
    if (!product) return {};

    const unitPrice = product.price || 0;
    const qty = quantity || 1;

    return {
      product_name: product.name,
      product_id: product.id,
      product_price: unitPrice,
      product_quantity: qty,
      product_unit: product.unit || null,
      total_price: unitPrice * qty,
      product_usage: product.product_usage || null,
      product_description: product.description || null,
      product_category: product.product_category || null,
      commodity_name: product.commodity?.name || null,
      commodity_id: product.commodity?.id || null,
    };
  };

  /**
   * Helper to extract KUPS data for logging
   */
  const getKUPSLogData = (
    product: ProductWithRelations | undefined
  ): KUPSLogData => {
    if (!product?.social_forestry_business_group) return {};

    return {
      kups_name: product.social_forestry_business_group.name || null,
      kups_class: product.social_forestry_business_group.class_group || null,
      kups_contact:
        (product.social_forestry_business_group.contact as any)
          ?.chief_contact || null,
      kups_id: product.social_forestry_business_group.id || null,
    };
  };

  /**
   * Log product view activity
   */
  const logProductView = (
    product: ProductWithRelations,
    options?: {
      accessType?: AccessType;
      viewDuration?: number;
      referrer?: string;
    }
  ) => {
    const productData = getProductLogData(product);
    const userData = getUserLogData();

    const extraData: ProductViewLogData = {
      ...productData,
      ...userData,
      view_duration: options?.viewDuration,
      referrer: options?.referrer || document.referrer,
    };

    const activityLog: LogActivityRequest = {
      event_type: "view",
      entity_type: "product",
      entity_id: product.id || null,
      entity_slug:
        typeof route.params.slug === "string" ? route.params.slug : null,
      access_type: options?.accessType || "public",
      extra_data: extraData as { [key: string]: unknown },
    };

    logActivity(activityLog);
  };

  /**
   * Log product collaboration request (WhatsApp contact)
   */
  const logProductCollaboration = (
    product: ProductWithRelations,
    quantity: number,
    options?: {
      accessType?: AccessType;
      message?: string;
    }
  ) => {
    const productData = getProductLogData(product, quantity);
    const kupsData = getKUPSLogData(product);
    const userData = getUserLogData();

    const extraData: ProductCollaborationLogData = {
      ...productData,
      ...kupsData,
      ...userData,
      action: "collaboration_request",
      message: options?.message,
    };

    const activityLog: LogActivityRequest = {
      event_type: "create",
      entity_type: "product",
      entity_id: product.id || null,
      entity_slug:
        typeof route.params.slug === "string" ? route.params.slug : null,
      access_type: options?.accessType ?? "public",
      extra_data: extraData as { [key: string]: unknown },
    };

    logActivity(activityLog);

    return {
      productData,
      kupsData,
      userData,
    };
  };

  /**
   * Log product click/interaction
   */
  const logProductClick = (
    product: ProductWithRelations,
    options?: {
      accessType?: AccessType;
      clickTarget?: string;
      extraData?: Record<string, unknown>;
    }
  ) => {
    const productData = getProductLogData(product);
    const userData = getUserLogData();

    const activityLog: LogActivityRequest = {
      event_type: "click",
      entity_type: "product",
      entity_id: product.id || null,
      entity_slug: (route.params.slug as string) || null,
      access_type: options?.accessType || "public",
      extra_data: {
        ...productData,
        ...userData,
        click_target: options?.clickTarget,
        ...options?.extraData,
      },
    };

    logActivity(activityLog);
  };

  /**
   * Log product share activity
   */
  const logProductShare = (
    product: ProductWithRelations,
    options?: {
      accessType?: AccessType;
      shareMethod?: "whatsapp" | "email" | "link" | "social";
      extraData?: Record<string, unknown>;
    }
  ) => {
    const productData = getProductLogData(product);
    const userData = getUserLogData();

    const activityLog: LogActivityRequest = {
      event_type: "share",
      entity_type: "product",
      entity_id: product.id || null,
      entity_slug: (route.params.slug as string) || null,
      access_type: options?.accessType || "public",
      extra_data: {
        ...productData,
        ...userData,
        share_method: options?.shareMethod,
        ...options?.extraData,
      },
    };

    logActivity(activityLog);
  };

  /**
   * Generic log method for custom events
   */
  const logCustomEvent = (
    eventType: EventType,
    product?: ProductWithRelations,
    options?: {
      accessType?: AccessType;
      extraData?: Record<string, unknown>;
    }
  ) => {
    const productData = getProductLogData(product);
    const userData = getUserLogData();

    const activityLog: LogActivityRequest = {
      event_type: eventType,
      entity_type: "product",
      entity_id: product?.id || null,
      entity_slug: (route.params.slug as string) || null,
      access_type: options?.accessType || "public",
      extra_data: {
        ...productData,
        ...userData,
        ...options?.extraData,
      },
    };

    logActivity(activityLog);
  };

  return {
    logProductView,
    logProductCollaboration,
    logProductClick,
    logProductShare,
    logCustomEvent,
    // Expose helpers for custom usage
    getProductLogData,
    getKUPSLogData,
    getUserLogData,
  };
}
