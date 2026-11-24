import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/f9c84eeeb2ab4f07802f2739786dfda1d8f974a0.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 2</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" style="display:none" alt="" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
