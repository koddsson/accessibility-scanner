import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";
import errorMessage from "../../../../src/rules/error-message";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/e76345ab4164567a24c0dc9dece56cee1794dc0c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<form>
		<label for="age">Age (years)</label>
		<input type="number" id="age" value="0" />
		<span id="error" style="display: none;">Invalid value for age. Age must be at least 1.</span><br />
		<input type="button" value="Submit" aria-describedby="error" />
	</form>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body, [errorMessage])).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://act-rules.github.io/rules/36b590"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
