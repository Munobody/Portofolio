import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/portfolio.json");

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Database file does not exist" }, { status: 404 });
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to read database file" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ensure parent directories exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, message: "Portfolio data successfully saved to disk" });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to save database file" }, { status: 500 });
  }
}
