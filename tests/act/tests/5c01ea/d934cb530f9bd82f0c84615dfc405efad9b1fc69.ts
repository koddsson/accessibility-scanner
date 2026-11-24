import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[5c01ea]ARIA state or property is permitted", function () {
  afterEach(cleanup);

  it("Passed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/d934cb530f9bd82f0c84615dfc405efad9b1fc69.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 10</title>
</head>
<body>
	<button role="none" aria-pressed="false">ACT rules are cool!</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
