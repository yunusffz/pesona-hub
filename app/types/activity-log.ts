import type { components } from "./pesona-hub-api";

/**
 * Type aliases for better readability
 */
export type EventType = components["schemas"]["EventType"];
export type EntityType = components["schemas"]["EntityType"];
export type AccessType = components["schemas"]["AccessType"];
export type LogActivityRequest = components["schemas"]["LogActivityRequest"];

/**
 * Product-specific log data structure
 */
export interface ProductLogData {
  product_name?: string;
  product_id?: number | null;
  product_price?: number;
  product_quantity?: number;
  product_unit?: string | null;
  total_price?: number;
  product_usage?: string | null;
  product_description?: string | null;
  product_category?: string | null;
  commodity_name?: string | null;
  commodity_id?: number | null;
}

/**
 * KUPS (Social Forestry Business Group) related log data
 */
export interface KUPSLogData {
  kups_name?: string | null;
  kups_class?: string | null;
  kups_contact?: string | null;
  kups_id?: number | null;
}

/**
 * User-related log data
 */
export interface UserLogData {
  user_id?: number | null;
  user_name?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
}

/**
 * Combined extra data for product collaboration logs
 */
export interface ProductCollaborationLogData
  extends ProductLogData,
    KUPSLogData,
    UserLogData {
  action?: string;
  message?: string;
}

/**
 * Product view log data
 */
export interface ProductViewLogData extends ProductLogData, UserLogData {
  view_duration?: number;
  referrer?: string;
}

/**
 * Log context for easier logging
 */
export interface LogContext {
  entityId?: number | null;
  entitySlug?: string | null;
  accessType?: AccessType;
  extraData?: Record<string, unknown>;
}
