import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Jason Fox - Content Designer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f1e8", // soft-linen
          padding: "60px",
        }}
      >
        {/* Decorative accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#90955e", // palm-leaf
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#2d3a2e", // text-primary
              letterSpacing: "-0.02em",
            }}
          >
            Jason Fox
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "36px",
              fontWeight: 400,
              color: "#5a6b5c", // text-secondary
            }}
          >
            Content Designer
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: 400,
              color: "#8a9a8c", // text-muted
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Crafting user experiences through strategic content design
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "#90955e", // palm-leaf
            fontWeight: 500,
          }}
        >
          jsnfx.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
