import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  afterEach(cleanup);

  it("Failed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/92214e0008b9b2e7bd98d991d27c09bb33d4c92c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 10</title>
</head>
<body>
	<label>Email<input autocomplete="email invalid"/></label>
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
