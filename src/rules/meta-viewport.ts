const id = "meta-viewport";
const text = "Zooming and scaling must not be disabled";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function parseContent(content: string): Record<string, string> {
  const object: Record<string, string> = {};
  for (const pair of content.split(",")) {
    const [key, value] = pair.split("=");
    object[key.trim().toLowerCase()] = value.trim().toLowerCase();
  }
  return object;
}

export default function metaViewport(element: Element) {
  const errors = [];

  // TODO: Do the same for all the other rules
  const selector = "meta[name=viewport]";
  // meta[name=viewport] is in <head>, so search the full document if available
  const doc = element.ownerDocument;
  const searchRoot = doc ?? element;
  const elements = [...searchRoot.querySelectorAll<HTMLMetaElement>(selector)];
  if (!doc && element.matches(selector)) elements.push(element as HTMLMetaElement);
  for (const element of elements) {
    const content = parseContent(element.content);
    // "yes" is the only value that clearly enables scaling.
    // "no", "0", numeric values < 1 (e.g. "0.5"), and invalid values
    // all potentially disable zooming.
    const userScalable = content["user-scalable"];
    if (
      userScalable !== undefined &&
      userScalable !== "yes" &&
      userScalable !== "1"
    ) {
      const num = Number.parseFloat(userScalable);
      if (Number.isNaN(num) || num < 1) {
        errors.push({
          id,
          element,
          text,
          url,
        });
      }
    }
    const maxScale = content["maximum-scale"];
    if (maxScale !== undefined) {
      const maxScaleNum = Number.parseFloat(maxScale);
      // Only flag valid positive numeric values that are less than 2.
      // Non-numeric values (NaN) and negative values don't restrict zooming.
      if (!Number.isNaN(maxScaleNum) && maxScaleNum >= 0 && maxScaleNum < 2) {
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
