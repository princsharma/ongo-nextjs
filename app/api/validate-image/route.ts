import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      throw new Error("No image URL provided");
    }

    // ✅ Get base64 + correct mime type
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
                // 🔥 IMAGE FIRST (IMPORTANT)
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64,
                  },
                },
                {
                  text: `
Analyze this image and return ONLY JSON:

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
            temperature: 0.2,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    const data = await response.json();

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("GEMINI RAW:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    return NextResponse.json({
      success: true,
      raw: text,
    });

  } catch (err: any) {
    console.error("Gemini ERROR:", err);

    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Helper (supports jpg/png/jpeg automatically)
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