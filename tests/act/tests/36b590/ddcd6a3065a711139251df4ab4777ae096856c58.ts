import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/ddcd6a3065a711139251df4ab4777ae096856c58.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<form>
		<label for="age">Age (years)</label>
		<input type="number" id="age" value="0" />
		<span id="error" aria-hidden="true">Invalid value for age. Age must be at least 1.</span><br />
		<input type="button" value="Submit" />
	</form>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/error-message"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
