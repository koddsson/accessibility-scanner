import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  afterEach(cleanup);

  it("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/cd80cea25465f393871872ab3cc202d765e5d11d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 8</title>
</head>
<body>
	<input type="submit" autocomplete="email" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
