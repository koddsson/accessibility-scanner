import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Failed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/48561a6e709e2f866c9d365f930c7055d620549f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 10</title>
</head>
<body>
	<a aria-label="1 2 3. 5 5 5. 0 1 2 3" href="tel:1235550123">123.555.0123</a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
