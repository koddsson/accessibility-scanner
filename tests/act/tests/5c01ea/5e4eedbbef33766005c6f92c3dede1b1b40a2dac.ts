import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[5c01ea]ARIA state or property is permitted", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/5e4eedbbef33766005c6f92c3dede1b1b40a2dac.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<button aria-sort="">Sort by year</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
