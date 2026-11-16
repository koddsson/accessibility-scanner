import { areaAlt } from "./rules/area-alt.js";
import { ariaAllowedAttr } from "./rules/aria-allowed-attr.js";
import ariaAllowedRole from "./rules/aria-allowed-role.js";
import ariaCommandName from "./rules/aria-command-name.js";
import { ariaHiddenBody } from "./rules/aria-hidden-body.js";
import ariaHiddenFocus from "./rules/aria-hidden-focus.js";
import ariaDialogName from "./rules/aria-dialog-name.js";
import ariaInputFieldName from "./rules/aria-input-field-name.js";
import ariaMeterName from "./rules/aria-meter-name.js";
import ariaProgressbarName from "./rules/aria-progressbar-name.js";
import { ariaRequiredAttr } from "./rules/aria-required-attr.js";
import ariaRequiredChildren from "./rules/aria-required-children.js";
import ariaText from "./rules/aria-text.js";
import ariaRequiredParent from "./rules/aria-required-parent.js";
import ariaRoles from "./rules/aria-roles.js";
import ariaRoledescription from "./rules/aria-roledescription.js";
import ariaToggleFieldName from "./rules/aria-toggle-field-name.js";
import ariaTooltipName from "./rules/aria-tooltip-name.js";
import ariaTreeitemName from "./rules/aria-treeitem-name.js";
import ariaValidAttr from "./rules/aria-valid-attr.js";
import { ariaValidAttrValue } from "./rules/aria-valid-attr-value.js";
import metaViewport from "./rules/meta-viewport.js";
import metaViewportLarge from "./rules/meta-viewport-large.js";
import scopeAttributeValid from "./rules/scope-attr-valid.js";
import videoCaptions from "./rules/video-caption.js";
import selectName from "./rules/select-name.js";
import metaRefresh from "./rules/meta-refresh.js";
import metaRefreshNoExceptions from "./rules/meta-refresh-no-exceptions.js";
import marquee from "./rules/marquee.js";
import identicalLinksSamePurpose from "./rules/identical-links-same-purpose.js";
import imageAlt from "./rules/image-alt.js";
import imageRedundantAlt from "./rules/image-redundant-alt.js";
import buttonName from "./rules/button-name.js";
import label from "./rules/label.js";
import labelTitleOnly from "./rules/label-title-only.js";
import linkName from "./rules/link-name.js";
import listitem from "./rules/listitem.js";
import list from "./rules/list.js";
import dlitem from "./rules/dlitem.js";
import nestedInteractive from "./rules/nested-interactive.js";
import validLang from "./rules/valid-lang.js";
import htmlHasLang from "./rules/html-has-lang.js";
import htmlLangValid from "./rules/html-lang-valid.js";
import colorContrast from "./rules/color-contrast.js";
import decorativeImage from "./rules/decorative-image.js";
import colorContrastEnhanced from "./rules/color-contrast-enhanced.js";
import tdHasHeader from "./rules/td-has-header.js";
import thHasDataCells from "./rules/th-has-data-cells.js";
import tdHeadersAttr from "./rules/td-headers-attr.js";
import labelContentNameMismatch from "./rules/label-content-name-mismatch.js";
import documentTitle from "./rules/document-title.js";
import blink from "./rules/blink.js";
import bypass from "./rules/bypass.js";
import definitionList from "./rules/definition-list.js";
import linkInTextBlock from "./rules/link-in-text-block.js";
import accesskeys from "./rules/accesskeys.js";
import tableDuplicateName from "./rules/table-duplicate-name.js";
import tableFakeCaption from "./rules/table-fake-caption.js";
import frameFocusableContent from "./rules/frame-focusable-content.js";
import frameTested from "./rules/frame-tested.js";
import headingOrder from "./rules/heading-order.js";
import frameTitle from "./rules/frame-title.js";
import frameTitleUnique from "./rules/frame-title-unique.js";
import noAutoplayAudio from "./rules/no-autoplay-audio.js";
import formFieldMultipleLabels from "./rules/form-field-multiple-labels.js";
import duplicateId from "./rules/duplicate-id.js";
import duplicateIdActive from "./rules/duplicate-id-active.js";
import duplicateIdAria from "./rules/duplicate-id-aria.js";
import emptyHeading from "./rules/empty-heading.js";
import emptyTableHeader from "./rules/empty-table-header.js";
import cssOrientationLock from "./rules/css-orientation-lock.js";
import autocompleteValid from "./rules/autocomplete-valid.js";
import avoidInlineSpacing from "./rules/avoid-inline-spacing.js";
import summaryName from "./rules/summary-name.js";
import svgImgAlt from "./rules/svg-img-alt.js";
import focusOrderSemantics from "./rules/focus-order-semantics.js";
import audioCaptions from "./rules/audio-caption.js";
import inputButtonName from "./rules/input-button-name.js";
import inputImageAlt from "./rules/input-image-alt.js";
import pAsHeading from "./rules/p-as-heading.js";
import roleImgAlt from "./rules/role-img-alt.js";
import scrollableRegionFocusable from "./rules/scrollable-region-focusable.js";
import serverSideImageMap from "./rules/server-side-image-map.js";
import targetSize from "./rules/target-size.js";
import landmarkComplementaryIsTopLevel from "./rules/landmark-complementary-is-top-level.js";
import objectAlt from "./rules/object-alt.js";
import presentationRoleConflict from "./rules/presentation-role-conflict.js";
import skipLink from "./rules/skip-link.js";
import tabindex from "./rules/tabindex.js";
import pageHasHeadingOne from "./rules/page-has-heading-one.js";
import landmarkNoDuplicateBanner from "./rules/landmark-no-duplicate-banner.js";
import landmarkOneMain from "./rules/landmark-one-main.js";
import landmarkBannerIsTopLevel from "./rules/landmark-banner-is-top-level.js";
import landmarkUnique from "./rules/landmark-unique.js";
import landmarkContentinfoIsTopLevel from "./rules/landmark-contentinfo-is-top-level.js";
import landmarkNoDuplicateContentinfo from "./rules/landmark-no-duplicate-contentinfo.js";
import landmarkNoDuplicateMain from "./rules/landmark-no-duplicate-main.js";
import landmarkMainIsTopLevel from "./rules/landmark-main-is-top-level.js";
import region from "./rules/region.js";
import { isVisible } from "./utils.js";

