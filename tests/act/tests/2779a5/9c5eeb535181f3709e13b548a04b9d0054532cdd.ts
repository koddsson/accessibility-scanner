import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/9c5eeb535181f3709e13b548a04b9d0054532cdd.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<body>
		<template id="shadow-element">
			<title>This is the page title</title>
		</template>
		<script>
			const host = document.querySelector('body')
			const shadow = host.attachShadow({ mode: 'open' })
			const template = document.getElementById('shadow-element')

			shadow.appendChild(template.content)
		</script>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
