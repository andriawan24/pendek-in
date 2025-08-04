'use server';

import { createClient } from '@/lib/supabase.server';

type ResendEmailResponse = {
  error?: string;
  success?: boolean;
};

export async function resendVerificationEmail(email: string): Promise<ResendEmailResponse> {
  if (!email) {
    return { error: 'Email is required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
