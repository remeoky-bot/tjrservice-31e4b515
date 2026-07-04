import { AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Vignette } from "../components/Vignette";
import { Subtitle } from "../components/Subtitle";
import { GOLD, CREAM, NAVY_DEEP } from "../theme";

// 66-100s = 1020 frames
function OutroCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 25 } });
  const op = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const logoFrame = frame - 15;
  const logoScale = spring({ frame: logoFrame, fps, config: { damping: 10, stiffness: 100 } });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, #030d18 100%)`,
      justifyContent: "center", alignItems: "center",
      opacity: op,
    }}>
      {/* subtle bokeh bg */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <Img src={staticFile("images/10-outro-bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "relative", transform: `scale(${scale})`, textAlign: "center", zIndex: 2 }}>
        <div style={{
          width: 220, height: 220, margin: "0 auto 40px",
          background: CREAM, borderRadius: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, boxShadow: `0 20px 60px rgba(212,175,55,0.4)`,
          transform: `scale(${logoScale})`,
        }}>
          <Img src={staticFile("images/logo-tjr.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{
          color: CREAM, fontFamily: "'Playfair Display', serif",
          fontSize: 92, fontWeight: 700, letterSpacing: 8,
        }}>
          TJR SERVICE
        </div>
        <div style={{
          width: 200, height: 3, background: GOLD, margin: "24px auto",
        }} />
        <div style={{
          color: GOLD, fontFamily: "Inter, sans-serif",
          fontSize: 26, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase",
        }}>
          Digitalisez · Simplifiez · Prospérez
        </div>
        <div style={{
          marginTop: 60, color: CREAM, fontFamily: "Inter, sans-serif",
          fontSize: 22, lineHeight: 2, opacity: 0.95,
        }}>
          <div><span style={{ color: GOLD, fontWeight: 600 }}>TÉL</span>&nbsp;&nbsp;+261 34 79 333 70 &nbsp;·&nbsp; +261 32 04 464 90</div>
          <div><span style={{ color: GOLD, fontWeight: 600 }}>WHATSAPP</span>&nbsp;&nbsp;+261 34 81 016 11</div>
          <div><span style={{ color: GOLD, fontWeight: 600 }}>EMAIL</span>&nbsp;&nbsp;remeoky01@gmail.com &nbsp;·&nbsp; Comeup @remeoky</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function Scene5Outro() {
  return (
    <AbsoluteFill>
      {/* Beach shot first */}
      <Sequence from={0} durationInFrames={330}>
        <KenBurns src="images/09-plage.jpg" duration={330} direction="in" start={1.0} end={1.15} />
        <Vignette strength={0.55} />
      </Sequence>
      {/* Outro card */}
      <Sequence from={330} durationInFrames={690}>
        <OutroCard />
      </Sequence>
      {/* VO */}
      <Sequence from={20}>
        <Audio src={staticFile("audio/s7.mp3")} volume={1} />
      </Sequence>
      <Sequence from={330}>
        <Audio src={staticFile("audio/s8.mp3")} volume={1} />
      </Sequence>
      {/* Subtitle only on beach */}
      <Sequence from={20} durationInFrames={280}>
        <Subtitle text="TJR SERVICE. Digitalisez. Simplifiez. Prospérez." />
      </Sequence>
    </AbsoluteFill>
  );
}