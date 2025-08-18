import { querySelectorAll, querySelector } from "../utils";
import { AccessibilityError } from "../scanner";

const id = "audio-caption";
const text = "<audio> elements must have a captions <track>";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("audio", element);
  if (element.matches("audio")) {
    elements.push(element as HTMLAudioElement);
  }
  for (const element of elements) {
    if (querySelector('track[kind="captions"]', element)) continue;
    errors.push({
      element,
      text,
      url,
    });
  }

  return errors;
}
