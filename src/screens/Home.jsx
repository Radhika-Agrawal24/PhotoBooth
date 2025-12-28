import "../styles/home.css"; // if it's in src/styles
import React from "react";
function Home({ onStart }) {
  return (
    <div className="home">
      {/* Fullscreen background */}
      <img id="bg" src="./Home.png" alt="Background" />

      {/* Foreground content */}
      <h1>Photo Booth</h1>
      <button onClick={onStart}>Open Camera</button>
    </div>
  );
}

export default Home;
