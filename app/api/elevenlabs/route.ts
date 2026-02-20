import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — clear, neutral female voice

// Simple in-memory cache to avoid re-generating identical audio
const audioCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function POST(request: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    console.error("ELEVENLABS_API_KEY is not set in environment variables");
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  // Validate key format
  if (!ELEVENLABS_API_KEY.startsWith("sk_")) {
    console.error("ELEVENLABS_API_KEY does not start with sk_ prefix");
    return NextResponse.json(
      { error: "Invalid API key format" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const {
    text,
    voiceId = VOICE_ID,
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0,
    speed = 1.0,
    nextText,
    previousText,
    cacheKey,
  } = body;

  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  // Check cache
  const key = cacheKey || `${voiceId}-${text}-${stability}-${style}-${speed}`;
  const cached = audioCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ audio: cached.data });
  }

  const requestBody: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability,
      similarity_boost: similarityBoost,
      style,
      speed,
      use_speaker_boost: true,
    },
  };

  if (nextText) requestBody.next_text = nextText;
  if (previousText) requestBody.previous_text = previousText;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "ElevenLabs API error:",
      response.status,
      errorText,
      "Key prefix:",
      ELEVENLABS_API_KEY.substring(0, 6) + "..."
    );
    return NextResponse.json(
      { error: "Failed to generate audio", status: response.status, detail: errorText },
      { status: response.status }
    );
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  // Cache the result
  audioCache.set(key, { data: base64Audio, timestamp: Date.now() });

  return NextResponse.json({ audio: base64Audio });
}
