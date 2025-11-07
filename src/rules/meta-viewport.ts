const id = "meta-viewport";
const text = "Zooming and scaling must not be disabled";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/meta-viewport?application=RuleDescription";

function parseContent(content: string): Record<string, string> {
  const object: Record<string, string> = {};
  for (const pair of content.split(",")) {
    const [key, value] = pair.split("=");
    object[key.toLowerCase()] = value.toLowerCase();
  }
  return object;
}

export default function metaViewport(element: Element) {
  const errors = [];

  // TODO: Do the same for all the other rules
  const selector = "meta[name=viewport]";
  const elements = [...element.querySelectorAll<HTMLMetaElement>(selector)];
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
    if (Number.parseFloat(content["maximum-scale"]) < 2) {
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
