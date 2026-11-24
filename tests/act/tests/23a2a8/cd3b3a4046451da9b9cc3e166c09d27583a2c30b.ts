import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[23a2a8]Image has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/cd3b3a4046451da9b9cc3e166c09d27583a2c30b.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 1</title>
</head>
<body>
	<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
		<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/image-alt","https://dequeuniversity.com/rules/axe/4.11/role-img-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
