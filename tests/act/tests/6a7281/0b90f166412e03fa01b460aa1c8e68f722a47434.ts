import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[6a7281]ARIA state or property has valid value", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/0b90f166412e03fa01b460aa1c8e68f722a47434.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<div role="alert" aria-live>Remember to be awesome!</div>
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
