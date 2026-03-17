import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/ca41ec5f1dba602b8b6e332ad524cbfc5cd1505e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<div>Country</div>
	<div aria-label="country" role="combobox" aria-disabled="true">England</div>
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
