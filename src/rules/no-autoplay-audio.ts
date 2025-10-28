import { querySelectorAll } from "../utils";
import { AccessibilityError } from "../scanner";

const id = "no-autoplay-audio";
const text =
  "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;
const MAX_ALLOWED_DURATION_SECONDS = 3;

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

  // If duration is 3 seconds or less, it's okay
  // Note: duration might not be available until metadata is loaded
  // For static analysis, we need to flag it as needing review
  if (el.duration > 0 && el.duration <= MAX_ALLOWED_DURATION_SECONDS) {
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
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
