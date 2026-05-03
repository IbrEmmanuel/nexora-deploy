export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}
export interface ResponseMeta {
    requestId: string;
    timestamp: string;
    version: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}
export interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export interface PaginationInput {
    page?: number;
    pageSize?: number;
    cursor?: string;
}
export interface SortInput {
    field: string;
    direction: 'ASC' | 'DESC';
}
export interface FilterInput {
    field: string;
    operator: FilterOperator;
    value: string | number | boolean | string[];
}
export declare enum FilterOperator {
    EQ = "EQ",
    NEQ = "NEQ",
    GT = "GT",
    GTE = "GTE",
    LT = "LT",
    LTE = "LTE",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    IN = "IN",
    NOT_IN = "NOT_IN",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL"
}
export interface QueryOptions {
    pagination?: PaginationInput;
    sort?: SortInput[];
    filters?: FilterInput[];
    search?: string;
}
export interface Connection<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
    totalCount: number;
}
export interface Edge<T> {
    node: T;
    cursor: string;
}
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
