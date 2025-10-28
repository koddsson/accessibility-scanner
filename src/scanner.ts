import { areaAlt } from "./rules/area-alt";
import { ariaHiddenBody } from "./rules/aria-hidden-body";
import ariaDialogName from "./rules/aria-dialog-name";
import metaViewport from "./rules/meta-viewport";
import scopeAttributeValid from "./rules/scope-attr-valid";
import videoCaptions from "./rules/video-caption";
import selectName from "./rules/select-name";
import metaRefresh from "./rules/meta-refresh";
import marquee from "./rules/marquee";
import imageAlt from "./rules/image-alt";
import buttonName from "./rules/button-name";
import label from "./rules/label";
import linkName from "./rules/link-name";
import listitem from "./rules/listitem";
import dlitem from "./rules/dlitem";
import nestedInteractive from "./rules/nested-interactive";
import validLang from "./rules/valid-lang";
import htmlLangValid from "./rules/html-lang-valid";
import htmlXmlLangMismatch from "./rules/html-xml-lang-mismatch";
import ariaRequiredChildren from "./rules/aria-required-children";
import colorContrast from "./rules/color-contrast";
import tdHasHeader from "./rules/td-has-header";
import tdHeadersAttr from "./rules/td-headers-attr";
import labelContentNameMismatch from "./rules/label-content-name-mismatch";
import documentTitle from "./rules/document-title";
import blink from "./rules/blink";
import bypass from "./rules/bypass";
import definitionList from "./rules/definition-list";
import linkInTextBlock from "./rules/link-in-text-block";
import accesskeys from "./rules/accesskeys";
import tableFakeCaption from "./rules/table-fake-caption";
import frameFocusableContent from "./rules/frame-focusable-content";
import frameTitle from "./rules/frame-title";
import ariaRoledescription from "./rules/aria-roledescription";
import frameTitleUnique from "./rules/frame-title-unique";
import noAutoplayAudio from "./rules/no-autoplay-audio";
import formFieldMultipleLabels from "./rules/form-field-multiple-labels";
import duplicateId from "./rules/duplicate-id";
import cssOrientationLock from "./rules/css-orientation-lock";
import hiddenContent from "./rules/hidden-content";
import autocompleteValid from "./rules/autocomplete-valid";
import svgImgAlt from "./rules/svg-img-alt";

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
  ariaDialogName,
  ariaHiddenBody,
  metaViewport,
  scopeAttributeValid,
  videoCaptions,
  selectName,
  metaRefresh,
  marquee,
  imageAlt,
  buttonName,
  label,
  linkName,
  listitem,
  dlitem,
  nestedInteractive,
  validLang,
  htmlLangValid,
  htmlXmlLangMismatch,
  ariaRequiredChildren,
  colorContrast,
  tdHasHeader,
  tdHeadersAttr,
  labelContentNameMismatch,
  documentTitle,
  blink,
  bypass,
  definitionList,
  linkInTextBlock,
  accesskeys,
  tableFakeCaption,
  frameFocusableContent,
  frameTitle,
  ariaRoledescription,
  frameTitleUnique,
  noAutoplayAudio,
  formFieldMultipleLabels,
  duplicateId,
  cssOrientationLock,
  hiddenContent,
  autocompleteValid,
  svgImgAlt,
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
