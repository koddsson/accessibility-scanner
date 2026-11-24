import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  afterEach(cleanup);

  it("Inapplicable Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/3a6b86ed813d4c34e566641e9fcd571e16aeae6f.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 7</title>
</head>
<body>
	<label>Friend's first name<input type="text" autocomplete="off"/></label>
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