export interface AccessibilityError {
  id: string;
  text: string;
  url: string;
  element: Element;
  /** The scanner could not decide on its own; a human should verify. */
  needsReview?: boolean;
}

export type LogFn = (...data: unknown[]) => void;

export type Rule = ((element: Element) => AccessibilityError[]) & {
  /**
   * Findings on content that is not rendered (display: none, [hidden], a
   * closed dialog) are dropped by default, since such content is not in the
   * accessibility tree. Rules whose findings hold regardless, such as
   * duplicate ids or head metadata, set this to true.
   */
  includeHidden?: boolean;
  /**
   * Content inside `aria-hidden="true"` is not in the accessibility tree, so
   * findings on it are dropped by default. Rules about rendered appearance or
   * about aria-hidden itself, such as colour contrast, set this to true.
   */
  includeAriaHidden?: boolean;
};

function runRule(rule: Rule, element: Element): AccessibilityError[] {
  const errors = rule(element);
  if (rule.includeHidden) return errors;
  return errors.filter(
    (error) =>
      isVisible(error.element) &&
      (rule.includeAriaHidden ||
        !error.element.closest('[aria-hidden="true"]')),
  );
}

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
  decorativeImage,
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
  htmlHasLang,
  htmlLangValid,
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
  summaryName,
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
  log?: LogFn,
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
        log?.(deadline.timeRemaining(), deadline.didTimeout);
        const rule = rulesToProcess.shift()!;
        log?.(`Executing ${rule.name}`);
        errors.push(...runRule(rule, element));
      }

      if (rulesToProcess.length > 0) {
        log?.(`exited with ${rulesToProcess.length} left`);
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
    errors.push(...runRule(rule, element));
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
