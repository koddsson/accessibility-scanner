import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5f99a7]ARIA attribute is defined in WAI-ARIA", function () {
  it.skip("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5f99a7/830f50dcf51acb0b97b948000d7c163e50858312.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<label for="spinbutton">Enter a number between 0 and 100:</label>
	<input id="spinbutton" aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" type="number" value="25" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
