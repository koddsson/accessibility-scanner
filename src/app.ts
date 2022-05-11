import {scan} from './scanner'

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

  const startTime = performance.now()
  const errors = await scan(document.body)
  const endTime = performance.now()
  
  for (const accessbilityError of errors) {
    accessbilityError.element.setAttribute('style', 'border: 5px solid red;')
    console.log(accessbilityError.text, accessbilityError.element, accessbilityError.url)
  }
  console.log(`Took ${(endTime - startTime).toPrecision(2)}ms to execute accessbility scans`)
})()
