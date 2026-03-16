import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Passed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/81104ca788ec9b7f87446a4665932812471952fa.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 10</title>
</head>
<body>
	<table role="treegrid" aria-label="a test grid">
		<tr>
			<td>Item 1</td>
			<td>Item 2</td>
			<td>Item 3</td>
		</tr>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-children"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
