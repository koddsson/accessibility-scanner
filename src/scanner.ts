import { areaAlt } from "./rules/area-alt";
import { ariaHiddenBody } from "./rules/aria-hidden-body";
import metaViewport from "./rules/meta-viewport";
import scopeAttributeValid from "./rules/scope-attr-valid";
import videoCaptions from "./rules/video-caption";
import selectName from "./rules/select-name";
import metaRefresh from "./rules/meta-refresh";
import imageAlt from "./rules/image-alt";
import buttonName from "./rules/button-name";
import label from "./rules/label";
import linkName from "./rules/link-name";
import nestedInteractive from "./rules/nested-interactive";
import validLang from "./rules/valid-lang";

import { Logger } from "./logger";

export interface AccessibilityError {
  text: string;
  url: string;
  element: Element;
}

const logger = new Logger();

type Rule = (element: Element) => AccessibilityError[];

export const allRules: Rule[] = [
  areaAlt,
  ariaHiddenBody,
  metaViewport,
  scopeAttributeValid,
  videoCaptions,
  selectName,
  metaRefresh,
  imageAlt,
  buttonName,
  label,
  linkName,
  nestedInteractive,
  validLang,
];

export async function requestIdleScan(
  element: Element,
  enabledRules: Rule[],
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];
  const rules = enabledRules || allRules;

  return new Promise((resolve) => {
    requestIdleCallback(async function executeScan(deadline: IdleDeadline) {
      while (
        // eslint-disable-next-line tscompat/tscompat
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        rules.length > 0
      ) {
        // eslint-disable-next-line tscompat/tscompat
        logger.log(deadline.timeRemaining(), deadline.didTimeout);
        const rule = rules.shift()!;
        logger.log(`Executing ${rule.name}`);
        errors.push(...rule(element));
      }

      if (rules.length > 0) {
        console.log(`exited with ${allRules.length} left`);
        requestIdleCallback(executeScan);
      } else {
        resolve(errors);
      }
    });
  });
}

export async function scan(
  element: Element,
  enabledRules?: Rule[],
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];
  const rules = enabledRules || allRules;
  for (const rule of rules) {
    errors.push(...rule(element));
  }

  return errors;
}

export class Scanner {
  constructor(public enabledRules?: Rule[]) {}

  async scan(element?: Element): Promise<AccessibilityError[]> {
    return scan(
      element ?? document.documentElement,
      this.enabledRules ?? allRules,
    );
  }
}
