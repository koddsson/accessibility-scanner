import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[23a2a8]Image has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/7d696551efaafa0da33bb6e56b8b43707c7c7de9.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<div style="display: none">
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" />
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/image-alt","https://dequeuniversity.com/rules/axe/4.11/role-img-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
