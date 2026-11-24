import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[674b10]Role attribute has valid value", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/ebd0080bacb8debc7ad069072240657df38c3e2c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 1</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C logo" />
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
