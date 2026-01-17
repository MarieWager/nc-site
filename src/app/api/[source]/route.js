import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "api-data", "db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function GET(req, { params }) {
  const { resource } = params;
  const db = readDB();

  if (!db[resource]) {
    return Response.json({ error: "Resource not found" }, { status: 404 });
  }

  return Response.json(db[resource]);
}

export async function POST(req, { params }) {
  const { resource } = params;
  const db = readDB();

  if (!db[resource]) {
    return Response.json({ error: "Resource not found" }, { status: 404 });
  }

  const newItem = await req.json();

  // Generate ID if not provided
  if (!newItem.id) {
    const maxId = Math.max(...db[resource].map((item) => item.id || 0), 0);
    newItem.id = maxId + 1;
  }

  db[resource].push(newItem);
  writeDB(db);

  return Response.json(newItem, { status: 201 });
}
