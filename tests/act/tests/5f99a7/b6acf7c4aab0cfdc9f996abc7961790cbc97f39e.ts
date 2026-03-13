import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5f99a7]ARIA attribute is defined in WAI-ARIA", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5f99a7/b6acf7c4aab0cfdc9f996abc7961790cbc97f39e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<span id="label">Birthday:</span>
	<div contenteditable role="searchbox" aria-labelled="label" aria-placeholder="MM-DD-YYYY">
		01-01-2019
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-valid-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
