const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ?? '';
  }
  return process.env.NEXT_PUBLIC_API_URL ?? '';
};

export const authConfig = {
  apiBaseUrl: getApiBaseUrl(),
  storage: {
    sessionKey: 'pendekIn.auth.session',
  },
} as const;
