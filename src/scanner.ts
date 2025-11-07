import { areaAlt } from "./rules/area-alt";
import { ariaAllowedAttr } from "./rules/aria-allowed-attr";
import ariaCommandName from "./rules/aria-command-name";
import { ariaHiddenBody } from "./rules/aria-hidden-body";
import ariaHiddenFocus from "./rules/aria-hidden-focus";
import ariaDialogName from "./rules/aria-dialog-name";
import ariaInputFieldName from "./rules/aria-input-field-name";
import ariaMeterName from "./rules/aria-meter-name";
import ariaProgressbarName from "./rules/aria-progressbar-name";
import ariaRequiredChildren from "./rules/aria-required-children";
import ariaRequiredParent from "./rules/aria-required-parent";
import ariaRoledescription from "./rules/aria-roledescription";
import ariaToggleFieldName from "./rules/aria-toggle-field-name";
import ariaTooltipName from "./rules/aria-tooltip-name";
import ariaValidAttr from "./rules/aria-valid-attr";
import { ariaValidAttrValue } from "./rules/aria-valid-attr-value";
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
import list from "./rules/list";
import dlitem from "./rules/dlitem";
import nestedInteractive from "./rules/nested-interactive";
import validLang from "./rules/valid-lang";
import htmlLangValid from "./rules/html-lang-valid";
import htmlXmlLangMismatch from "./rules/html-xml-lang-mismatch";
import colorContrast from "./rules/color-contrast";
import tdHasHeader from "./rules/td-has-header";
import thHasDataCells from "./rules/th-has-data-cells";
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
import frameTitleUnique from "./rules/frame-title-unique";
import noAutoplayAudio from "./rules/no-autoplay-audio";
import formFieldMultipleLabels from "./rules/form-field-multiple-labels";
import duplicateId from "./rules/duplicate-id";
import duplicateIdActive from "./rules/duplicate-id-active";
import duplicateIdAria from "./rules/duplicate-id-aria";
import cssOrientationLock from "./rules/css-orientation-lock";
import autocompleteValid from "./rules/autocomplete-valid";
import avoidInlineSpacing from "./rules/avoid-inline-spacing";
import svgImgAlt from "./rules/svg-img-alt";
import focusOrderSemantics from "./rules/focus-order-semantics";
import audioCaptions from "./rules/audio-caption";
import inputButtonName from "./rules/input-button-name";
import inputImageAlt from "./rules/input-image-alt";
import pAsHeading from "./rules/p-as-heading";
import roleImgAlt from "./rules/role-img-alt";
import scrollableRegionFocusable from "./rules/scrollable-region-focusable";
import serverSideImageMap from "./rules/server-side-image-map";
import targetSize from "./rules/target-size";
import objectAlt from "./rules/object-alt";

import { Logger } from "./logger";

export interface AccessibilityError {
  text: string;
  url: string;
  element: Element;
}

const logger = new Logger();

type Rule = (element: Element) => AccessibilityError[];

export const allRules: Rule[] = [
  accesskeys,
  areaAlt,
  ariaAllowedAttr,
  ariaCommandName,
  ariaDialogName,
  ariaHiddenBody,
  ariaHiddenFocus,
  ariaInputFieldName,
  ariaMeterName,
  ariaProgressbarName,
  ariaRequiredChildren,
  ariaRequiredParent,
  ariaRoledescription,
  ariaToggleFieldName,
  ariaTooltipName,
  ariaValidAttr,
  ariaValidAttrValue,
  audioCaptions,
  autocompleteValid,
  avoidInlineSpacing,
  colorContrast,
  tdHasHeader,
  thHasDataCells,
  tdHeadersAttr,
  labelContentNameMismatch,
  documentTitle,
  blink,
  buttonName,
  bypass,
  colorContrast,
  cssOrientationLock,
  definitionList,
  dlitem,
  documentTitle,
  duplicateId,
  duplicateIdActive,
  duplicateIdAria,
  formFieldMultipleLabels,
  frameFocusableContent,
  frameTitle,
  frameTitleUnique,
  htmlLangValid,
  htmlXmlLangMismatch,
  imageAlt,
  inputButtonName,
  inputImageAlt,
  label,
  labelContentNameMismatch,
  linkInTextBlock,
  linkName,
  list,
  listitem,
  marquee,
  metaRefresh,
  metaViewport,
  nestedInteractive,
  noAutoplayAudio,
  pAsHeading,
  roleImgAlt,
  scopeAttributeValid,
  scrollableRegionFocusable,
  selectName,
  serverSideImageMap,
  svgImgAlt,
  focusOrderSemantics,
  tableFakeCaption,
  targetSize,
  tdHasHeader,
  tdHeadersAttr,
  validLang,
  videoCaptions,
  objectAlt,
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
