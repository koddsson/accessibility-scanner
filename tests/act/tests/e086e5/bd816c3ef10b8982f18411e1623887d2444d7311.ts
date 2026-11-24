import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[e086e5]Form field has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Failed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/bd816c3ef10b8982f18411e1623887d2444d7311.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 8</title>
</head>
<body>
	<p id="dip">Add one or more dip:</p>
	<div role="menu" aria-labelledby="dip">
		<input type="checkbox" role="menuitemcheckbox" /><span aria-hidden="true">Ketchup</span><br />
		<input type="checkbox" role="menuitemcheckbox" /><span aria-hidden="true">Mayonnaise</span>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name","https://dequeuniversity.com/rules/axe/4.11/aria-toggle-field-name","https://dequeuniversity.com/rules/axe/4.11/label","https://dequeuniversity.com/rules/axe/4.11/select-name"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
