import { AccessibilityError } from "../scanner";
import { labelledByIsValid } from "../utils";

const id = 'audio-caption'
const text = "<audio> elements must have a captions <track>";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = Array.from(el.querySelectorAll<HTMLAudioElement>("audio"));
  if (el.matches("audio")) {
    elements.push(el as HTMLAudioElement);
  }
  for (const element of elements) {
    if (element.querySelector('track[kind="captions"]')) continue
    errors.push({
      element,
      text,
      url,
    });
  }

  return errors;
}
