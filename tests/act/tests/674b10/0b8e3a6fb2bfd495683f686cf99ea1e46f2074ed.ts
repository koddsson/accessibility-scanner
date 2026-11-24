import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[674b10]Role attribute has valid value", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/0b8e3a6fb2bfd495683f686cf99ea1e46f2074ed.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 4</title>
</head>
<body>
	<input type="text" role=" " />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-roles"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
