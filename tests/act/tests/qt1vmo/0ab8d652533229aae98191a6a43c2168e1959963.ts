import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/0ab8d652533229aae98191a6a43c2168e1959963.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 1</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/pdf-icon.png" alt="" /> PDF document
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
