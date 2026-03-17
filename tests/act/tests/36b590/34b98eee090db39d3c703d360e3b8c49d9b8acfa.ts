import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/34b98eee090db39d3c703d360e3b8c49d9b8acfa.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<form>
		<p id="error">
			<strong>
				Name and color cannot be empty. Please complete all required fields.
			</strong>
		</p>
		<fieldset>
			<legend>Shipping</legend>
			<label for="name">Name (required)</label>
			<input type="text" id="name" required />
			<br />
			<label for="address">Address</label>
			<input type="text" id="address" />
		</fieldset>
		<fieldset>
			<legend>Pick a color (required)</legend>
			<label><input type="radio" name="color" value="blue" required />Blue</label>
			<label><input type="radio" name="color" value="yellow" />Yellow</label>
		</fieldset>
		<input type="button" value="Submit" aria-describedby="error" />
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
