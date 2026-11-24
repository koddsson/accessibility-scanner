import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[307n5z]Element with presentational children has no focusable content", function () {
  afterEach(cleanup);

  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/ede992d9573d350db7cd0cb8685de5b96460fbc1.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<button><a>button/link</a></button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/nested-interactive"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
