export declare enum MetricType {
    COUNTER = "COUNTER",
    GAUGE = "GAUGE",
    HISTOGRAM = "HISTOGRAM",
    SUMMARY = "SUMMARY"
}
export declare enum TimeGranularity {
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}
export interface MetricDataPoint {
    timestamp: Date;
    value: number;
    labels?: Record<string, string>;
}
export interface TimeSeriesData {
    metric: string;
    granularity: TimeGranularity;
    dataPoints: MetricDataPoint[];
    aggregation: AggregationType;
}
export declare enum AggregationType {
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    COUNT = "COUNT",
    P50 = "P50",
    P90 = "P90",
    P95 = "P95",
    P99 = "P99"
}
export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    description?: string;
    config: WidgetConfig;
    position: WidgetPosition;
    size: WidgetSize;
}
export declare enum WidgetType {
    LINE_CHART = "LINE_CHART",
    BAR_CHART = "BAR_CHART",
    PIE_CHART = "PIE_CHART",
    AREA_CHART = "AREA_CHART",
    METRIC_CARD = "METRIC_CARD",
    TABLE = "TABLE",
    HEATMAP = "HEATMAP",
    FUNNEL = "FUNNEL",
    MAP = "MAP",
    TEXT = "TEXT"
}
export interface WidgetConfig {
    metrics: string[];
    filters?: Record<string, string>;
    timeRange?: TimeRange;
    granularity?: TimeGranularity;
    aggregation?: AggregationType;
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
}
export interface WidgetPosition {
    x: number;
    y: number;
}
export interface WidgetSize {
    width: number;
    height: number;
}
export interface TimeRange {
    start: Date;
    end: Date;
    preset?: TimeRangePreset;
}
export declare enum TimeRangePreset {
    LAST_HOUR = "LAST_HOUR",
    LAST_24_HOURS = "LAST_24_HOURS",
    LAST_7_DAYS = "LAST_7_DAYS",
    LAST_30_DAYS = "LAST_30_DAYS",
    LAST_90_DAYS = "LAST_90_DAYS",
    LAST_YEAR = "LAST_YEAR",
    THIS_WEEK = "THIS_WEEK",
    THIS_MONTH = "THIS_MONTH",
    THIS_QUARTER = "THIS_QUARTER",
    THIS_YEAR = "THIS_YEAR",
    CUSTOM = "CUSTOM"
}
