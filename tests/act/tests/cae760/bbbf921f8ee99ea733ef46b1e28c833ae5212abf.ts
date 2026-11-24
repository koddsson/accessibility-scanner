import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[cae760]Iframe element has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cae760/bbbf921f8ee99ea733ef46b1e28c833ae5212abf.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<iframe name="Grocery List" src="/WAI/content-assets/wcag-act-rules/test-assets/SC4-1-2-frame-doc.html"> </iframe>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
