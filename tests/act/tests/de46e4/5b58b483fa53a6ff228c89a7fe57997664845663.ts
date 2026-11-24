import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/5b58b483fa53a6ff228c89a7fe57997664845663.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<body>
		They wandered into a strange Tiki bar on the edge of the small beach town.
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/valid-lang"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
