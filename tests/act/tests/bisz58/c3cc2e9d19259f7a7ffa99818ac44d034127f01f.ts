import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bisz58]Meta element has no refresh delay (no exception)", function () {
  afterEach(cleanup);

  it("Inapplicable Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/c3cc2e9d19259f7a7ffa99818ac44d034127f01f.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="" />
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
