import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it.skip("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/5e0e88f9ed776c89735d7db606c1381a7a1fb877.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 6</title>
</head>
<body>
	<div role="menu">
		<div role="group">
			<span role="menuitem">Item 1</span>
			<div role="group">
				<span role="treeitem">Item 1</span>
				<span role="treeitem">Item 2</span>
			</div>
		</div>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-children"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
