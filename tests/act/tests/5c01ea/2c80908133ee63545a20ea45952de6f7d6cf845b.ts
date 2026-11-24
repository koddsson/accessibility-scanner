import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[5c01ea]ARIA state or property is permitted", function () {
  afterEach(cleanup);

  it("Passed Example 13 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/2c80908133ee63545a20ea45952de6f7d6cf845b.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 13</title>
</head>
<body>
	<div role="separator" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" tabindex="0">My separator</div>
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
