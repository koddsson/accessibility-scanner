import {AccessibilityError} from '../scanner'

const text = 'Elements must only use allowed ARIA attributes'
const url = 'https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription'

export function areaAlt(el: HTMLElement): AccessibilityError[] {
  const errors = []
  for (const element of el.querySelectorAll<HTMLElement>('map area:not([alt])')) {
    errors.push({
      element,
      text,
      url,
    })   
  }
  return errors
}
