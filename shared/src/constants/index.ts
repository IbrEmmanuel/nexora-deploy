// =============================================================================
// Shared Constants
// =============================================================================

export const APP_NAME = 'NexoraGrid';
export const APP_VERSION = '1.0.0';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Token expiry
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

// Cache TTLs (seconds)
export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  DAY: 86400,       // 24 hours
  WEEK: 604800,     // 7 days
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_MB: 50,
  MAX_FILES_PER_REQUEST: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
  ],
} as const;

// Plan limits
export const PLAN_LIMITS = {
  FREE: {
    maxUsers: 3,
    maxProjects: 5,
    maxStorageGB: 1,
    maxApiCallsPerMonth: 1_000,
    maxAiTokensPerMonth: 10_000,
    features: ['basic_analytics', 'team_collaboration'],
  },
  STARTER: {
    maxUsers: 10,
    maxProjects: 20,
    maxStorageGB: 10,
    maxApiCallsPerMonth: 50_000,
    maxAiTokensPerMonth: 100_000,
    features: ['basic_analytics', 'team_collaboration', 'ai_assistant', 'api_access'],
  },
  PRO: {
    maxUsers: 50,
    maxProjects: 100,
    maxStorageGB: 100,
    maxApiCallsPerMonth: 500_000,
    maxAiTokensPerMonth: 1_000_000,
    features: [
      'advanced_analytics',
      'team_collaboration',
      'ai_assistant',
      'api_access',
      'custom_integrations',
      'priority_support',
      'audit_logs',
    ],
  },
  ENTERPRISE: {
    maxUsers: -1, // unlimited
    maxProjects: -1,
    maxStorageGB: -1,
    maxApiCallsPerMonth: -1,
    maxAiTokensPerMonth: -1,
    features: [
      'advanced_analytics',
      'team_collaboration',
      'ai_assistant',
      'api_access',
      'custom_integrations',
      'priority_support',
      'audit_logs',
      'sso',
      'custom_branding',
      'dedicated_support',
      'sla',
      'on_premise',
    ],
  },
} as const;

// Error codes
export const ERROR_CODES = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Limits
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PLAN_LIMIT_EXCEEDED: 'PLAN_LIMIT_EXCEEDED',
  STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
