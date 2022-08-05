export interface WrappedError {
  isWrappedError: true;
  description: string;
  notes: string[];
  error?: Error;
}

/**
 * Helper to wrap an error w\ith a human-readable description.
 */
export const wrapError = (description: string, error?: Error, ...notes: string[]): WrappedError => ({
  isWrappedError: true,
  description,
  notes,
  error,
});

export const isWrappedError = (error: unknown): error is WrappedError =>
  !!error && typeof error === 'object' && (error as Record<string, boolean>).isWrappedError;
