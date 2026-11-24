import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/410778b7d0c30044bfafed29789220f4b7ca98f1.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<style>
		img {
			position: absolute;
			top: -9999em;
		}
	</style>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" alt="" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
