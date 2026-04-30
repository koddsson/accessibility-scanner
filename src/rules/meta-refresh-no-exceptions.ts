import { AccessibilityError } from "../scanner";

const id = "meta-refresh-no-exceptions";
const text = "Delayed refresh under 20 hours must not be used";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

// Parse the delay (in seconds) from a meta refresh `content` value following
// the HTML spec's shared declarative refresh steps: optional whitespace, ASCII
// digits, then a separator (whitespace, `;`, `,`) or end of input. Returns
// `null` when the value is malformed and the browser would ignore the meta.
function parseRefreshDelay(content: string | null): number | null {
  if (content === null) return null;
  const match = content.match(/^\s*(\d+)(?:[\s,;]|$)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export default function (element: Element): AccessibilityError[] {
  const selector = 'meta[http-equiv="refresh"]';
  const elements: HTMLMetaElement[] = element.matches(selector)
    ? [element as HTMLMetaElement]
    : [...element.querySelectorAll<HTMLMetaElement>(selector)];

  for (const el of elements) {
    const delay = parseRefreshDelay(el.getAttribute("content"));
    if (delay === null) continue;
    if (delay > 0) {
      return [{ id, element: el, text, url }];
    }
    return [];
  }
  return [];
}
