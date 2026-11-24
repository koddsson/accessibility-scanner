import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/512d17179ce05f1d10bccf46b7e294864bfa308d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<label>Photo<input autocomplete="work photo"/></label>
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
