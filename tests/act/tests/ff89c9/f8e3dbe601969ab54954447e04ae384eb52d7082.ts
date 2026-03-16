import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ff89c9]ARIA required context role", function () {
  it.skip("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/f8e3dbe601969ab54954447e04ae384eb52d7082.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<div role="list" aria-owns="item1 item2"></div>
	
	<div id="host"></div>
	
	<script>
		const host = document.querySelector('#host')
		const root = host.attachShadow({ mode: 'open' })
		root.innerHTML = '<div id="item1" role="listitem">List item 1</div> <div id="item2" role="listitem">List item 2</div>'
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-parent"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
