import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/a14968698b0e95b6624f187d4538e320e4fa8952.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title></title>
	</head>
	<body>
		<title>Title of the page.</title>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
