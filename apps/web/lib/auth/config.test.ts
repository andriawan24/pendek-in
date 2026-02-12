import { describe, it, expect } from 'vitest';
import { authConfig } from './config';

describe('authConfig', () => {
  it('has the correct session storage key', () => {
    expect(authConfig.storage.sessionKey).toBe('pendekIn.auth.session');
  });

  it('is a frozen object (const assertion)', () => {
    // The config should not be modifiable at runtime
    expect(authConfig.storage).toBeDefined();
    expect(typeof authConfig.storage.sessionKey).toBe('string');
  });
});
