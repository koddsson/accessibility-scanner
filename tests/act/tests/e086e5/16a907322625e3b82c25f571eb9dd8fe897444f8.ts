import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[e086e5]Form field has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/16a907322625e3b82c25f571eb9dd8fe897444f8.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<select role="none" disabled>
		<option value="volvo">Volvo</option>
		<option value="saab">Saab</option>
		<option value="opel">Opel</option>
	</select>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name","https://dequeuniversity.com/rules/axe/4.11/aria-toggle-field-name","https://dequeuniversity.com/rules/axe/4.11/label","https://dequeuniversity.com/rules/axe/4.11/select-name"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
