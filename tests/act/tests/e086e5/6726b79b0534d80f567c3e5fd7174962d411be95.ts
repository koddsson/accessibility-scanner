import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/6726b79b0534d80f567c3e5fd7174962d411be95.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<label for="country">Country</label>
	<select id="country">
		<option>England</option>
		<option>Scotland</option>
		<option>Wales</option>
		<option>Northern Ireland</option>
	</select>
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
