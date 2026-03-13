import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it("Failed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/bd816c3ef10b8982f18411e1623887d2444d7311.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 8</title>
</head>
<body>
	<p id="dip">Add one or more dip:</p>
	<div role="menu" aria-labelledby="dip">
		<input type="checkbox" role="menuitemcheckbox" /><span aria-hidden="true">Ketchup</span><br />
		<input type="checkbox" role="menuitemcheckbox" /><span aria-hidden="true">Mayonnaise</span>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
