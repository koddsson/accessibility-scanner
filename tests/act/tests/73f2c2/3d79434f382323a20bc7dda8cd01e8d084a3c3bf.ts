import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  afterEach(cleanup);

  it("Failed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/3d79434f382323a20bc7dda8cd01e8d084a3c3bf.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 9</title>
</head>
<body>
	<label>Password<input type="password" autocomplete="current-password webauthn invalid"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
