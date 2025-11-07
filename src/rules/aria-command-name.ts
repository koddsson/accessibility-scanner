import { AccessibilityError } from "../scanner";
import { querySelectorAll, hasAccessibleText } from "../utils";

const id = "aria-command-name";
const text = "ARIA button, link, and menuitem must have an accessible name";
const url = "https://dequeuniversity.com/rules/axe/4.4/aria-command-name";

/*
<div role="link" id="al" aria-label="Name"></div>

<div role="button" id="alb" aria-labelledby="labeldiv"></div>

<div role="menuitem" id="combo" aria-label="Aria Name">Name</div>

<div role="link" id="title" title="Title"></div>
*/

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll(
    '[role="link"], [role="button"], [role="menuitem"]',
    el,
  );

  if (el.matches('[role="link"], [role="button"], [role="menuitem"]')) {
    elements.push(el as HTMLAudioElement);
  }

  for (const element of elements) {
    if (hasAccessibleText(element)) continue;
    errors.push({ id, element, text, url });
  }
  return errors;
}
