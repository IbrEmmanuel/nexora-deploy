export declare const APP_NAME = "NexoraGrid";
export declare const APP_VERSION = "1.0.0";
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const ACCESS_TOKEN_EXPIRY = "15m";
export declare const REFRESH_TOKEN_EXPIRY = "7d";
export declare const CACHE_TTL: {
    readonly SHORT: 60;
    readonly MEDIUM: 300;
    readonly LONG: 3600;
    readonly DAY: 86400;
    readonly WEEK: 604800;
};
export declare const UPLOAD_LIMITS: {
    readonly MAX_FILE_SIZE_MB: 50;
    readonly MAX_FILES_PER_REQUEST: 10;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    readonly ALLOWED_DOCUMENT_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "text/plain"];
};
export declare const PLAN_LIMITS: {
    readonly FREE: {
        readonly maxUsers: 3;
        readonly maxProjects: 5;
        readonly maxStorageGB: 1;
        readonly maxApiCallsPerMonth: 1000;
        readonly maxAiTokensPerMonth: 10000;
        readonly features: readonly ["basic_analytics", "team_collaboration"];
    };
    readonly STARTER: {
        readonly maxUsers: 10;
        readonly maxProjects: 20;
        readonly maxStorageGB: 10;
        readonly maxApiCallsPerMonth: 50000;
        readonly maxAiTokensPerMonth: 100000;
        readonly features: readonly ["basic_analytics", "team_collaboration", "ai_assistant", "api_access"];
    };
    readonly PRO: {
        readonly maxUsers: 50;
        readonly maxProjects: 100;
        readonly maxStorageGB: 100;
        readonly maxApiCallsPerMonth: 500000;
        readonly maxAiTokensPerMonth: 1000000;
        readonly features: readonly ["advanced_analytics", "team_collaboration", "ai_assistant", "api_access", "custom_integrations", "priority_support", "audit_logs"];
    };
    readonly ENTERPRISE: {
        readonly maxUsers: -1;
        readonly maxProjects: -1;
        readonly maxStorageGB: -1;
        readonly maxApiCallsPerMonth: -1;
        readonly maxAiTokensPerMonth: -1;
        readonly features: readonly ["advanced_analytics", "team_collaboration", "ai_assistant", "api_access", "custom_integrations", "priority_support", "audit_logs", "sso", "custom_branding", "dedicated_support", "sla", "on_premise"];
    };
};
export declare const ERROR_CODES: {
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly TOKEN_INVALID: "TOKEN_INVALID";
    readonly EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    readonly ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly ALREADY_EXISTS: "ALREADY_EXISTS";
    readonly CONFLICT: "CONFLICT";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly PLAN_LIMIT_EXCEEDED: "PLAN_LIMIT_EXCEEDED";
    readonly STORAGE_LIMIT_EXCEEDED: "STORAGE_LIMIT_EXCEEDED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
};
