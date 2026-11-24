import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bc659a]Meta element has no refresh delay", function () {
  afterEach(cleanup);

  it("Inapplicable Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/ca4a053f47b6e322ad6de680fdabd05f651bf49b.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="; 30" />
</head>
<body>
	<p>This page does not refresh.</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-refresh"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
