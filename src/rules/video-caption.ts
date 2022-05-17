import {AccessibilityError} from '../scanner'

const text = '<video> elements must have a <track> for captions'
const url = 'https://dequeuniversity.com/rules/axe/4.4/video-caption?application=RuleDescription'

export default function(el: Element): AccessibilityError[] {
  const errors = []
  for (const element of el.querySelectorAll<HTMLElement>('video')) {
    const tracks = element.querySelectorAll('track')
    if (tracks.length === 0) {
      errors.push({
        element,
        text,
        url,
      })
      return
    }

    for (const track of tracks) {
      if (tracks.getAttribute('kind') !== 'captions') {
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
