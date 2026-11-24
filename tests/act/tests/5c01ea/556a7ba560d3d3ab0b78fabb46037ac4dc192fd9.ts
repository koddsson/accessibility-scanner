import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[5c01ea]ARIA state or property is permitted", function () {
  afterEach(cleanup);

  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/556a7ba560d3d3ab0b78fabb46037ac4dc192fd9.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<div role="combobox" aria-expanded="false" aria-controls="id1" aria-label="My combobox">My combobox</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
