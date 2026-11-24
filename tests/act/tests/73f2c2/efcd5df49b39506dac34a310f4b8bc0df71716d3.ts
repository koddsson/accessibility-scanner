import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  afterEach(cleanup);

  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/efcd5df49b39506dac34a310f4b8bc0df71716d3.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<label>
		Password
		<input type="password" autocomplete="current-password webauthn" />
	</label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
