"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSize = exports.BillingInterval = exports.SubscriptionStatus = exports.SubscriptionPlan = void 0;
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "FREE";
    SubscriptionPlan["STARTER"] = "STARTER";
    SubscriptionPlan["PRO"] = "PRO";
    SubscriptionPlan["ENTERPRISE"] = "ENTERPRISE";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["TRIALING"] = "TRIALING";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["INCOMPLETE"] = "INCOMPLETE";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "INCOMPLETE_EXPIRED";
    SubscriptionStatus["UNPAID"] = "UNPAID";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var BillingInterval;
(function (BillingInterval) {
    BillingInterval["MONTHLY"] = "MONTHLY";
    BillingInterval["YEARLY"] = "YEARLY";
})(BillingInterval || (exports.BillingInterval = BillingInterval = {}));
var OrganizationSize;
(function (OrganizationSize) {
    OrganizationSize["SOLO"] = "SOLO";
    OrganizationSize["SMALL"] = "SMALL";
    OrganizationSize["MEDIUM"] = "MEDIUM";
    OrganizationSize["LARGE"] = "LARGE";
    OrganizationSize["ENTERPRISE"] = "ENTERPRISE";
})(OrganizationSize || (exports.OrganizationSize = OrganizationSize = {}));
//# sourceMappingURL=organization.types.js.map