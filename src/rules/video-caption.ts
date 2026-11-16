import { querySelectorAll } from "../utils.js";
import { AccessibilityError } from "../scanner.js";

const id = "video-caption";
const text = "<video> elements must have a <track> for captions";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("video", element);
  if (element.matches("video")) {
    elements.push(element as HTMLElement);
  }
  for (const element of elements) {
    const tracks = querySelectorAll("track", element) as HTMLTrackElement[];
    if (tracks.length === 0) {
      errors.push({
        id,
        element,
        text,
        url,
      });
    }

    for (const track of tracks) {
      if (track.kind !== "captions") {
        errors.push({
          id,
          element,
          text,
          url,
        });
      }
    }
  }
  return errors;
}
