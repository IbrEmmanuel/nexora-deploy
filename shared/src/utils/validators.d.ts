export declare function isValidEmail(email: string): boolean;
export declare function isValidUrl(url: string): boolean;
export declare function isValidSlug(slug: string): boolean;
export declare function isValidHexColor(color: string): boolean;
export declare function validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
};
export declare function isValidUUID(uuid: string): boolean;
export declare function isValidPhoneNumber(phone: string): boolean;
