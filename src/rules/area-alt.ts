import {AccessibilityError} from '../scanner'

const text = 'Elements must only use allowed ARIA attributes'
const url = 'https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription'

function labelledbyIsValid(el: Element): boolean {
  const id = el.getAttribute('aria-labelledby')
  if (!id) return false
  const otherElement = el.ownerDocument.getElementById(id)
  if (!otherElement) return false

  return otherElement.textContent != ''
}

export function areaAlt(el: Element): AccessibilityError[] {
  const errors = []
  for (const element of el.querySelectorAll<HTMLElement>('map area[href]')) {
    if (element.getAttribute('alt')) continue
    if (element.getAttribute('aria-label')) continue
    if (labelledbyIsValid(element)) continue
    errors.push({
      element,
      text,
      url,
    })   
  }
  return errors
}
