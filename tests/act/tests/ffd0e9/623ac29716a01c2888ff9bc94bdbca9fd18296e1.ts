import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ffd0e9]Heading has non-empty accessible name", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ffd0e9/623ac29716a01c2888ff9bc94bdbca9fd18296e1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<h1><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/act-logo.png" alt="ACT rules" role="presentation" /></h1>
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
