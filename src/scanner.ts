export interface AccessibilityError {
  text: string;
  url: string;
  element: Element;
}

import { areaAlt } from "./rules/area-alt";
//import {ariaAllowedAttr} from './rules/aria-allowed-attr'
import { ariaHiddenBody } from "./rules/aria-hidden-body";
import ariaRequiredAttr from "./rules/aria-required-attr";
//import ariaRoles from './rules/aria-roles'
import metaViewport from "./rules/meta-viewport";
import scopeAttrValid from "./rules/scope-attr-valid";
import videoCaptions from "./rules/video-caption";
import selectName from "./rules/select-name";
import metaRefresh from "./rules/meta-refresh";
import imageAlt from "./rules/image-alt";
import buttonName from "./rules/button-name";
import label from "./rules/label";

import {Logger} from './logger'

const logger = new Logger()

type Rule = (el: Element) => AccessibilityError[];

export const allRules: Rule[] = [
  areaAlt,
  //ariaAllowedAttr,
  ariaHiddenBody,
  ariaRequiredAttr,
  //ariaRoles,
  metaViewport,
  scopeAttrValid,
  videoCaptions,
  selectName,
  metaRefresh,
  imageAlt,
  buttonName,
  label,
];

export async function requestIdleScan(
  element: Element,
  enabledRules: Rule[]
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];
  const rules = enabledRules || allRules;

  return new Promise((resolve) => {
    requestIdleCallback(async function executeScan(deadline: IdleDeadline) {
      while (
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        rules.length
      ) {
        logger.log(deadline.timeRemaining(), deadline.didTimeout)
        const rule = rules.shift()!;
        logger.log(`Executing ${rule.name}`)
        errors.push(...rule(element));
      }

      if (rules.length) {
        console.log(`exited with ${allRules.length} left`)
        requestIdleCallback(executeScan);
      } else {
        resolve(errors);
      }
    });
  });
}

export async function scan(
  element: Element,
  enabledRules?: Rule[]
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
      this.enabledRules ?? allRules
    );
  }
}
