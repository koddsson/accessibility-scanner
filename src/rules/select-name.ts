import {AccessibilityError} from '../scanner'
import {labelledByIsValid} from '../utils'

const text = 'select element must have an accessible name'
const url = 'https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription'

function labelReadableText(label: HTMLElement): boolean {
  if (!label?.innerText?.trim()) return false
  const copiedNode = label.cloneNode(true) as HTMLElement

  for (const select of copiedNode.querySelectorAll('select')) {
    select.remove()
  }

  return copiedNode.innerText.trim() !== ''
}

export default function(el: Element): AccessibilityError[] {
  const errors = []
  const elements = Array.from(el.querySelectorAll<HTMLSelectElement>('select'))
  if (el.matches('select')) {
    elements.push(el as HTMLSelectElement)
  }
  for (const element of elements) {
    const labelId = element.getAttribute('id')
    const label = element.ownerDocument.querySelector<HTMLElement>(`[for="${labelId}"]`)
    if (label && labelReadableText(label)) continue

    const parentElement = element.parentElement
    if (parentElement instanceof HTMLLabelElement && labelReadableText(parentElement)) continue

    if (element.getAttribute("aria-label")) continue
    if (labelledByIsValid(element)) continue
    if (element.getAttribute("title")) continue
    if (element.disabled) continue

    errors.push({
      element,
      text,
      url
    })
  }
  return errors
}
