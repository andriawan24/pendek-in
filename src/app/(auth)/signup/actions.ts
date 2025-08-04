'use server';

import { createClient } from '@/lib/supabase.server';
import { AuthApiError, User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type RegisterResponse = {
  error?: {
    password_confirmation?: string;
    email?: string;
    general?: string;
  };
  data?: User;
};

export async function register(formData: FormData): Promise<RegisterResponse> {
  const supabase = await createClient();

  const request = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    password_confirmation: formData.get('password_confirmation') as string,
  };

  if (request.password != request.password_confirmation) {
    return {
      error: {
        password_confirmation: 'Password confirmation not valid',
      },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: request.email,
    password: request.password,
    options: {
      data: {
        name: request.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
    },
  });

  if (error instanceof AuthApiError) {
    return { error: { general: 'Invalid credentials' } };
  } else if (error) {
    return { error: { general: 'Failed to register: ' + error.message } };
  }

  // If user already exists and is confirmed, show different message
  if (data.user && data.user.email_confirmed_at) {
    return { error: { general: 'User already exists with this email' } };
  }

  revalidatePath('/', 'layout');
  redirect('/verify-email');
}
