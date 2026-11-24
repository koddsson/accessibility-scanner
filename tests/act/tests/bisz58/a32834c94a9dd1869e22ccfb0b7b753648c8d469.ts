import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[bisz58]Meta element has no refresh delay (no exception)", function () {
  it("Inapplicable Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/a32834c94a9dd1869e22ccfb0b7b753648c8d469.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="; 72001" />
</head>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-refresh-no-exceptions"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
