import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[ffd0e9]Heading has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ffd0e9/ed1daf488ef94f266fdd2a4c6c4ed016024beb14.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 2</title>
</head>
<body>
	<h1 aria-hidden="true"></h1>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/empty-heading"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
