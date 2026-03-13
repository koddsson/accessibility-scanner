import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc4a75]ARIA required owned elements", function () {
  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/faa124300ae3b5ccdce631d2c79a461946066902.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 9</title>
</head>
<body>
	<table>
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
