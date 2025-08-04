'use server';

import { createClient } from '@/lib/supabase.server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return { error: 'Failed to sign out' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
