import { AccessibilityError } from "../scanner";
import { querySelector, querySelectorAll } from "../utils";

const id = "ye5d6e";
const url = `https://act-rules.github.io/rules/${id}`;
const text = "Document has an instrument to move focus to non-repeated content";

// TODO: The tests don't work yet because the document doesn't load correctly in the test harness.
export default function (el: Document | Element): AccessibilityError[] {
  const errors = [];
  const document = el instanceof Document ? el : el.ownerDocument;
  const links = querySelectorAll("a[href^='#']", document);

  let hasInstrument = false;

  // Loop over all the links and see if there's a instrucment to skip to the main content.
  // If there's a link
  for (const link of links) {
    const href = link.getAttribute("href")!;
    const target = querySelector(href, document);
    if (target?.parentElement?.isSameNode(document.body)) hasInstrument = true;
  }
  if (!hasInstrument) {
    errors.push({
      element: document.body,
      text,
      url,
    });
  }
  return errors;
}
