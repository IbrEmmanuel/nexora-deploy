"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidUrl = isValidUrl;
exports.isValidSlug = isValidSlug;
exports.isValidHexColor = isValidHexColor;
exports.validatePasswordStrength = validatePasswordStrength;
exports.isValidUUID = isValidUUID;
exports.isValidPhoneNumber = isValidPhoneNumber;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
}
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
function isValidSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
function isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
function validatePasswordStrength(password) {
    const feedback = [];
    let score = 0;
    if (password.length >= 8)
        score++;
    else
        feedback.push('At least 8 characters required');
    if (password.length >= 12)
        score++;
    if (/[A-Z]/.test(password))
        score++;
    else
        feedback.push('At least one uppercase letter required');
    if (/[a-z]/.test(password))
        score++;
    else
        feedback.push('At least one lowercase letter required');
    if (/\d/.test(password))
        score++;
    else
        feedback.push('At least one number required');
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        score++;
    else
        feedback.push('At least one special character required');
    return {
        valid: score >= 5,
        score,
        feedback,
    };
}
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
function isValidPhoneNumber(phone) {
    return /^\+[1-9]\d{1,14}$/.test(phone);
}
//# sourceMappingURL=validators.js.map