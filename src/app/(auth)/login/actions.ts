'use server';

import { createClient } from '@/lib/supabase.server';
import { AuthApiError, User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type LoginResponse = {
  error?: string;
  data?: User;
};

export async function login(formData: FormData): Promise<LoginResponse> {
  const supabase = await createClient();

  const request = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(request);

  if (error instanceof AuthApiError) {
    return { error: 'Invalid credentials' };
  } else if (error) {
    return { error: 'Failed to signed in ' + error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
