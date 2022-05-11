import {AccessibilityError} from '../scanner'

const text = 'aria-hidden="true" must not be present on the document <body>'
const url = 'https://dequeuniversity.com/rules/axe/4.4/aria-hidden-body?application=RuleDescription'

export function ariaHiddenBody(el: HTMLElement): AccessibilityError[] {
  const element = el.ownerDocument.body
  if (element.getAttribute('aria-hidden') === 'true') {
    return [{
      element,
      text,
      url,
    }]
  }
  return []
}
