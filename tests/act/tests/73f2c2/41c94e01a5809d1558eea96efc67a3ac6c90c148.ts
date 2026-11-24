import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  afterEach(cleanup);

  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/41c94e01a5809d1558eea96efc67a3ac6c90c148.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<label>Office email<input type="text" autocomplete="section-primary shipping work email"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
