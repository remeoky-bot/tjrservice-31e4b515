import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Vignette } from "../components/Vignette";
import { Subtitle } from "../components/Subtitle";

// 0-18s = 0-540 frames
export function Scene1Galere() {
  return (
    <AbsoluteFill>
      {/* Image 1: 0-9s */}
      <Sequence from={0} durationInFrames={270}>
        <KenBurns src="images/01-galere.jpg" duration={270} direction="in" start={1.0} end={1.12} />
      </Sequence>
      {/* Image 2: 9-18s */}
      <Sequence from={270} durationInFrames={270}>
        <KenBurns src="images/02-paperasse.jpg" duration={270} direction="left" start={1.1} end={1.2} />
      </Sequence>
      <Vignette strength={0.85} />
      {/* VO */}
      <Sequence from={30}>
        <Audio src={staticFile("audio/s1.mp3")} volume={1} />
      </Sequence>
      <Sequence from={240}>
        <Audio src={staticFile("audio/s2.mp3")} volume={1} />
      </Sequence>
      {/* Subtitles */}
      <Sequence from={30} durationInFrames={170}>
        <Subtitle text="Diriger son entreprise ne devrait pas être un combat quotidien." />
      </Sequence>
      <Sequence from={240} durationInFrames={280}>
        <Subtitle text="Stocks, ventes, employés, factures… Jamais assez de temps." />
      </Sequence>
    </AbsoluteFill>
  );
}