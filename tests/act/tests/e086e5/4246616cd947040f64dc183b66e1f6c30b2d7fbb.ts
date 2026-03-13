import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it.skip("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/4246616cd947040f64dc183b66e1f6c30b2d7fbb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 6</title>
</head>
<body>
	<label for="firstname">first name</label>
	<div role="textbox" id="firstname"></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
