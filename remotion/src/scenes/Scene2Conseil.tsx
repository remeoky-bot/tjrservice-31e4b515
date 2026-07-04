import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Vignette } from "../components/Vignette";
import { Subtitle } from "../components/Subtitle";

// 18-30s = 540-900, local 0-360
export function Scene2Conseil() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210}>
        <KenBurns src="images/03-conseil.jpg" duration={210} direction="right" start={1.05} end={1.15} />
      </Sequence>
      <Sequence from={210} durationInFrames={150}>
        <KenBurns src="images/04-tablette.jpg" duration={150} direction="in" start={1.0} end={1.12} />
      </Sequence>
      <Vignette strength={0.6} />
      <Sequence from={20}>
        <Audio src={staticFile("audio/s3.mp3")} volume={1} />
      </Sequence>
      <Sequence from={20} durationInFrames={200}>
        <Subtitle text="Et si la solution… tenait dans votre poche ?" />
      </Sequence>
    </AbsoluteFill>
  );
}