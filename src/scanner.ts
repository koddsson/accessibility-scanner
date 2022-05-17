export interface AccessibilityError {
  text: string
  url: string
  element: Element
}

import {areaAlt} from './rules/area-alt'
import {ariaAllowedAttr} from './rules/aria-allowed-attr'
import {ariaHiddenBody} from './rules/aria-hidden-body'
import ariaRequiredAttr from './rules/aria-required-attr'
import ariaRoles from './rules/aria-roles'
import metaViewport from './rules/meta-viewport'
import scopeAttrValid from './rules/scope-attr-valid'
import videoCaptions from './rules/video-caption'

type Rule = (el: Element) => AccessibilityError[]

const rules: Rule[]  = [
  areaAlt,
  ariaAllowedAttr,
  ariaHiddenBody,
  ariaRequiredAttr,
  ariaRoles,
  metaViewport,
  scopeAttrValid,
  videoCaptions
]

export async function scan(element: Element): Promise<AccessibilityError[]> {
  const errors: AccessibilityError[] = []
  for (const rule of rules) {
    errors.push(...rule(element))
  }

  return errors
}

