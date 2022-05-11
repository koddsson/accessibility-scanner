export interface AccessibilityError {
  text: string
  url: string
  element: HTMLElement
}

import {areaAlt} from './rules/area-alt'
import {ariaAllowedAttr} from './rules/aria-allowed-attr'
import {ariaHiddenBody} from './rules/aria-hidden-body'
import ariaRequiredAttr from './rules/aria-required-attr'
import ariaRoles from './rules/aria-roles'

const rules = [
  areaAlt,
  ariaAllowedAttr,
  ariaHiddenBody,
  ariaRequiredAttr,
  ariaRoles
]

export async function scan(element: HTMLElement): Promise<void> {
  const errors: AccessibilityError[] = []
  for (const rule of rules) {
    errors.push(...rule(element))
  }

  document.dispatchEvent(new CustomEvent(
    'accessbility-error', {detail: {errors}}
  ))
}

