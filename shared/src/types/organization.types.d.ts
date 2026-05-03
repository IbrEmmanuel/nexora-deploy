export declare enum SubscriptionPlan {
    FREE = "FREE",
    STARTER = "STARTER",
    PRO = "PRO",
    ENTERPRISE = "ENTERPRISE"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    TRIALING = "TRIALING",
    PAST_DUE = "PAST_DUE",
    CANCELED = "CANCELED",
    INCOMPLETE = "INCOMPLETE",
    INCOMPLETE_EXPIRED = "INCOMPLETE_EXPIRED",
    UNPAID = "UNPAID"
}
export declare enum BillingInterval {
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}
export interface Organization {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    size?: OrganizationSize;
    plan: SubscriptionPlan;
    subscriptionStatus: SubscriptionStatus;
    billingInterval: BillingInterval;
    trialEndsAt?: Date;
    subscriptionEndsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum OrganizationSize {
    SOLO = "SOLO",
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
    ENTERPRISE = "ENTERPRISE"
}
export interface OrganizationSettings {
    organizationId: string;
    allowInvites: boolean;
    requireEmailVerification: boolean;
    allowedDomains: string[];
    ssoEnabled: boolean;
    twoFactorRequired: boolean;
    sessionTimeout: number;
    dataRetentionDays: number;
    customBranding: CustomBranding;
}
export interface CustomBranding {
    primaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
    customDomain?: string;
}
export interface Subscription {
    id: string;
    organizationId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    interval: BillingInterval;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UsageMetrics {
    organizationId: string;
    period: string;
    apiCalls: number;
    storageUsedMB: number;
    aiTokensUsed: number;
    activeUsers: number;
    limits: PlanLimits;
}
export interface PlanLimits {
    maxUsers: number;
    maxProjects: number;
    maxStorageGB: number;
    maxApiCallsPerMonth: number;
    maxAiTokensPerMonth: number;
    features: string[];
}
