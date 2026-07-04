import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Vignette } from "../components/Vignette";
import { Subtitle } from "../components/Subtitle";
import { GOLD } from "../theme";

// 30-52s = 660 frames
function TJRBadge() {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 60, left: 60, opacity: op,
      background: "rgba(6,24,41,0.85)", border: `1px solid ${GOLD}`,
      padding: "12px 24px", borderRadius: 50,
      color: GOLD, fontFamily: "Inter, sans-serif",
      fontSize: 22, fontWeight: 600, letterSpacing: 3,
    }}>
      ▲ TJR SERVICE
    </div>
  );
}

export function Scene3TJR() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={360}>
        <KenBurns src="images/05-equipe-tjr.jpg" duration={360} direction="left" start={1.0} end={1.12} />
      </Sequence>
      <Sequence from={360} durationInFrames={300}>
        <KenBurns src="images/06-conception.jpg" duration={300} direction="in" start={1.05} end={1.18} />
      </Sequence>
      <Vignette strength={0.65} />
      <TJRBadge />
      <Sequence from={30}>
        <Audio src={staticFile("audio/s4.mp3")} volume={1} />
      </Sequence>
      <Sequence from={360}>
        <Audio src={staticFile("audio/s5.mp3")} volume={1} />
      </Sequence>
      <Sequence from={30} durationInFrames={310}>
        <Subtitle text="TJR SERVICE conçoit des applications de gestion sur mesure." />
      </Sequence>
      <Sequence from={360} durationInFrames={260}>
        <Subtitle text="Analyse, conception, développement. Une équipe qui comprend votre réalité." />
      </Sequence>
    </AbsoluteFill>
  );
}