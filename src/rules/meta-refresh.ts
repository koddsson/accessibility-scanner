import {AccessibilityError} from '../scanner'

const text = 'Timed refresh must not exist'
const url = 'https://dequeuniversity.com/rules/axe/4.4/meta-refresh?application=RuleDescription'

export default function(el: Element): AccessibilityError[] {
  const errors = []
  const elements = Array.from(el.querySelectorAll<HTMLMetaElement>('meta'))
  if (el.matches('meta')) {
    elements.push(el as HTMLMetaElement)
  }
  for (const element of elements) {
    if (element.httpEquiv === 'refresh') {
      errors.push({
        element,
        text,
        url,
      })
    }
  }
  return errors
}
