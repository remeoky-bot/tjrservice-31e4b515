import { AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const anton = loadAnton("normal", { weights: ["400"] });
const inter = loadInter("normal", { weights: ["400", "600", "800"] });
const ANTON = anton.fontFamily;
const INTER = inter.fontFamily;

const YELLOW = "#FFD60A";
const RED = "#E63946";
const BLACK = "#0A0A0A";
const WHITE = "#F5F5F5";

// Utility: Ken Burns image
function BgImg({ src, dur, start = 1, end = 1.15, dir = "in" as "in" | "left" | "right" }) {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [start, end], { extrapolateRight: "clamp" });
  const x = dir === "left" ? interpolate(f, [0, dur], [0, -30], { extrapolateRight: "clamp" })
          : dir === "right" ? interpolate(f, [0, dur], [0, 30], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: BLACK }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translate(${x}px,0)`, filter: "brightness(0.55) contrast(1.1) saturate(1.1)" }} />
    </AbsoluteFill>
  );
}

function Vignette() {
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />;
}

// Bold kinetic word
function KineticWord({ text, delay = 0, color = WHITE, size = 180, rotate = 0 }: { text: string; delay?: number; color?: string; size?: number; rotate?: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 180 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const sc = interpolate(s, [0, 1], [0.6, 1]);
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div style={{
      opacity: op, transform: `translateY(${y}px) scale(${sc}) rotate(${rotate}deg)`,
      fontFamily: ANTON, fontSize: size, color, letterSpacing: -2, lineHeight: 0.9,
      textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.7)",
    }}>{text}</div>
  );
}

// Slash accent bar
function AccentBar({ delay = 0, color = YELLOW, width = 240 }: { delay?: number; color?: string; width?: number }) {
  const f = useCurrentFrame();
  const w = interpolate(f - delay, [0, 20], [0, width], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ width: w, height: 8, background: color, borderRadius: 4 }} />;
}

// Scene 1: HOOK
function Scene1() {
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      {/* diagonal yellow flash */}
      <div style={{ position: "absolute", top: -100, left: -200, width: 1600, height: 300, background: YELLOW, transform: "rotate(-15deg)", opacity: 0.15 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
          <KineticWord text="STOP." delay={0} color={YELLOW} size={280} />
          <AccentBar delay={12} width={200} color={RED} />
          <KineticWord text="Votre entreprise" delay={22} color={WHITE} size={95} />
          <KineticWord text="mérite MIEUX" delay={38} color={WHITE} size={110} />
          <KineticWord text="qu'un cahier." delay={55} color={YELLOW} size={95} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// Scene 2: PAIN (fast image cuts + word overlays)
function Scene2() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={72}><BgImg src="images/01-galere.jpg" dur={72} dir="in" start={1.05} end={1.2} /></Sequence>
      <Sequence from={72} durationInFrames={72}><BgImg src="images/02-paperasse.jpg" dur={72} dir="left" start={1.1} end={1.25} /></Sequence>
      <Sequence from={144} durationInFrames={71}><BgImg src="images/01-galere.jpg" dur={71} dir="right" start={1.15} end={1.3} /></Sequence>
      <Vignette />
      {/* Word chips flashing */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start", paddingLeft: 60 }}>
          <WordChip text="VENTES" delay={5} color={YELLOW} />
          <WordChip text="STOCKS" delay={45} color={WHITE} />
          <WordChip text="EMPLOYÉS" delay={90} color={YELLOW} />
          <WordChip text="FACTURES" delay={135} color={RED} />
          <div style={{ height: 20 }} />
          <KineticWord text="TOUT dans" delay={175} size={80} color={WHITE} />
          <KineticWord text="UNE SEULE" delay={190} size={110} color={YELLOW} />
          <KineticWord text="application." delay={205} size={80} color={WHITE} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function WordChip({ text, delay = 0, color = YELLOW }: { text: string; delay?: number; color?: string }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 15, stiffness: 200 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-80, 0]);
  return (
    <div style={{
      opacity: op, transform: `translateX(${x}px)`,
      background: color, color: BLACK, padding: "10px 26px",
      fontFamily: ANTON, fontSize: 72, letterSpacing: 1, textTransform: "uppercase",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>{text}</div>
  );
}

// Scene 3: SOLUTION — logo reveal + team
function Scene3() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSpring = spring({ frame: f, fps, config: { damping: 10, stiffness: 120 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOp = interpolate(logoSpring, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a1a 100%)` }}>
      <Sequence from={0} durationInFrames={230}>
        <AbsoluteFill style={{ opacity: 0.35 }}>
          <BgImg src="images/05-equipe-tjr.jpg" dur={230} dir="in" start={1.0} end={1.15} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, marginBottom: 40 }}>
          <div style={{ width: 260, height: 260, background: WHITE, borderRadius: 32, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${YELLOW}55` }}>
            <Img src={staticFile("images/logo-new.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
        <KineticWord text="TJR SERVICE" delay={20} size={110} color={YELLOW} />
        <div style={{ height: 18 }} />
        <AccentBar delay={35} width={260} color={RED} />
        <div style={{ height: 30 }} />
        <KineticWord text="crée VOTRE application" delay={50} size={62} color={WHITE} />
        <KineticWord text="de gestion sur mesure." delay={70} size={62} color={WHITE} />
        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          <TagPill text="ÉCOLE" delay={130} />
          <TagPill text="BOUTIQUE" delay={150} />
          <TagPill text="ENTREPRISE" delay={170} />
          <TagPill text="RESTAURANT" delay={190} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function TagPill({ text, delay = 0 }: { text: string; delay?: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const sc = interpolate(s, [0, 1], [0.5, 1]);
  return (
    <div style={{
      opacity: op, transform: `scale(${sc})`,
      border: `2px solid ${YELLOW}`, color: YELLOW,
      padding: "10px 24px", borderRadius: 999,
      fontFamily: INTER, fontSize: 30, fontWeight: 700, letterSpacing: 2,
    }}>{text}</div>
  );
}

// Scene 4: features
function Scene4() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={110}><BgImg src="images/07-transformation.jpg" dur={110} dir="in" start={1.05} end={1.2} /></Sequence>
      <Sequence from={110} durationInFrames={110}><BgImg src="images/08-boutique.jpg" dur={110} dir="left" start={1.1} end={1.25} /></Sequence>
      <Vignette />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <FeatureLine icon="✓" text="Multi-utilisateurs" delay={5} />
          <FeatureLine icon="✓" text="100% sécurisé" delay={35} />
          <FeatureLine icon="✓" text="Piloté depuis votre téléphone" delay={65} />
          <FeatureLine icon="✓" text="Fabriqué à Madagascar" delay={95} color={YELLOW} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function FeatureLine({ icon, text, delay = 0, color = WHITE }: { icon: string; text: string; delay?: number; color?: string }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 16 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-40, 0]);
  return (
    <div style={{
      opacity: op, transform: `translateX(${x}px)`,
      display: "flex", alignItems: "center", gap: 20,
      background: "rgba(0,0,0,0.6)", padding: "16px 32px", borderRadius: 12,
      border: `1px solid ${color}44`,
    }}>
      <div style={{ color: YELLOW, fontFamily: ANTON, fontSize: 48 }}>{icon}</div>
      <div style={{ color, fontFamily: INTER, fontSize: 44, fontWeight: 600 }}>{text}</div>
    </div>
  );
}

// Scene 5: CTA
function Scene5() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 20 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BLACK} 0%, #1a1a1a 100%)`, opacity: op, justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* yellow strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: YELLOW }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: RED }} />
      <div style={{ width: 220, height: 220, background: WHITE, borderRadius: 28, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30, boxShadow: `0 0 80px ${YELLOW}66` }}>
        <Img src={staticFile("images/logo-new.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ fontFamily: ANTON, fontSize: 100, color: YELLOW, letterSpacing: 4 }}>TJR SERVICE</div>
      <div style={{ height: 4, width: 200, background: RED, margin: "18px 0" }} />
      <div style={{ fontFamily: INTER, fontSize: 28, color: WHITE, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>Contactez-nous dès aujourd'hui</div>
      <div style={{ marginTop: 40, textAlign: "center", fontFamily: INTER, color: WHITE, fontSize: 30, lineHeight: 1.7 }}>
        <div>📞 +261 34 79 333 70</div>
        <div>💬 WhatsApp +261 34 81 016 11</div>
        <div style={{ color: YELLOW, fontWeight: 600 }}>✉️ remeoky01@gmail.com</div>
        <div style={{ opacity: 0.85 }}>Comeup @remeoky</div>
      </div>
    </AbsoluteFill>
  );
}

export function FacebookVideo() {
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <Audio src={staticFile("audio-fb/music.mp3")} volume={0.32} />

      {/* Scene 1: 0-135 (4.5s) */}
      <Sequence from={0} durationInFrames={135}><Scene1 /></Sequence>
      <Sequence from={5}><Audio src={staticFile("audio-fb/v1.mp3")} volume={1.1} /></Sequence>

      {/* Scene 2: 135-350 (7.2s) */}
      <Sequence from={135} durationInFrames={215}><Scene2 /></Sequence>
      <Sequence from={140}><Audio src={staticFile("audio-fb/v2.mp3")} volume={1.1} /></Sequence>

      {/* Scene 3: 350-580 (7.7s) */}
      <Sequence from={350} durationInFrames={230}><Scene3 /></Sequence>
      <Sequence from={355}><Audio src={staticFile("audio-fb/v3.mp3")} volume={1.1} /></Sequence>

      {/* Scene 4: 580-810 (7.7s) */}
      <Sequence from={580} durationInFrames={230}><Scene4 /></Sequence>
      <Sequence from={585}><Audio src={staticFile("audio-fb/v4.mp3")} volume={1.1} /></Sequence>

      {/* Scene 5: 810-960 (5s) */}
      <Sequence from={810} durationInFrames={150}><Scene5 /></Sequence>
      <Sequence from={815}><Audio src={staticFile("audio-fb/v5.mp3")} volume={1.1} /></Sequence>
    </AbsoluteFill>
  );
}