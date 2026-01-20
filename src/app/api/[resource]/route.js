export const runtime = "nodejs";

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "api-data", "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

export async function GET(req, { params }) {
  const { resource } = params;
  const db = readDB();

  if (!db[resource]) {
    return Response.json({ error: "Resource not found" }, { status: 404 });
  }

  return Response.json(db[resource]);
}
