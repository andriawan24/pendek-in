import { createClient } from '@/lib/supabase.server';
import { NextRequest } from 'next/server';

type LinkPayload = {
  full_url: string;
  alias?: string;
  user_id: string;
};

export async function GET() {
  const supabase = await createClient();

  try {
    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch links for the authenticated user only
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('visits', { ascending: false });

    if (error) {
      return Response.json({ message: 'Failed to fetch links: ' + error.message }, { status: 500 });
    }

    return Response.json(links, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Failed ' + e }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { full_url, alias, user_id }: LinkPayload = await request.json();

    let slug = alias;
    if (!alias) {
      slug = Math.random().toString(36).substring(2, 8);
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        url: full_url,
        slug: slug,
        user_id: user_id,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ message: 'Failed to create link: ' + error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (e) {
    return Response.json({ message: 'Failed ' + e }, { status: 400 });
  }
}
