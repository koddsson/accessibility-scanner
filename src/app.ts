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
  document.body.addEventListener('accessbility-error', error => {
    console.log(error.element)
    console.log(error)
  })

  await scan(document.body)
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
