export interface OperationResult<T> {
    errorMessage?: string;
    result: T;
    isSucceed: boolean;
}