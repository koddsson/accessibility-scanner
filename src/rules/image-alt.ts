import {AccessibilityError} from '../scanner'
import {labelledByIsValid} from '../utils'

const text = 'Images must have alternate text'
const url = 'https://dequeuniversity.com/rules/axe/4.4/image-alt?application=RuleDescription'

export default function(el: Element): AccessibilityError[] {
  const errors = []
  const elements = Array.from(el.querySelectorAll<HTMLImageElement>('img'))
  if (el.matches('img')) {
    elements.push(el as HTMLImageElement)
  }
  for (const element of elements) {
    if (element.hasAttribute('alt') && element.alt === element.alt.trim()) continue
    if (element.ariaLabel?.trim()) continue
    if (labelledByIsValid(element)) continue
    if (element.title) continue

    const role = element.getAttribute('role')
    const hasValidRole = (role === 'presentation' || role === 'none')
    if (hasValidRole && element.tabIndex !== 0 && !element.ariaLive) continue

    errors.push({
      element,
      text,
      url,
    })
  }
  return errors
}
