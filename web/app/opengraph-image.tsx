import { ImageResponse } from "next/og";

export const alt = "OCTO — One system. Every investment decision.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LAYERS = ["Data", "Ontology", "Intelligence", "Action"];

/** Open Graph card in the landing's dark system language (PAL-038). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#050505", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 600, letterSpacing: 7 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, border: "2.5px solid #ffffff" }}>
              <div style={{ width: 9, height: 9, background: "#6D45FF" }} />
            </div>
            OCTO
          </div>
          <div style={{ display: "flex", fontSize: 16, letterSpacing: 3, color: "#8A8F98" }}>PRIVATE MARKETS INFRASTRUCTURE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 500, letterSpacing: -3.5, lineHeight: 1 }}>
          <span>One system.</span>
          <span>Every investment decision.</span>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.14)" }}>
          {LAYERS.map((l, i) => (
            <div
              key={l}
              style={{
                display: "flex",
                flex: 1,
                gap: 12,
                padding: "20px 0 0",
                fontSize: 20,
                color: i === LAYERS.length - 1 ? "#B9A6FF" : "#ffffff",
              }}
            >
              <span style={{ color: "#8A8F98" }}>{`0${i + 1}`}</span>
              {l}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
