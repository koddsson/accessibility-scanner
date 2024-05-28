import { querySelectorAll } from "kagekiri";
import { AccessibilityError } from "../scanner";

const text = "<video> elements must have a <track> for captions";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/video-caption?application=RuleDescription";

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("video", el);
  if (el.matches("video")) {
    elements.push(el as HTMLElement);
  }
  for (const element of elements) {
    const tracks = querySelectorAll("track", element) as HTMLTrackElement[];
    if (tracks.length === 0) {
      errors.push({
        element,
        text,
        url,
      });
    }

    for (const track of tracks) {
      if (track.kind !== "captions") {
        errors.push({
          element,
          text,
          url,
        });
      }
    }
  }
  return errors;
}
