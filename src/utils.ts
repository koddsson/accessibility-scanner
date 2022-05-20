/**
  * Given a element, make sure that it's `aria-labelledby` has a value and it's
  * value maps to a element in the DOM that has valid text 
  **/
export function labelledByIsValid(el: Element): boolean {
  const id = el.getAttribute('aria-labelledby')
  if (!id) return false
  const otherElement = document.querySelector<HTMLElement>(`#${id}`)
  if (!otherElement) return false

  return otherElement.innerText.trim() != ''
}

/**
  * TODO
**/
export function labelReadableText(label: HTMLElement): boolean {
  if (!label?.innerText?.trim()) return false
  
  const isVisible = !!(label.offsetWidth || label.offsetHeight || label.getClientRects().length)
  if (!isVisible) return false

  const copiedNode = label.cloneNode(true) as HTMLElement
  for (const select of copiedNode.querySelectorAll('select')) {
    select.remove()
  }

  return copiedNode.innerText.trim() !== ''
}
