import {AccessibilityError} from '../scanner'

const text = 'aria-hidden="true" must not be present on the document <body>'
const url = 'https://dequeuniversity.com/rules/axe/4.4/aria-hidden-body?application=RuleDescription'

// Required attrs from here mapped to roles.
// https://github.com/dequelabs/axe-core/blob/develop/lib/standards/aria-roles.js
// rule definition: https://github.com/dequelabs/axe-core/blob/develop/lib/commons/aria/required-attr.js

export default function(el: HTMLElement): AccessibilityError[] {
  // TODO
  return []
}
