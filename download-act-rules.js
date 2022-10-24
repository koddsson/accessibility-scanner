import {readFile, writeFile} from 'node:fs/promises'

const json = await readFile('./testcases.json', 'utf8')
const {testcases} = JSON.parse(json)

for (const testcase of testcases) {
  const id = testcase.testcaseId
  console.log(id)
  const response = await fetch(testcase.url)
  const html = await response.text()
  if (response.status === 200) {
    console.log('OK')
    await writeFile(`./tests/act/fixtures/${id}.html`, html)
  } else {
    console.log(html)
    break;
  }
}
