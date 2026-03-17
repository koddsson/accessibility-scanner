import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/d7863608ff2aab99c43663cb3701c65c28b75c23.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<form>
		<fieldset>
			<legend>Shipping</legend>
			<label for="shippingName">Name</label>
			<input type="text" id="shippingName" required />
			<label for="shippingAddress">Address</label>
			<input type="text" id="shippingAddress" required />
		</fieldset>
		<fieldset>
			<legend>Billing</legend>
			<label for="billingName">Name</label>
			<input type="text" id="billingName" />
			<label for="billingAddress">Address</label>
			<input type="text" id="billingAddress" />
		</fieldset>
		<span id="error">All required fields must be filled.<br />Please fill Name.<br />Please fill Address</span><br />
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
