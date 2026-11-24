import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[97a4e1]Button has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/97a4e1/096bf1e8eeb0b5633861389cb3fa3267649e396c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<button role="link">take me somewhere</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-command-name","https://dequeuniversity.com/rules/axe/4.11/button-name","https://dequeuniversity.com/rules/axe/4.11/input-button-name"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
