import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// GET en specifik blogpost ved ID
export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const { data, error } = await supabase.from("blogposts").select("*").eq("id", id).single();

    if (error) {
      console.error(`[GET blogpost error]:`, error);
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data);
  } catch (err) {
    console.error(`[GET blogpost exception]:`, err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
