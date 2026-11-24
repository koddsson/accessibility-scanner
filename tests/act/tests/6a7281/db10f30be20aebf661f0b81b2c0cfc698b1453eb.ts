import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[6a7281]ARIA state or property has valid value", function () {
  afterEach(cleanup);

  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/db10f30be20aebf661f0b81b2c0cfc698b1453eb.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="textbox" aria-required="true" aria-label="Family name"></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-valid-attr-value"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
