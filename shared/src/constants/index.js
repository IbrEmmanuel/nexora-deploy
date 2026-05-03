"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.PLAN_LIMITS = exports.UPLOAD_LIMITS = exports.CACHE_TTL = exports.REFRESH_TOKEN_EXPIRY = exports.ACCESS_TOKEN_EXPIRY = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.APP_VERSION = exports.APP_NAME = void 0;
exports.APP_NAME = 'NexoraGrid';
exports.APP_VERSION = '1.0.0';
exports.DEFAULT_PAGE_SIZE = 20;
exports.MAX_PAGE_SIZE = 100;
exports.ACCESS_TOKEN_EXPIRY = '15m';
exports.REFRESH_TOKEN_EXPIRY = '7d';
exports.CACHE_TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    DAY: 86400,
    WEEK: 604800,
};
exports.UPLOAD_LIMITS = {
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
};
exports.PLAN_LIMITS = {
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
        maxUsers: -1,
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
};
exports.ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    PLAN_LIMIT_EXCEEDED: 'PLAN_LIMIT_EXCEEDED',
    STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};
//# sourceMappingURL=index.js.map