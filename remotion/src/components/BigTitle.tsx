import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GOLD } from "../theme";

export function BigTitle({ text, sub }: { text: string; sub?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 30, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const bar = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <div
          style={{
            width: 120 * bar,
            height: 3,
            background: GOLD,
            margin: "0 auto 30px",
            transformOrigin: "left",
          }}
        />
        <div
          style={{
            color: "#F5F0E6",
            fontFamily: "'Playfair Display', serif",
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          {text}
        </div>
        {sub && (
          <div
            style={{
              color: GOLD,
              fontFamily: "Inter, sans-serif",
              fontSize: 28,
              fontWeight: 500,
              marginTop: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}