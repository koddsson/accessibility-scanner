const id = "meta-viewport-large";
const text = "Users should be able to zoom and scale the text up to 500%";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function parseContent(content: string): Record<string, string> {
  const object: Record<string, string> = {};
  for (const pair of content.split(",")) {
    const [key, value] = pair.split("=");
    if (key && value) {
      object[key.trim().toLowerCase()] = value.trim().toLowerCase();
    }
  }
  return object;
}

export default function metaViewportLarge(element: Element) {
  const errors = [];

  const selector = "meta[name=viewport]";
  // meta[name=viewport] is in <head>, so search the full document if available
  const searchRoot = element.ownerDocument ?? element;
  const elements = [...searchRoot.querySelectorAll<HTMLMetaElement>(selector)];
  if (element.matches(selector)) elements.push(element as HTMLMetaElement);
  for (const element of elements) {
    const content = parseContent(element.content);
    if (content["user-scalable"] === "no" || content["user-scalable"] === "0") {
      errors.push({
        id,
        element,
        text,
        url,
      });
    }
    if (Number.parseFloat(content["maximum-scale"]) < 5) {
      errors.push({
        id,
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
