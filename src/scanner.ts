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
import listitem from "./rules/listitem";
import dlitem from "./rules/dlitem";
import nestedInteractive from "./rules/nested-interactive";
import validLang from "./rules/valid-lang";
import ariaRequiredChildren from "./rules/aria-required-children";
import colorContrast from "./rules/color-contrast";
import tdHasHeader from "./rules/td-has-header";
import labelContentNameMismatch from "./rules/label-content-name-mismatch";
import blink from "./rules/blink";
import bypass from "./rules/bypass";
import definitionList from "./rules/definition-list";
import linkInTextBlock from "./rules/link-in-text-block";

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
  listitem,
  dlitem,
  nestedInteractive,
  validLang,
  ariaRequiredChildren,
  colorContrast,
  tdHasHeader,
  labelContentNameMismatch,
  blink,
  bypass,
  definitionList,
  linkInTextBlock,
];

export async function requestIdleScan(
  element: Element,
  enabledRules: Rule[] = allRules,
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];

  return new Promise((resolve) => {
    requestIdleCallback(async function executeScan(deadline: IdleDeadline) {
      while (
        // eslint-disable-next-line tscompat/tscompat
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        enabledRules.length > 0
      ) {
        // eslint-disable-next-line tscompat/tscompat
        logger.log(deadline.timeRemaining(), deadline.didTimeout);
        const rule = enabledRules.shift()!;
        logger.log(`Executing ${rule.name}`);
        errors.push(...rule(element));
      }

      if (enabledRules.length > 0) {
        console.log(`exited with ${enabledRules.length} left`);
        requestIdleCallback(executeScan);
      } else {
        resolve(errors);
      }
    });
  });
}

export async function scan(
  element: Element,
  enabledRules: Rule[] = allRules,
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];
  for (const rule of enabledRules) {
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
