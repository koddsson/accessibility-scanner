import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2ee8b8]Visible label is part of accessible name", function () {
  afterEach(cleanup);

  it("Passed Example 16 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/710e48ef6593478abfd4a367b0b3668c5f410092.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 16</title>
</head>
<body>
	<button aria-label="💡 Submit 💡">&gt;&gt;&gt; ** Submit ** &lt;&lt;&lt;</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
