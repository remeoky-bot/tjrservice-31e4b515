import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

type Direction = "in" | "out" | "left" | "right";

export function KenBurns({
  src,
  duration,
  direction = "in",
  start = 1.0,
  end = 1.15,
}: {
  src: string;
  duration: number;
  direction?: Direction;
  start?: number;
  end?: number;
}) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [start, end], { extrapolateRight: "clamp" });
  let x = 0;
  let y = 0;
  if (direction === "left") x = interpolate(frame, [0, duration], [0, -40], { extrapolateRight: "clamp" });
  if (direction === "right") x = interpolate(frame, [0, duration], [0, 40], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
}