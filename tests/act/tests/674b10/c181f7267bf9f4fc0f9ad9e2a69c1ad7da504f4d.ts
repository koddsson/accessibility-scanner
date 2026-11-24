import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[674b10]Role attribute has valid value", function () {
  afterEach(cleanup);

  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/c181f7267bf9f4fc0f9ad9e2a69c1ad7da504f4d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<label>Search: <input type="text" role="searchbox" placeholder="Enter 3 or more characters"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-roles"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
