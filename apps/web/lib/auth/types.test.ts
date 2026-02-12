import { describe, it, expect } from 'vitest';
import { AuthError } from './types';

describe('AuthError', () => {
  it('creates an error with message only', () => {
    const err = new AuthError('Unauthorized');
    expect(err.message).toBe('Unauthorized');
    expect(err.name).toBe('AuthError');
    expect(err.statusCode).toBeUndefined();
    expect(err.response).toBeUndefined();
  });

  it('creates an error with statusCode', () => {
    const err = new AuthError('Forbidden', 403);
    expect(err.message).toBe('Forbidden');
    expect(err.statusCode).toBe(403);
  });

  it('creates an error with statusCode and response', () => {
    const responseData = { error: 'invalid_token' };
    const err = new AuthError('Token expired', 401, responseData);
    expect(err.message).toBe('Token expired');
    expect(err.statusCode).toBe(401);
    expect(err.response).toEqual(responseData);
  });

  it('is an instance of Error', () => {
    const err = new AuthError('test');
    expect(err).toBeInstanceOf(Error);
  });
});
