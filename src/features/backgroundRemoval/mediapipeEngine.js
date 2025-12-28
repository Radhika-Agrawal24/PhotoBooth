import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

let segmenter = null;
let resolveCallback = null;

export async function initMediaPipe() {
  if (segmenter) return;

  segmenter = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  segmenter.setOptions({
    modelSelection: 1,
  });

  segmenter.onResults((results) => {
    if (resolveCallback) {
      resolveCallback(results);
      resolveCallback = null;
    }
  });
}

export async function segmentPerson(videoEl) {
  if (!segmenter) {
    throw new Error("MediaPipe not initialized");
  }

  return new Promise(async (resolve) => {
    resolveCallback = resolve;
    await segmenter.send({ image: videoEl });
  });
}

/* ===============================
   🎨 RENDER HELPERS
   =============================== */

export function renderWithBackground({
  results,
  canvas,
  backgroundSrc = null,
}) {
  const ctx = canvas.getContext("2d");

  canvas.width = results.image.width;
  canvas.height = results.image.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1️⃣ Draw background
  if (backgroundSrc) {
    const bgImg = new Image();
    bgImg.src = backgroundSrc;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  // 2️⃣ Apply mask
  ctx.save();
  ctx.globalCompositeOperation = "destination-atop";
  ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // 3️⃣ Draw person
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
}
