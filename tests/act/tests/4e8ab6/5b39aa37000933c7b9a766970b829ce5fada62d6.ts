import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  afterEach(cleanup);

  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/5b39aa37000933c7b9a766970b829ce5fada62d6.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="checkbox" aria-checked="false" aria-labelledby="label"></div>
	<div id="label">Check me</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
