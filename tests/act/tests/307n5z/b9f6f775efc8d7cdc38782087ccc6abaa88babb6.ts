import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[307n5z]Element with presentational children has no focusable content", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/b9f6f775efc8d7cdc38782087ccc6abaa88babb6.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<p role="checkbox" aria-checked="false" tabindex="0">I agree to the <a href="/terms">terms of service</a></p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/nested-interactive"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
