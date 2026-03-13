import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/d0c53c06c9e0a766fd5830fbbaa7df76f8cef92a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<table>
		<tr>
			<th>Event Type</th>
		</tr>
		<tr>
			<td id="headerBday" headers="headerBday">
				Birthday
			</td>
		</tr>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
