import {scan} from './scanner'
import type {AccessibilityError} from './scanner'

async function ready(): Promise<void> {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    return Promise.resolve()
  } else {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', () => resolve())
    })
  }
}

(async function() {
  await ready()
  document.addEventListener('accessbility-error', error => {
    for (const accessbilityError of error.detail.errors) {
      accessbilityError.element.setAttribute('style', 'border: 5px solid red;')
      console.log(accessbilityError.text, accessbilityError.element, accessbilityError.url)
    }
  })

  const startTime = performance.now()
  await scan(document.body)
  const endTime = performance.now()
  console.log(`Took ${(endTime - startTime).toPrecision(2)}ms to execute accessbility scans`)
})()

interface CustomEventMap {
  'accessbility-error': AccessbilityErrorEvent
}

declare global {
  type AccessbilityErrorEvent = CustomEvent<{errors: AccessibilityError[]}>

  interface Document {
    //adds definition to Document, but you can do the same with HTMLElement
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void
  }
}
