import { describe, it, expect, vi } from 'vitest';
import { ApiError, handleApiError } from './api-error';

// We need to mock ResponseError so that `error instanceof ResponseError` works.
// Because vi.mock is hoisted, we use vi.hoisted to define the mock class first.
const { MockResponseError } = vi.hoisted(() => {
  class MockResponseError extends Error {
    response: Response;
    constructor(response: Response) {
      super('Response error');
      this.name = 'ResponseError';
      this.response = response;
    }
  }
  return { MockResponseError };
});

vi.mock('../api-client/client', () => ({
  ResponseError: MockResponseError,
}));

describe('ApiError', () => {
  it('creates an error with a message', () => {
    const err = new ApiError('Something went wrong');
    expect(err.message).toBe('Something went wrong');
    expect(err.name).toBe('ApiError');
    expect(err.statusCode).toBeUndefined();
    expect(err.response).toBeUndefined();
  });

  it('creates an error with statusCode and response', () => {
    const err = new ApiError('Bad request', 400, { detail: 'invalid' });
    expect(err.message).toBe('Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.response).toEqual({ detail: 'invalid' });
  });

  it('is an instance of Error', () => {
    const err = new ApiError('test');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('handleApiError', () => {
  it('throws ApiError for ResponseError with JSON body containing message', async () => {
    const response = new Response(JSON.stringify({ message: 'Not found' }), {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'application/json' },
    });
    const error = new MockResponseError(response);

    try {
      await handleApiError(error);
      expect.fail('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe('Not found');
      expect((e as ApiError).statusCode).toBe(404);
    }
  });

  it('throws ApiError with statusText when JSON parse fails', async () => {
    const response = new Response('not json', {
      status: 500,
      statusText: 'Internal Server Error',
    });
    const error = new MockResponseError(response);

    try {
      await handleApiError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe('Internal Server Error');
      expect((e as ApiError).statusCode).toBe(500);
    }
  });

  it('throws ApiError for a regular Error', async () => {
    const error = new Error('Network failure');

    try {
      await handleApiError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe('Network failure');
    }
  });

  it('throws ApiError with generic message for unknown errors', async () => {
    try {
      await handleApiError('something weird');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe('Unknown error occurred');
    }
  });

  it('throws ApiError with fallback message when JSON has no message field', async () => {
    const response = new Response(JSON.stringify({ error: 'oops' }), {
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: { 'Content-Type': 'application/json' },
    });
    const error = new MockResponseError(response);

    try {
      await handleApiError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toBe('Request failed with status 422');
      expect((e as ApiError).statusCode).toBe(422);
    }
  });
});
