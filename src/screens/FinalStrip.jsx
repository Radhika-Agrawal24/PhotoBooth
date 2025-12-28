import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "../styles/finalStrip.css";

function FinalStrip({ photos, onRetake }) {
  const stripRef = useRef(null);

  const [background, setBackground] = useState(null);

  // Text states
  const [stripText, setStripText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(14);

  // Drag states
  const [textPos, setTextPos] = useState({ x: 50, y: 90 });
  const [isDragging, setIsDragging] = useState(false);

  const predefinedBackgrounds = [
    "./image1.png",
    "./image2.png",
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBackground(reader.result);
    reader.readAsDataURL(file);
  };

  const downloadStrip = async () => {
    const canvas = await html2canvas(stripRef.current, {
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "photo-strip.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /* ---------------- DRAG LOGIC ---------------- */
  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const handleDrag = (e) => {
    if (!isDragging) return;

    const rect = stripRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTextPos({
      x: Math.min(Math.max(x, 5), 95),
      y: Math.min(Math.max(y, 5), 95),
    });
  };

  return (
<div className="strip-main-container">
  {/* STRIP IN CENTER LEFT */}
  <div className="strip-wrapper">
    <div
      ref={stripRef}
      className="strip"
      style={{
        backgroundImage: background ? `url(${background})` : "none",
      }}
      onMouseMove={handleDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {photos.map((photo, index) => (
        <img key={index} src={photo} alt="strip" className="strip-photo" />
      ))}

      {/* DRAGGABLE TEXT */}
      <div
        className="strip-text"
        onMouseDown={startDrag}
        style={{
          left: `${textPos.x}%`,
          top: `${textPos.y}%`,
          color: textColor,
          fontWeight: isBold ? "bold" : "normal",
          fontFamily,
          fontSize: `${fontSize}px`,
        }}
      >
        {stripText}
      </div>
    </div>

    {/* ACTION BUTTONS BELOW STRIP */}
    <div className="actions">
      <button id="Down" onClick={downloadStrip}>Download PNG</button>
      <button onClick={onRetake} className="retake-btn">
        Take Again
      </button>
    </div>
  </div>

  {/* CONTROLS ON THE RIGHT */}
  <div className="controls">
    <h3>Background Options</h3>
    <div className="background-options">
      {predefinedBackgrounds.map((bg, i) => (
        <button
          key={i}
          onClick={() => setBackground(bg)}
          className={background === bg ? "active" : ""}
        >
          <img src={bg} alt="bg" />
        </button>
      ))}

      <input
        type="file"
        accept="image/*"
        id="upload-bg"
        hidden
        onChange={handleUpload}
      />
      <label htmlFor="upload-bg" className="upload-button">
        Upload Background
      </label>
    </div>

    <h3>Text Controls</h3>
    <div className="text-controls">
  <input
    type="text"
    placeholder="Add date or caption..."
    value={stripText}
    onChange={(e) => setStripText(e.target.value)}
  />

  {/* Font + Color Wrapper */}
  <div className="font-color-wrapper">
    <select
      value={fontFamily}
      onChange={(e) => setFontFamily(e.target.value)}
    >
      <option value="Arial">Arial</option>
      <option value="Georgia">Georgia</option>
      <option value="Courier New">Courier</option>
      <option value="'Comic Sans MS'">Handwritten</option>
      <option value="'Times New Roman'">Classic</option>
    </select>

    <input
      type="color"
      value={textColor}
      onChange={(e) => setTextColor(e.target.value)}
    />
  </div>

  <button
    className={isBold ? "active-btn" : ""}
    onClick={() => setIsBold(!isBold)}
  >
    Bold
  </button>

  <input
    type="range"
    min="10"
    max="28"
    value={fontSize}
    onChange={(e) => setFontSize(e.target.value)}
  />
</div>

  </div>
</div>

  );
}

export default FinalStrip;
