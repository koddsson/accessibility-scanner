import {AccessibilityError} from '../scanner'
import {labelledByIsValid} from '../utils'

const text = 'Image buttons must have alternate text'
const url = 'https://dequeuniversity.com/rules/axe/4.4/input-image-alt?application=RuleDescription'

export default function(el: Element): AccessibilityError[] {
  const selector = 'input[type=image]'
  const errors = []
  const elements = Array.from(el.querySelectorAll<HTMLImageElement>(selector))
  if (el.matches(selector)) {
    elements.push(el as HTMLImageElement)
  }
  for (const element of elements) {
    if (element.hasAttribute('alt') && element.alt === element.alt.trim()) continue
    const label = element.getAttribute('aria-label')
    if (label && label.trim() !== '') continue
    if (labelledByIsValid(element)) continue
    if (element.title) continue

    errors.push({
      element,
      text,
      url,
    })
  }
  return errors
}
