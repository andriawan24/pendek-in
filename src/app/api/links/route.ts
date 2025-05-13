import { supabase } from '@/lib/supabase';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

type LinkPayload = {
  full_url: string;
  alias?: string;
};

export async function GET() {
  try {
    const links = await supabase.from('links').select('*').order('visits', { ascending: false });
    return Response.json(links, { status: 200 });
  } catch (e) {
    return Response.json({ message: 'Failed ' + e }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { full_url, alias }: LinkPayload = await request.json();

    let slug = alias;
    if (!alias) {
      slug = Math.random().toString(36).substring(2, 8);
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        url: full_url,
        slug: slug,
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
