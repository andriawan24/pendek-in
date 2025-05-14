import { supabase } from '@/lib/supabase.client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;

    const link = await supabase.from('links').select('*').eq('slug', slug).single();
    await supabase
      .from('links')
      .update({ visits: (link.data?.visits ?? 0) + 1 })
      .eq('slug', slug);

    if (link.error) {
      return NextResponse.json(link, { status: 400 });
    }

    return NextResponse.json(link, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Failed ' + e }, { status: 400 });
  }
}
