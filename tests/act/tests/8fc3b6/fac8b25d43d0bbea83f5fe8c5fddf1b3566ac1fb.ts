import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[8fc3b6]Object element rendering non-text content has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/8fc3b6/fac8b25d43d0bbea83f5fe8c5fddf1b3566ac1fb.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 7</title>
</head>
<body>
	<audio title="Moon speech" src="/WAI/content-assets/wcag-act-rules/test-assets/moon-audio/moon-speech.mp3"></audio>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/object-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
