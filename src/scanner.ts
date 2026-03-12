import { areaAlt } from "./rules/area-alt";
import { ariaAllowedAttr } from "./rules/aria-allowed-attr";
import ariaAllowedRole from "./rules/aria-allowed-role";
import ariaCommandName from "./rules/aria-command-name";
import { ariaHiddenBody } from "./rules/aria-hidden-body";
import ariaHiddenFocus from "./rules/aria-hidden-focus";
import ariaDialogName from "./rules/aria-dialog-name";
import ariaInputFieldName from "./rules/aria-input-field-name";
import ariaMeterName from "./rules/aria-meter-name";
import ariaProgressbarName from "./rules/aria-progressbar-name";
import { ariaRequiredAttr } from "./rules/aria-required-attr";
import ariaRequiredChildren from "./rules/aria-required-children";
import ariaText from "./rules/aria-text";
import ariaRequiredParent from "./rules/aria-required-parent";
import ariaRoles from "./rules/aria-roles";
import ariaRoledescription from "./rules/aria-roledescription";
import ariaToggleFieldName from "./rules/aria-toggle-field-name";
import ariaTooltipName from "./rules/aria-tooltip-name";
import ariaTreeitemName from "./rules/aria-treeitem-name";
import ariaValidAttr from "./rules/aria-valid-attr";
import { ariaValidAttrValue } from "./rules/aria-valid-attr-value";
import metaViewport from "./rules/meta-viewport";
import metaViewportLarge from "./rules/meta-viewport-large";
import scopeAttributeValid from "./rules/scope-attr-valid";
import videoCaptions from "./rules/video-caption";
import selectName from "./rules/select-name";
import metaRefresh from "./rules/meta-refresh";
import metaRefreshNoExceptions from "./rules/meta-refresh-no-exceptions";
import marquee from "./rules/marquee";
import identicalLinksSamePurpose from "./rules/identical-links-same-purpose";
import imageAlt from "./rules/image-alt";
import imageRedundantAlt from "./rules/image-redundant-alt";
import buttonName from "./rules/button-name";
import label from "./rules/label";
import labelTitleOnly from "./rules/label-title-only";
import linkName from "./rules/link-name";
import listitem from "./rules/listitem";
import list from "./rules/list";
import dlitem from "./rules/dlitem";
import nestedInteractive from "./rules/nested-interactive";
import validLang from "./rules/valid-lang";
import htmlLangValid from "./rules/html-lang-valid";
import htmlXmlLangMismatch from "./rules/html-xml-lang-mismatch";
import colorContrast from "./rules/color-contrast";
import colorContrastEnhanced from "./rules/color-contrast-enhanced";
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
import tableDuplicateName from "./rules/table-duplicate-name";
import tableFakeCaption from "./rules/table-fake-caption";
import frameFocusableContent from "./rules/frame-focusable-content";
import frameTested from "./rules/frame-tested";
import headingOrder from "./rules/heading-order";
import frameTitle from "./rules/frame-title";
import frameTitleUnique from "./rules/frame-title-unique";
import noAutoplayAudio from "./rules/no-autoplay-audio";
import formFieldMultipleLabels from "./rules/form-field-multiple-labels";
import duplicateId from "./rules/duplicate-id";
import duplicateIdActive from "./rules/duplicate-id-active";
import duplicateIdAria from "./rules/duplicate-id-aria";
import emptyHeading from "./rules/empty-heading";
import emptyTableHeader from "./rules/empty-table-header";
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
import landmarkComplementaryIsTopLevel from "./rules/landmark-complementary-is-top-level";
import objectAlt from "./rules/object-alt";
import presentationRoleConflict from "./rules/presentation-role-conflict";
import skipLink from "./rules/skip-link";
import tabindex from "./rules/tabindex";
import pageHasHeadingOne from "./rules/page-has-heading-one";
import landmarkNoDuplicateBanner from "./rules/landmark-no-duplicate-banner";
import landmarkOneMain from "./rules/landmark-one-main";
import landmarkBannerIsTopLevel from "./rules/landmark-banner-is-top-level";
import landmarkUnique from "./rules/landmark-unique";
import landmarkContentinfoIsTopLevel from "./rules/landmark-contentinfo-is-top-level";
import landmarkNoDuplicateContentinfo from "./rules/landmark-no-duplicate-contentinfo";
import landmarkNoDuplicateMain from "./rules/landmark-no-duplicate-main";
import landmarkMainIsTopLevel from "./rules/landmark-main-is-top-level";
import region from "./rules/region";

import { Logger } from "./logger";

export interface AccessibilityError {
  id: string;
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
  ariaAllowedRole,
  ariaCommandName,
  ariaDialogName,
  ariaHiddenBody,
  ariaHiddenFocus,
  ariaInputFieldName,
  ariaMeterName,
  ariaProgressbarName,
  ariaRequiredAttr,
  ariaRequiredChildren,
  ariaRequiredParent,
  ariaRoles,
  ariaRoledescription,
  ariaText,
  ariaToggleFieldName,
  ariaTooltipName,
  ariaTreeitemName,
  ariaValidAttr,
  ariaValidAttrValue,
  audioCaptions,
  autocompleteValid,
  avoidInlineSpacing,
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
  emptyHeading,
  emptyTableHeader,
  focusOrderSemantics,
  formFieldMultipleLabels,
  frameFocusableContent,
  frameTested,
  frameTitle,
  frameTitleUnique,
  headingOrder,
  htmlLangValid,
  htmlXmlLangMismatch,
  identicalLinksSamePurpose,
  imageAlt,
  imageRedundantAlt,
  inputButtonName,
  inputImageAlt,
  label,
  labelContentNameMismatch,
  labelTitleOnly,
  landmarkBannerIsTopLevel,
  landmarkComplementaryIsTopLevel,
  landmarkContentinfoIsTopLevel,
  landmarkMainIsTopLevel,
  landmarkNoDuplicateBanner,
  landmarkNoDuplicateContentinfo,
  landmarkNoDuplicateMain,
  landmarkOneMain,
  landmarkUnique,
  linkInTextBlock,
  linkName,
  list,
  listitem,
  marquee,
  metaRefresh,
  metaRefreshNoExceptions,
  metaViewport,
  metaViewportLarge,
  nestedInteractive,
  noAutoplayAudio,
  objectAlt,
  pAsHeading,
  pageHasHeadingOne,
  presentationRoleConflict,
  roleImgAlt,
  scopeAttributeValid,
  scrollableRegionFocusable,
  selectName,
  serverSideImageMap,
  skipLink,
  svgImgAlt,
  tabindex,
  tableDuplicateName,
  tableFakeCaption,
  targetSize,
  tdHasHeader,
  tdHeadersAttr,
  thHasDataCells,
  validLang,
  videoCaptions,
];

export async function requestIdleScan(
  element: Element,
  enabledRules: Rule[] = allRules,
): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = [];
  const rulesToProcess = [...enabledRules];

  return new Promise((resolve) => {
    requestIdleCallback(async function executeScan(deadline: IdleDeadline) {
      while (
        // eslint-disable-next-line tscompat/tscompat
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        rulesToProcess.length > 0
      ) {
        // eslint-disable-next-line tscompat/tscompat
        logger.log(deadline.timeRemaining(), deadline.didTimeout);
        const rule = rulesToProcess.shift()!;
        logger.log(`Executing ${rule.name}`);
        errors.push(...rule(element));
      }

      if (rulesToProcess.length > 0) {
        console.log(`exited with ${rulesToProcess.length} left`);
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
