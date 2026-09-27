import { ImageResponse } from "next/og";

export const alt = "OCTO — One system. Every investment decision.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PATH = ["Fund", "Investment", "Company", "Transaction", "Metric", "Report"];

/** Open Graph card in the landing's system visual language (SEO-003). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#ffffff", color: "#111318" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 600, letterSpacing: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 15, border: "2.5px solid #111318" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#6D45FF" }} />
          </div>
          OCTO
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, letterSpacing: -2.5, lineHeight: 1.05 }}>
          <span>One system.</span>
          <span>Every investment decision.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: "#4B5563" }}>
          {PATH.map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 && <div style={{ width: 28, height: 1.5, background: "#6D45FF" }} />}
              <div
                style={{
                  display: "flex",
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: i === PATH.length - 1 ? "1.5px solid #6D45FF" : "1.5px solid #E5E7EB",
                  background: i === PATH.length - 1 ? "rgba(109,69,255,0.08)" : "#ffffff",
                  color: i === PATH.length - 1 ? "#6D45FF" : "#4B5563",
                }}
              >
                {p}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
