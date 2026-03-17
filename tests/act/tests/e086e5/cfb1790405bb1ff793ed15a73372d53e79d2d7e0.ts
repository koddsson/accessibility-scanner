import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/cfb1790405bb1ff793ed15a73372d53e79d2d7e0.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<p id="dip">Add one or more dip:</p>
	<div role="menu" aria-labelledby="dip">
		<input type="checkbox" role="menuitemcheckbox" aria-labelledby="ketchup" /><span id="ketchup" aria-hidden="true"
			>Ketchup</span
		><br />
		<input type="checkbox" role="menuitemcheckbox" aria-labelledby="mayonnaise" /><span id="mayonnaise" aria-hidden="true"
			>Mayonnaise</span
		>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name","https://dequeuniversity.com/rules/axe/4.11/aria-toggle-field-name","https://dequeuniversity.com/rules/axe/4.11/label","https://dequeuniversity.com/rules/axe/4.11/select-name"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
