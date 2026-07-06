import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FacebookVideo } from "./FacebookVideo";

export const RemotionRoot = () => (
  <>
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={3000}
    fps={30}
    width={1920}
    height={1080}
  />
  <Composition
    id="facebook"
    component={FacebookVideo}
    durationInFrames={960}
    fps={30}
    width={1080}
    height={1350}
  />
  </>
);