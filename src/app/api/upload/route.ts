import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define uploads directory under Next.js public directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize base file name and create a unique name
    const originalName = file.name;
    const extension = path.extname(originalName);
    const cleanBaseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${cleanBaseName}_${Date.now()}${extension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Write file to local disk
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
