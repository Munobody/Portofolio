import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to retrieve the webpage" }, { status: 400 });
    }

    const html = await response.text();

    // Helper regex matcher to retrieve open graph metadata tags
    const getMetaValue = (tag: string) => {
      // Find tags in either property or name form, with attributes in any order
      const regexes = [
        new RegExp(`<meta[^>]*property=["'](?:og:)?${tag}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["'](?:og:)?${tag}["']`, "i"),
        new RegExp(`<meta[^>]*name=["'](?:twitter:)?${tag}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["'](?:twitter:)?${tag}["']`, "i"),
      ];

      for (const regex of regexes) {
        const match = html.match(regex);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    };

    const title = getMetaValue("title") || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || "";
    const description = getMetaValue("description") || "";
    const image = getMetaValue("image") || "";

    return NextResponse.json({
      title,
      description,
      image,
    });
  } catch (error) {
    console.error("POST /api/scrape error:", error);
    return NextResponse.json({ error: "Scraper failed to scrape link content" }, { status: 500 });
  }
}
