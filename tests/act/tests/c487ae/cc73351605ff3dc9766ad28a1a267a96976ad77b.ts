import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/cc73351605ff3dc9766ad28a1a267a96976ad77b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 10</title>
</head>
<body>
	<a href="https://www.w3.org/WAI" role="none"> </a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/area-alt","https://dequeuniversity.com/rules/axe/4.11/link-name"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
