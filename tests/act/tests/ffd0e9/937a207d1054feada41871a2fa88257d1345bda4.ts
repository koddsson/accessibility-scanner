import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ffd0e9]Heading has non-empty accessible name", function () {
  it("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ffd0e9/937a207d1054feada41871a2fa88257d1345bda4.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 6</title>
</head>
<body>
	<span>Hello</span>
	<h1></h1>
	<span>World!</span>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/empty-heading"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
