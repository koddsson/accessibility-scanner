import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ff89c9]ARIA required context role", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/1acc47f25d4931c25fe3efbb676af6fd4e2ee57e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<div id="host" role="list"></div>
	
	<script>
		const host = document.querySelector('#host')
		const root = host.attachShadow({ mode: 'open' })
		root.innerHTML = '<div role="listitem">List item 1</div> <div role="listitem">List item 2</div>'
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-parent"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
