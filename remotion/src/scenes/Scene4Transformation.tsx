import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Vignette } from "../components/Vignette";
import { Subtitle } from "../components/Subtitle";

// 52-66s = 420 frames
export function Scene4Transformation() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={240}>
        <KenBurns src="images/07-transformation.jpg" duration={240} direction="in" start={1.0} end={1.12} />
      </Sequence>
      <Sequence from={240} durationInFrames={180}>
        <KenBurns src="images/08-boutique.jpg" duration={180} direction="right" start={1.05} end={1.18} />
      </Sequence>
      <Vignette strength={0.55} />
      <Sequence from={20}>
        <Audio src={staticFile("audio/s6.mp3")} volume={1} />
      </Sequence>
      <Sequence from={20} durationInFrames={280}>
        <Subtitle text="Aujourd'hui, il pilote son entreprise depuis n'importe où. En temps réel." />
      </Sequence>
    </AbsoluteFill>
  );
}