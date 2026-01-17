import { ResponseError } from '../api-client/client';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiError(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    let errorMessage = `Request failed with status ${error.response.status}`;
    let errorData: unknown;

    try {
      errorData = await error.response.json();
      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
      ) {
        errorMessage = String((errorData as { message: string }).message);
      }
    } catch {
      errorMessage = error.response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, error.response.status, errorData);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError('Unknown error occurred');
}
