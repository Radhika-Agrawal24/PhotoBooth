import { useEffect, useRef, useState } from "react";
import "../styles/camo.css";
import {
  initBackgroundRemoval,
  removeBackgroundFromFrame,
} from "../features/backgroundRemoval";

const FILTERS = {
  normal: "none",
  bw: "grayscale(100%)",
  warm: "sepia(40%) saturate(120%)",
  vintage: "sepia(60%) contrast(120%) brightness(90%)",
  cool: "hue-rotate(180deg) saturate(110%)",
  bright: "brightness(120%)",
  retro: "contrast(120%) sepia(20%)",
  neon: "contrast(150%) saturate(200%)",
  blur: "blur(2px)",
};

// Add multiple backgrounds here
const BACKGROUNDS = [
  { name: "bg1", src: "/bg1.png" },
  { name: "bg2", src: "/bg2.png" }, // new background
];

function Camo({ addPhoto, count }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const tempCanvasRef = useRef(document.createElement("canvas"));
  const bgRefs = useRef({}); // cache all backgrounds

  const brightnessRef = useRef(null);
  const contrastRef = useRef(null);
  const blurRef = useRef(null);
  const hueRef = useRef(null);
  const saturateRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [removeBg, setRemoveBg] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturate, setSaturate] = useState(100);

  const [bgVisible, setBgVisible] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [selectedBg, setSelectedBg] = useState("bg1"); // default background

  /* ===== LOAD CAMERA ===== */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  /* ===== INIT BACKGROUND REMOVAL ===== */
  useEffect(() => {
    if (removeBg) initBackgroundRemoval();
  }, [removeBg]);

  /* ===== CACHE BACKGROUND IMAGES ===== */
  useEffect(() => {
    BACKGROUNDS.forEach((bg) => {
      const img = new Image();
      img.src = bg.src;
      img.onload = () => (bgRefs.current[bg.name] = img);
    });
  }, []);

  /* ===== APPLY FILTERS ===== */
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.style.filter = `
      ${FILTERS[selectedFilter]}
      brightness(${brightness}%)
      contrast(${contrast}%)
      blur(${blur}px)
      hue-rotate(${hue}deg)
      saturate(${saturate}%)
    `;
  }, [selectedFilter, brightness, contrast, blur, hue, saturate]);

  /* ===== SLIDER FILL HELPERS ===== */
  const updateFill = (e) => {
    const min = e.target.min;
    const max = e.target.max;
    const val = e.target.value;
    const percent = ((val - min) * 100) / (max - min);
    e.target.style.setProperty("--fill", `${percent}%`);
  };

  const setFillByValue = (input, value) => {
    if (!input) return;
    const min = input.min;
    const max = input.max;
    const percent = ((value - min) * 100) / (max - min);
    input.style.setProperty("--fill", `${percent}%`);
  };

  useEffect(() => {
    setFillByValue(brightnessRef.current, brightness);
    setFillByValue(contrastRef.current, contrast);
    setFillByValue(blurRef.current, blur);
    setFillByValue(hueRef.current, hue);
    setFillByValue(saturateRef.current, saturate);
  }, [brightness, contrast, blur, hue, saturate]);

  /* ===== TAKE PHOTO ===== */
  const takePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    tempCanvasRef.current.width = canvas.width;
    tempCanvasRef.current.height = canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if visible
    if (removeBg && bgVisible && bgRefs.current[selectedBg]) {
      ctx.globalAlpha = bgOpacity;
      ctx.drawImage(bgRefs.current[selectedBg], 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    if (removeBg) {
      const results = await removeBackgroundFromFrame(video);

      const tempCtx = tempCanvasRef.current.getContext("2d");
      tempCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segmentation mask
      tempCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
      tempCtx.globalCompositeOperation = "source-in";

      // Draw person with filters
      tempCtx.filter = `
        ${FILTERS[selectedFilter]}
        brightness(${brightness}%)
        contrast(${contrast}%)
        blur(${blur}px)
        hue-rotate(${hue}deg)
        saturate(${saturate}%)
      `;
      tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
      tempCtx.filter = "none";

      // Composite onto main canvas
      ctx.drawImage(tempCanvasRef.current, 0, 0);
    } else {
      ctx.filter = `
        ${FILTERS[selectedFilter]}
        brightness(${brightness}%)
        contrast(${contrast}%)
        blur(${blur}px)
        hue-rotate(${hue}deg)
        saturate(${saturate}%)
      `;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
    }

    addPhoto(canvas.toDataURL("image/png"));
  };

  return (
    <div className="camo-container">
      <p>{count + 1} / 3</p>

      <video ref={videoRef} autoPlay style={{ width: "640px", height: "480px" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {bgVisible && removeBg && bgRefs.current[selectedBg] && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "160px",
            height: "120px",
            border: "2px solid #fff",
            overflow: "hidden",
            borderRadius: "8px",
            zIndex: 2,
          }}
        >
          <img
            src={bgRefs.current[selectedBg].src}
            alt="bg preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: bgOpacity,
            }}
          />
        </div>
      )}

      {/* Background selector strip */}
      {removeBg && (
        <div style={{ display: "flex", margin: "10px 0" }}>
          {BACKGROUNDS.map((bg) => (
            <img
              key={bg.name}
              src={bg.src}
              alt={bg.name}
              style={{
                width: "60px",
                height: "45px",
                border: selectedBg === bg.name ? "2px solid #fff" : "1px solid #888",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={() => setSelectedBg(bg.name)}
            />
          ))}
        </div>
      )}

      <div className="filter-bar">
        {Object.keys(FILTERS).map((key) => (
          <button
            key={key}
            className={selectedFilter === key ? "active-filter" : ""}
            onClick={() => {
              setSelectedFilter(key);
              setBrightness(100);
              setContrast(100);
              setBlur(0);
              setHue(0);
              setSaturate(100);
            }}
          >
            {key}
          </button>
        ))}
      </div>

    {/* Remove Background toggle */}
<label className="bg-toggle">
  <input
    type="checkbox"
    checked={removeBg}
    onChange={(e) => setRemoveBg(e.target.checked)}
  />
  Remove Background
</label>

{/* Show Background toggle - only visible if removeBg is true */}
{removeBg && (
  <label className="bg-toggle">
    <input
      type="checkbox"
      checked={bgVisible}
      onChange={(e) => setBgVisible(e.target.checked)}
    />
    Show Background
  </label>
)}

{/* Take Photo button below toggles */}
<button className="take-btn" onClick={takePhoto}>
  Take Photo
</button>


      {bgVisible && removeBg && (
        <label>
          Background Opacity
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bgOpacity}
            onChange={(e) => setBgOpacity(e.target.value)}
          />
        </label>
      )}

      <div className="slider-bar">
        <label>
          Brightness
          <input
            ref={brightnessRef}
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => {
              setBrightness(e.target.value);
              updateFill(e);
            }}
          />
        </label>

        <label>
          Contrast
          <input
            ref={contrastRef}
            type="range"
            min="50"
            max="150"
            value={contrast}
            onChange={(e) => {
              setContrast(e.target.value);
              updateFill(e);
            }}
          />
        </label>

        <label>
          Blur
          <input
            ref={blurRef}
            type="range"
            min="0"
            max="5"
            value={blur}
            onChange={(e) => {
              setBlur(e.target.value);
              updateFill(e);
            }}
          />
        </label>

        <label>
          Hue
          <input
            ref={hueRef}
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => {
              setHue(e.target.value);
              updateFill(e);
            }}
          />
        </label>

        <label>
          Saturate
          <input
            ref={saturateRef}
            type="range"
            min="50"
            max="200"
            value={saturate}
            onChange={(e) => {
              setSaturate(e.target.value);
              updateFill(e);
            }}
          />
        </label>
      </div>

    </div>
  );
}

export default Camo;
