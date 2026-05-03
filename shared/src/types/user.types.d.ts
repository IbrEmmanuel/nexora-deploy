export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER",
    GUEST = "GUEST"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatarUrl?: string;
    role: UserRole;
    status: UserStatus;
    organizationId: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserProfile extends User {
    bio?: string;
    jobTitle?: string;
    department?: string;
    phoneNumber?: string;
    timezone: string;
    locale: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    organizationId: string;
    iat?: number;
    exp?: number;
}
