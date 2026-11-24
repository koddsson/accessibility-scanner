import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2ee8b8]Visible label is part of accessible name", function () {
  afterEach(cleanup);

  it("Passed Example 15 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/c9b81bf076633f3d7c2c52b75e11ca89f921bf29.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 15</title>
</head>
<body>
	<button aria-label="Next">Next…</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
