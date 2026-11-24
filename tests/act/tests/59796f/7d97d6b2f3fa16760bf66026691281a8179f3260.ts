import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[59796f]Image button has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/59796f/7d97d6b2f3fa16760bf66026691281a8179f3260.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<input type="image" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/search-icon.svg" aria-labelledby="id1" />
	<div id="id1">Search</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/input-image-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
