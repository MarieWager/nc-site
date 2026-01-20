export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";

console.log("Environment check:", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗",
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// GET - Hent alle rækker fra en tabel
export async function GET(req, { params }) {
  const { resource } = await params;
  console.log(`[GET] Fetching from table: "${resource}"`);

  try {
    const { data, error } = await supabase.from(resource).select("*");

    if (error) {
      console.error(`[GET Error] Table "${resource}":`, error);
      return Response.json({ error: error.message, details: error }, { status: 400 });
    }

    console.log(`[GET Success] Retrieved ${data?.length || 0} rows from "${resource}"`);
    return Response.json({ data });
  } catch (err) {
    console.error(`[GET Exception] Full error:`, err);
    return Response.json({ error: err.message, type: err.constructor.name }, { status: 500 });
  }
}

// POST - Indsæt en ny række
export async function POST(req, { params }) {
  const { resource } = await params;
  const body = await req.json();

  try {
    const { data, error } = await supabase.from(resource).insert([body]).select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Opdater en række (kræver id i body)
export async function PUT(req, { params }) {
  const { resource } = await params;
  const { id, ...updates } = await req.json();

  if (!id) {
    return Response.json({ error: "ID required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.from(resource).update(updates).eq("id", id).select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Slet en række
export async function DELETE(req, { params }) {
  const { resource } = await params;
  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "ID required" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from(resource).delete().eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ message: "Deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
