import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// 100s @ 30fps = 3000 frames
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={3000}
    fps={30}
    width={1920}
    height={1080}
  />
);