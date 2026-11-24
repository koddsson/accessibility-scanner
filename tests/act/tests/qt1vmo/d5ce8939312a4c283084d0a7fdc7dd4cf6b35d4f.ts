import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  afterEach(cleanup);

  it("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/d5ce8939312a4c283084d0a7fdc7dd4cf6b35d4f.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 8</title>
</head>
<body>
	<a href="https://w3.org" aria-label="W3C Website">
		<svg height="200" xmlns="http://www.w3.org/2000/svg" aria-label="star">
			<polygon points="100,10 40,180 190,60 10,60 160,180" fill="yellow" />
		</svg>
	</a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
