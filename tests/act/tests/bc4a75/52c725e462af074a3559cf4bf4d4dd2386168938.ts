import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/52c725e462af074a3559cf4bf4d4dd2386168938.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 7</title>
</head>
<body>
	<div role="list">
		<span role="listitem">Item 1</span>
		<div role="group">
			<span role="listitem">Item 2</span>
			<span role="listitem">Item 3</span>
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
