import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      throw new Error("No image URL provided");
    }

    // ✅ Convert image → base64 (REQUIRED for this endpoint)
    const { base64, mimeType } = await fetchImageAsBase64(imageUrl);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64,
                  },
                },
                {
                  text: `
Analyze this image carefully.

Return STRICT JSON only. No explanation, no markdown.

{
  "peopleCount": number,
  "isSinglePerson": boolean,
  "isFullBody": boolean,
  "confidence": number
}
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW:", JSON.stringify(data, null, 2));

    // ✅ safer extraction
    const parts = data?.candidates?.[0]?.content?.parts;
    const textPart = parts?.find((p: any) => p.text)?.text;

    if (!textPart) {
      return NextResponse.json({
        success: false,
        message: "No usable response from Gemini",
        debug: data,
      });
    }

    return NextResponse.json({
      success: true,
      raw: textPart,
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ helper
async function fetchImageAsBase64(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Image fetch failed");
  }

  const buffer = await res.arrayBuffer();

  return {
    base64: Buffer.from(buffer).toString("base64"),
    mimeType: res.headers.get("content-type") || "image/jpeg",
  };
}