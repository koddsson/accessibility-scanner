import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Failed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/497cd2bb724541d56e49a57e38d5a7e2fabffc6a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 9</title>
</head>
<body>
	<table role="menu" aria-label="a test table" aria-activedescendant="item1" tabindex="0">
		<tr role="list">
			<td id="item1" role="menuitem">Item 1</td>
			<td id="item2" role="menuitem">Item 2</td>
			<td id="item3" role="menuitem">Item 3</td>
		</tr>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-children"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
