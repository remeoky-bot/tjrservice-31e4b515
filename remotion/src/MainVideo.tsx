import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Scene1Galere } from "./scenes/Scene1Galere";
import { Scene2Conseil } from "./scenes/Scene2Conseil";
import { Scene3TJR } from "./scenes/Scene3TJR";
import { Scene4Transformation } from "./scenes/Scene4Transformation";
import { Scene5Outro } from "./scenes/Scene5Outro";

loadPlayfair("normal", { weights: ["400", "700"] });
loadInter("normal", { weights: ["400", "500", "600", "700"] });

export function MainVideo() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background music (whole video, low volume) */}
      <Audio src={staticFile("audio/music.mp3")} volume={0.28} />

      {/* Scenes */}
      <Sequence from={0} durationInFrames={540}>
        <Scene1Galere />
      </Sequence>
      <Sequence from={540} durationInFrames={360}>
        <Scene2Conseil />
      </Sequence>
      <Sequence from={900} durationInFrames={660}>
        <Scene3TJR />
      </Sequence>
      <Sequence from={1560} durationInFrames={420}>
        <Scene4Transformation />
      </Sequence>
      <Sequence from={1980} durationInFrames={1020}>
        <Scene5Outro />
      </Sequence>
    </AbsoluteFill>
  );
}