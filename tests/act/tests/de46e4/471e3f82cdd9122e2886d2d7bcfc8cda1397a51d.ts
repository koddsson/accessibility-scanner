import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/471e3f82cdd9122e2886d2d7bcfc8cda1397a51d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<body>
		<div lang="invalid">
			<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" alt="" />
		</div>
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
