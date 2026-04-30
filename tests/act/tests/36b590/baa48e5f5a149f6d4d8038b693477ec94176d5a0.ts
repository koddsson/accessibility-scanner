import { expect } from "@open-wc/testing";
import { scan, allRules } from "../../../../src/scanner";
import errorMessage from "../../../../src/rules/error-message";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/baa48e5f5a149f6d4d8038b693477ec94176d5a0.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<form>
		<label for="filter">Product filter</label>
		<input type="text" id="filter" />
		<input type="button" value="filter" />
		<p>To see all products, leave the field empty.</p>
	</form>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body, [...allRules, errorMessage])).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://act-rules.github.io/rules/36b590"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
