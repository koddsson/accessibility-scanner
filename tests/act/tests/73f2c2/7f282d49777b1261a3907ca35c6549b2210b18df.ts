import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  afterEach(cleanup);

  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/7f282d49777b1261a3907ca35c6549b2210b18df.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<label>Username<input role="banner" tabindex="0" autocomplete="banner"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
