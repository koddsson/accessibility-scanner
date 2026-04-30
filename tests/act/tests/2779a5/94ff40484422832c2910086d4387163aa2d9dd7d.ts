import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/94ff40484422832c2910086d4387163aa2d9dd7d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>This page gives a title to an iframe</title>
	</head>
	<body>
		<iframe src="/WAI/content-assets/wcag-act-rules/test-assets/sc2-4-2-title-page-without-title.html"></iframe>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
