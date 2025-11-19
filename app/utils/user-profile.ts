import type { components } from "~/types/pesona-hub-api";

type UserUpdate = components["schemas"]["UserUpdate"];
type UserDetail = components["schemas"]["UserDetail"];

/**
 * Required fields for a complete user profile
 * These fields must be filled before allowing collaboration requests
 */
const REQUIRED_USER_FIELDS = ["name", "phone"] as const;

const REQUIRED_DETAIL_FIELDS = [
  "institution_name",
  "stakeholder_type",
  "contact_phone",
  "collaboration_commodities",
] as const;

interface ProfileCompletionResult {
  isComplete: boolean;
  missingFields: string[];
}

/**
 * Checks if user profile is complete with all required fields
 * @param user - User object from API
 * @returns Object with isComplete flag and array of missing fields
 */
export function checkUserProfileComplete(
  user: UserUpdate | null | undefined
): ProfileCompletionResult {
  const missingFields: string[] = [];

  if (!user) {
    return {
      isComplete: false,
      missingFields: ["user"],
    };
  }

  // Check required top-level user fields
  for (const field of REQUIRED_USER_FIELDS) {
    if (!user[field] || user[field] === "") {
      missingFields.push(field);
    }
  }

  // Check if details exist
  if (!user.details) {
    missingFields.push("details");
    return {
      isComplete: false,
      missingFields: [...missingFields, ...REQUIRED_DETAIL_FIELDS],
    };
  }

  // Check required detail fields
  for (const field of REQUIRED_DETAIL_FIELDS) {
    const value = user.details[field];

    // Check if field is empty or null
    if (value === null || value === undefined || value === "") {
      missingFields.push(`details.${field}`);
      continue;
    }

    // For array fields, check if they have at least one item
    if (Array.isArray(value) && value.length === 0) {
      missingFields.push(`details.${field}`);
    }
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Returns a user-friendly message for profile completion status
 * @param result - Profile completion result
 * @returns Human-readable message
 */
export function getProfileCompletionMessage(
  result: ProfileCompletionResult
): string {
  if (result.isComplete) {
    return "Profil lengkap";
  }

  const fieldNames: Record<string, string> = {
    name: "Nama",
    phone: "Nomor Telepon",
    "details.institution_name": "Nama Lembaga/Perusahaan",
    "details.stakeholder_type": "Jenis Mitra",
    "details.contact_phone": "Nomor WhatsApp",
    "details.collaboration_commodities": "Jenis Komoditas",
  };

  const missingFieldNames = result.missingFields
    .map((field) => fieldNames[field] || field)
    .join(", ");

  return `Mohon lengkapi: ${missingFieldNames}`;
}

/**
 * Checks if user can proceed with collaboration request
 * Returns true if profile is complete, false if not
 * @param user - User object from API
 * @returns boolean indicating if user can collaborate
 */
export function canUserCollaborate(
  user: UserUpdate | null | undefined
): boolean {
  return checkUserProfileComplete(user).isComplete;
}
