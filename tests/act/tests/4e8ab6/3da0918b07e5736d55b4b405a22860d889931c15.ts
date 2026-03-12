import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/3da0918b07e5736d55b4b405a22860d889931c15.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<div id="label">Tags</div>
	<ul role="listbox" aria-labelledby="label">
		<li role="option">Zebra</li>
		<li role="option">Zoom</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
