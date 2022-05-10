export interface AccessibilityError {
  text: string
  url: string
  element: Element
}

import {activeAreaElementMustHaveAlternativeText} from './area-alt'

const rules = [
  activeAreaElementMustHaveAlternativeText
]

export async function scan(element: HTMLElement): Promise<void> {
  for (const rule of rules) {
    for (const error of rule(element)) {
      document.body.dispatchEvent(new CustomEvent(
        'accessbility-error', {detail: {error}}
      ))
    }
  }
}

