import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2779a5]HTML page has non-empty title", function () {
  afterEach(cleanup);

  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/6b3d2e2147cfc618b744f2dabfaf2e66327055d7.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<head>
		<title>Title of the page.</title>
	</head>
	<body>
		<title>Title of the page.</title>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
