import { querySelectorAll } from "../utils";
import { AccessibilityError } from "../scanner";

const id = "no-autoplay-audio";
const text =
  "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;
const MAX_ALLOWED_DURATION_SECONDS = 3;

// Parse a Media Fragments URI temporal range from a URL fragment, e.g.
// "video.mp4#t=8,10". Returns the playback duration cap in seconds when both
// start and end are provided, or `null` when the fragment doesn't bound the
// playback length (open-ended, malformed, or absent).
function durationFromMediaFragment(src: string | null): number | null {
  if (!src) return null;
  const hashIdx = src.indexOf("#");
  if (hashIdx === -1) return null;
  for (const param of src.slice(hashIdx + 1).split("&")) {
    if (!param.startsWith("t=")) continue;
    const [startStr, endStr] = param.slice(2).split(",");
    if (endStr === undefined) return null;
    const start = startStr === "" ? 0 : parseFloat(startStr);
    const end = parseFloat(endStr);
    if (isNaN(start) || isNaN(end)) return null;
    return Math.max(0, end - start);
  }
  return null;
}

function getEffectiveDuration(
  el: HTMLAudioElement | HTMLVideoElement,
): number | null {
  if (el.duration > 0 && !isNaN(el.duration)) return el.duration;

  const srcs: string[] = [];
  const ownSrc = el.getAttribute("src");
  if (ownSrc) srcs.push(ownSrc);
  for (const source of el.querySelectorAll<HTMLSourceElement>("source")) {
    const s = source.getAttribute("src");
    if (s) srcs.push(s);
  }
  if (srcs.length === 0) return null;

  let maxDuration = 0;
  for (const src of srcs) {
    const dur = durationFromMediaFragment(src);
    // If any source lacks a bounded fragment we can't prove the clip is short.
    if (dur === null) return null;
    if (dur > maxDuration) maxDuration = dur;
  }
  return maxDuration;
}

function hasAutoplayViolation(
  el: HTMLAudioElement | HTMLVideoElement,
): boolean {
  // Check if element has autoplay attribute
  if (!el.hasAttribute("autoplay")) {
    return false;
  }

  // If muted, it's okay
  if (el.hasAttribute("muted") || el.muted) {
    return false;
  }

  // If has controls, it's okay (user can stop/mute)
  if (el.hasAttribute("controls")) {
    return false;
  }

  // If duration is 3 seconds or less, it's okay. Falls back to the temporal
  // media fragment range when metadata-derived duration is unavailable.
  const duration = getEffectiveDuration(el);
  if (duration !== null && duration <= MAX_ALLOWED_DURATION_SECONDS) {
    return false;
  }

  // Element has autoplay without proper controls/muting
  return true;
}

export default function (element: Element): AccessibilityError[] {
  const errors = [];

  // Query for both audio and video elements
  const audioElements = querySelectorAll("audio", element);
  const videoElements = querySelectorAll("video", element);

  if (element.matches("audio")) {
    audioElements.push(element as HTMLAudioElement);
  }
  if (element.matches("video")) {
    videoElements.push(element as HTMLVideoElement);
  }

  // Check audio elements
  for (const audioElement of audioElements) {
    const el = audioElement as HTMLAudioElement;
    if (hasAutoplayViolation(el)) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  // Check video elements
  for (const videoElement of videoElements) {
    const el = videoElement as HTMLVideoElement;
    if (hasAutoplayViolation(el)) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
