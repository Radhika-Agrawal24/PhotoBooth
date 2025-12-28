// src/Booth.jsx
import { useState } from "react";
import Home from "./screens/Home";
import Camo from "./screens/Camo";
import FinalStrip from "./screens/FinalStrip";

function Booth() {
  const [screen, setScreen] = useState("home");
  const [photos, setPhotos] = useState([]);

  const addPhoto = (photo) => {
    if (photos.length < 3) {
      setPhotos((prev) => [...prev, photo]);
    }
    if (photos.length === 2) {
      setScreen("final");
    }
  };

  const resetBooth = () => {
    setPhotos([]);
    setScreen("camera");
  };

  return (
    <>
      {screen === "home" && <Home onStart={() => setScreen("camera")} />}

      {screen === "camera" && (
        <Camo addPhoto={addPhoto} count={photos.length} />
      )}

      {screen === "final" && (
        <FinalStrip photos={photos} onRetake={resetBooth} />
      )}
      
    </>
  );
}

export default Booth;
