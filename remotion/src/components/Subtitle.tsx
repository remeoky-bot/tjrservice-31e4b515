import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export function Subtitle({
  text,
  align = "bottom",
}: {
  text: string;
  align?: "bottom" | "center" | "top";
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [30, 0]);
  const justify = align === "top" ? "flex-start" : align === "center" ? "center" : "flex-end";
  const padding = align === "top" ? "80px 0 0 0" : align === "center" ? "0" : "0 0 100px 0";
  return (
    <AbsoluteFill style={{ justifyContent: justify, alignItems: "center", padding }}>
      <div
        style={{
          maxWidth: "1500px",
          padding: "24px 48px",
          background: "linear-gradient(180deg, rgba(6,24,41,0.0) 0%, rgba(6,24,41,0.85) 100%)",
          borderRadius: 12,
          textAlign: "center",
          transform: `translateY(${y}px)`,
          opacity,
        }}
      >
        <div
          style={{
            color: "#F5F0E6",
            fontSize: 44,
            fontWeight: 500,
            lineHeight: 1.35,
            fontFamily: "Inter, sans-serif",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            letterSpacing: 0.3,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
}