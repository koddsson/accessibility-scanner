import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  afterEach(cleanup);

  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/11c5321c05c7b83b8707eee76574a94bd44033fe.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<div role="scrollbar" aria-controls="content" aria-valuenow="0"></div>
	<main id="content"></main>
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
