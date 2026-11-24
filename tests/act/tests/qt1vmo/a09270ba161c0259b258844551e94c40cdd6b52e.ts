import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Inapplicable Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/a09270ba161c0259b258844551e94c40cdd6b52e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 10</title>
</head>
<body>
	<p>Happy new year!</p>
	<div
		style="
		width: 260px;
		height: 260px;
		background: url(/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg) no-repeat;
	"
	></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
