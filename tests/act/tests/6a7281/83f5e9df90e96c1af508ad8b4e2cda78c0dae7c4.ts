import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[6a7281]ARIA state or property has valid value", function () {
  afterEach(cleanup);

  it("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/83f5e9df90e96c1af508ad8b4e2cda78c0dae7c4.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<div role="spinbutton" aria-valuemin="1.0" aria-valuemax="2.0" aria-valuenow="1.5" aria-label="Select a value"></div>
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
