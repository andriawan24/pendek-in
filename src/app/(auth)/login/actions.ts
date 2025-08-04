'use server';

import { createClient } from '@/lib/supabase.server';
import { AuthApiError, User } from '@supabase/supabase-js';

type LoginResponse = {
  error?: string;
  data?: User;
  success?: boolean;
};

export async function login(formData: FormData): Promise<LoginResponse> {
  const supabase = await createClient();

  const request = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(request);

  if (error instanceof AuthApiError) {
    return { error: 'Invalid credentials' };
  } else if (error) {
    return { error: 'Failed to sign in: ' + error.message };
  }

  return { success: true, data: data.user };
}
