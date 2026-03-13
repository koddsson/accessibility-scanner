import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/9ed4f5f7c0a9b8377e7652022430cbd5b1eddccf.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<ul>
		<li>Item 1</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-children"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
