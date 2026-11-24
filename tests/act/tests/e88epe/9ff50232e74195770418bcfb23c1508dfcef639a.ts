import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  afterEach(cleanup);

  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/9ff50232e74195770418bcfb23c1508dfcef639a.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" role="none" alt="W3C logo" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
