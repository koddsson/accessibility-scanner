import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[5c01ea]ARIA state or property is permitted", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/4240276511703c9bfa881ac80f7c0af5c92c97cc.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<button aria-pressed="false">My button</button>
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
