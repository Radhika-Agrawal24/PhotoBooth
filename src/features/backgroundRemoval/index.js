import { initMediaPipe, segmentPerson } from "./mediapipeEngine";

let initialized = false;

export async function initBackgroundRemoval() {
  if (initialized) return;
  await initMediaPipe();
  initialized = true;
}

export async function removeBackgroundFromFrame(videoEl) {
  if (!initialized) {
    throw new Error("Background removal not initialized");
  }
  return await segmentPerson(videoEl);
}
