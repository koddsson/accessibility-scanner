import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";
import errorMessage from "../../../../src/rules/error-message";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/a51e05dc7b64d927ff25bc493bb0aa069c963d29.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<form>
		<label for="age">Age (years)</label>
		<input type="number" id="age" />
		<span id="error">Invalid value for age.</span><br />
		<input type="button" value="Submit" />
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
