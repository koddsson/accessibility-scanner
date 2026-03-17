import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/e2cc934a42be5a597106214fa0fbcefd6ceac599.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<form>
		<label for="age">Age (years)</label>
		<input type="number" id="age" aria-describedby="error" value="0" />
		<span id="error">Invalid value for age. Age must be at least 1.</span><br />
		<input type="button" value="Submit" />
	</form>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/error-message"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
