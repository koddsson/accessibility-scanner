import {AccessibilityError} from '../scanner'
import {labelledByIsValid, validAriaAttributes, validAriaAttributesWithRole} from '../utils'

const id = 'aria-valid-attr'
const text = 'ARIA attributes must conform to valid names'
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`

// TODO: Maybe use https://github.com/A11yance/aria-query for this?

export default function(el: Element): AccessibilityError[] {
  const selector = '*'
  const errors = []
  const elements = el.querySelectorAll<HTMLElement>(selector)
  for (const element of [el, ...elements]) {
    for (const attribute of element.attributes) {
      if (attribute.name === 'aria-errormessage' && validAriaAttributesWithRole['aria-errormessage'].includes(element.getAttribute('role') || '')) {
        continue
      }
      if (attribute.name.startsWith('aria-') && !validAriaAttributes.includes(attribute.name)) {
        errors.push({
          element,
          text,
          url,
        })
      }
    }
  }
  return errors
}
