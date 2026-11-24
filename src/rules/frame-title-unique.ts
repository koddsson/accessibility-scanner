import { AccessibilityError } from "../scanner.js";
import { getAccessibleName, querySelectorAll } from "../utils.js";

const id = "frame-title-unique";
const text = "Frames must have a unique title attribute";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const selector = "iframe, frame";

type Frame = { reported: Element; name: string; target: string | null };

function resolveTarget(frame: Element, baseURI: string): string | null {
  const src = frame.getAttribute("src")?.trim();
  if (!src) return null;
  try {
    return new URL(src, baseURI).href;
  } catch {
    return src;
  }
}

function collectFrames(
  frameElements: Element[],
  baseURI: string,
  container?: Element,
): Frame[] {
  const frames: Frame[] = [];
  for (const el of frameElements) {
    if (el.closest("[aria-hidden='true']")) continue;
    const reported = container ?? el;
    const name = getAccessibleName(el).toLowerCase();
    if (name) {
      frames.push({ reported, name, target: resolveTarget(el, baseURI) });
    }

    const srcdoc = el.getAttribute("srcdoc");
    if (!srcdoc) continue;
    const nested = new DOMParser().parseFromString(srcdoc, "text/html");
    frames.push(
      ...collectFrames(
        [...nested.querySelectorAll(selector)],
        baseURI,
        reported,
      ),
    );
  }
  return frames;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  const frameElements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    frameElements.push(element);
  }

  const framesByName = new Map<string, Frame[]>();
  for (const frame of collectFrames(frameElements, element.baseURI)) {
    const group = framesByName.get(frame.name) ?? [];
    group.push(frame);
    framesByName.set(frame.name, group);
  }

  for (const frames of framesByName.values()) {
    if (frames.length < 2) continue;
    const first = frames[0].target;
    if (first !== null && frames.every((frame) => frame.target === first)) {
      continue;
    }
    for (const frame of frames) {
      errors.push({
        id,
        element: frame.reported,
        text,
        url,
        needsReview: true,
      });
    }
  }

  return errors;
}
