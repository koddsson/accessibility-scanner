import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Failed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/8b65672c9aefc4957b09a338eb85ad7dff6e53de.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 10</title>
</head>
<body>
	<ul>
		<div></div>
		<div></div>
	</ul>
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
