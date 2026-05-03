"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeRangePreset = exports.WidgetType = exports.AggregationType = exports.TimeGranularity = exports.MetricType = void 0;
var MetricType;
(function (MetricType) {
    MetricType["COUNTER"] = "COUNTER";
    MetricType["GAUGE"] = "GAUGE";
    MetricType["HISTOGRAM"] = "HISTOGRAM";
    MetricType["SUMMARY"] = "SUMMARY";
})(MetricType || (exports.MetricType = MetricType = {}));
var TimeGranularity;
(function (TimeGranularity) {
    TimeGranularity["MINUTE"] = "MINUTE";
    TimeGranularity["HOUR"] = "HOUR";
    TimeGranularity["DAY"] = "DAY";
    TimeGranularity["WEEK"] = "WEEK";
    TimeGranularity["MONTH"] = "MONTH";
    TimeGranularity["QUARTER"] = "QUARTER";
    TimeGranularity["YEAR"] = "YEAR";
})(TimeGranularity || (exports.TimeGranularity = TimeGranularity = {}));
var AggregationType;
(function (AggregationType) {
    AggregationType["SUM"] = "SUM";
    AggregationType["AVG"] = "AVG";
    AggregationType["MIN"] = "MIN";
    AggregationType["MAX"] = "MAX";
    AggregationType["COUNT"] = "COUNT";
    AggregationType["P50"] = "P50";
    AggregationType["P90"] = "P90";
    AggregationType["P95"] = "P95";
    AggregationType["P99"] = "P99";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
var WidgetType;
(function (WidgetType) {
    WidgetType["LINE_CHART"] = "LINE_CHART";
    WidgetType["BAR_CHART"] = "BAR_CHART";
    WidgetType["PIE_CHART"] = "PIE_CHART";
    WidgetType["AREA_CHART"] = "AREA_CHART";
    WidgetType["METRIC_CARD"] = "METRIC_CARD";
    WidgetType["TABLE"] = "TABLE";
    WidgetType["HEATMAP"] = "HEATMAP";
    WidgetType["FUNNEL"] = "FUNNEL";
    WidgetType["MAP"] = "MAP";
    WidgetType["TEXT"] = "TEXT";
})(WidgetType || (exports.WidgetType = WidgetType = {}));
var TimeRangePreset;
(function (TimeRangePreset) {
    TimeRangePreset["LAST_HOUR"] = "LAST_HOUR";
    TimeRangePreset["LAST_24_HOURS"] = "LAST_24_HOURS";
    TimeRangePreset["LAST_7_DAYS"] = "LAST_7_DAYS";
    TimeRangePreset["LAST_30_DAYS"] = "LAST_30_DAYS";
    TimeRangePreset["LAST_90_DAYS"] = "LAST_90_DAYS";
    TimeRangePreset["LAST_YEAR"] = "LAST_YEAR";
    TimeRangePreset["THIS_WEEK"] = "THIS_WEEK";
    TimeRangePreset["THIS_MONTH"] = "THIS_MONTH";
    TimeRangePreset["THIS_QUARTER"] = "THIS_QUARTER";
    TimeRangePreset["THIS_YEAR"] = "THIS_YEAR";
    TimeRangePreset["CUSTOM"] = "CUSTOM";
})(TimeRangePreset || (exports.TimeRangePreset = TimeRangePreset = {}));
//# sourceMappingURL=analytics.types.js.map