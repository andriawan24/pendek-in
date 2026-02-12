import { describe, it, expect } from 'vitest';
import { cn, capitalizeTitle } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('merges tailwind classes with conflict resolution', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles arrays of class names', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });
});

describe('capitalizeTitle', () => {
  it('capitalizes the first character', () => {
    expect(capitalizeTitle('hello')).toBe('Hello');
  });

  it('keeps the rest of the string unchanged', () => {
    expect(capitalizeTitle('hELLO wORLD')).toBe('HELLO wORLD');
  });

  it('returns empty string for empty input', () => {
    expect(capitalizeTitle('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalizeTitle('a')).toBe('A');
  });

  it('handles already capitalized string', () => {
    expect(capitalizeTitle('Hello')).toBe('Hello');
  });

  it('handles strings starting with a number', () => {
    expect(capitalizeTitle('123abc')).toBe('123abc');
  });
});
