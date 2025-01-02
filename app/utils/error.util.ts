export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
}

export function handleDatabaseError(error: unknown): never {
    console.error('Database error:', error);
    throw new Error(getErrorMessage(error));
}