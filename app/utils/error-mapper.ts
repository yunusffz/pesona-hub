// utils/errorMapper.ts
interface ApiError {
  message_code?: string;
  detail?: any;
  status?: number;
  statusCode?: number;
  message?: string;
}

type ErrorMapper = Record<string, string | ((detail: any) => string)>;

const errorMessages: ErrorMapper = {
  // Resource conflicts
  RESOURCE_CONFLICT: (detail: any) => {
    if (detail?.reason === "Username already taken") {
      return `Username "${detail.username}" sudah digunakan. Silakan pilih yang lain.`;
    }
    if (detail?.reason === "Email already exists") {
      return `Alamat email sudah terdaftar. Silakan coba masuk.`;
    }
    return "Sumber daya ini sudah ada. Silakan gunakan nilai yang berbeda.";
  },

  // Validation errors
  VALIDATION_ERROR: (detail: any) => {
    // Handle array of validation errors from FastAPI/Pydantic
    if (Array.isArray(detail)) {
      const firstError = detail[0];
      const field = firstError?.loc?.[1] || firstError?.loc?.[0] || "field";
      const msg = firstError?.msg || "Nilai tidak valid";
      return `${field}: ${msg}`;
    }

    if (detail?.field) {
      return `${detail.field}: ${detail.message || "Nilai tidak valid"}`;
    }

    return detail?.message || "Silakan periksa input Anda dan coba lagi.";
  },

  // Authentication errors
  UNAUTHORIZED: "Silakan masuk untuk melanjutkan.",
  INVALID_CREDENTIALS: "Email atau kata sandi tidak valid. Silakan coba lagi.",
  TOKEN_EXPIRED: "Sesi Anda telah berakhir. Silakan masuk lagi.",
  INVALID_TOKEN: "Token autentikasi tidak valid. Silakan masuk lagi.",

  // Permission errors
  FORBIDDEN: "Anda tidak memiliki izin untuk melakukan tindakan ini.",
  INSUFFICIENT_PERMISSIONS:
    "Izin tambahan diperlukan untuk mengakses sumber daya ini.",

  // Not found errors
  RESOURCE_NOT_FOUND: (detail: any) => {
    const resource = detail?.resource || "Sumber daya";
    return `${resource} tidak ditemukan.`;
  },
  USER_NOT_FOUND: "Pengguna tidak ditemukan. Silakan periksa informasi.",

  // Server errors
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan. Silakan coba lagi nanti.",
  SERVICE_UNAVAILABLE:
    "Layanan sementara tidak tersedia. Silakan coba lagi sebentar lagi.",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: (detail: any) => {
    const retryAfter = detail?.retry_after
      ? ` Coba lagi dalam ${detail.retry_after} detik.`
      : "";
    return `Terlalu banyak permintaan. Silakan perlambat.${retryAfter}`;
  },

  // Bad request
  BAD_REQUEST: (detail: any) => {
    return (
      detail?.message || "Permintaan tidak valid. Silakan periksa input Anda."
    );
  },

  // Registration specific
  REGISTRATION_FAILED: "Pendaftaran gagal. Silakan coba lagi.",
  EMAIL_ALREADY_EXISTS: "Email ini sudah terdaftar.",
  USERNAME_ALREADY_EXISTS: "Username ini sudah digunakan.",
  WEAK_PASSWORD:
    "Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan angka dan simbol.",

  // Login specific
  LOGIN_FAILED: "Login gagal. Silakan periksa kredensial Anda.",
  ACCOUNT_LOCKED: "Akun Anda telah dikunci. Silakan hubungi dukungan.",
  EMAIL_NOT_VERIFIED: "Silakan verifikasi email Anda sebelum masuk.",
};

export function mapErrorMessage(error: any): string {
  // Handle null/undefined
  if (!error) {
    return "Terjadi kesalahan yang tidak terduga.";
  }

  // Check for message_code (your API format)
  if (error.message_code) {
    const mapper = errorMessages[error.message_code];

    if (typeof mapper === "function") {
      return mapper(error.detail);
    }

    if (typeof mapper === "string") {
      return mapper;
    }
  }

  // Handle FastAPI/Pydantic validation errors (422)
  if (error.detail && Array.isArray(error.detail)) {
    const mapper = errorMessages.VALIDATION_ERROR;
    if (typeof mapper === "function") {
      return mapper(error.detail);
    }
  }

  // Handle HTTP status codes
  const status = error.status || error.statusCode;
  if (status) {
    switch (status) {
      case 400:
        return typeof errorMessages.BAD_REQUEST === "function"
          ? errorMessages.BAD_REQUEST(error.detail)
          : (errorMessages.BAD_REQUEST as string);
      case 401:
        return errorMessages.UNAUTHORIZED as string;
      case 403:
        return errorMessages.FORBIDDEN as string;
      case 404:
        return typeof errorMessages.RESOURCE_NOT_FOUND === "function"
          ? errorMessages.RESOURCE_NOT_FOUND(error.detail)
          : (errorMessages.RESOURCE_NOT_FOUND as string);
      case 409:
        return typeof errorMessages.RESOURCE_CONFLICT === "function"
          ? errorMessages.RESOURCE_CONFLICT(error.detail)
          : (errorMessages.RESOURCE_CONFLICT as string);
      case 422:
        return typeof errorMessages.VALIDATION_ERROR === "function"
          ? errorMessages.VALIDATION_ERROR(error.detail)
          : (errorMessages.VALIDATION_ERROR as string);
      case 429:
        return typeof errorMessages.RATE_LIMIT_EXCEEDED === "function"
          ? errorMessages.RATE_LIMIT_EXCEEDED(error.detail)
          : (errorMessages.RATE_LIMIT_EXCEEDED as string);
      case 500:
        return errorMessages.INTERNAL_SERVER_ERROR as string;
      case 503:
        return errorMessages.SERVICE_UNAVAILABLE as string;
    }
  }

  // Fallback to error message or default
  return (
    error.message || "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
  );
}
