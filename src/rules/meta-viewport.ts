const text = "Zooming and scaling must not be disabled";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/meta-viewport?application=RuleDescription";

function parseContent(content: string): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const pair of content.split(",")) {
    const [key, value] = pair.split("=");
    obj[key.toLowerCase()] = value.toLowerCase();
  }
  return obj;
}

export default function metaViewport(el: Document | Element) {
  const errors = [];

  // TODO: Do the same for all the other rules
  const selector = "meta[name=viewport]";
  const elements = Array.from(el.querySelectorAll<HTMLMetaElement>(selector));
  if (el instanceof Element && el.matches(selector))
    elements.push(el as HTMLMetaElement);
  for (const element of elements) {
    const content = parseContent(element.content);
    if (content["user-scalable"] === "no" || content["user-scalable"] === "0") {
      errors.push({
        element,
        text,
        url,
      });
    }
    if (parseFloat(content["maximum-scale"]) < 2) {
      errors.push({
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
