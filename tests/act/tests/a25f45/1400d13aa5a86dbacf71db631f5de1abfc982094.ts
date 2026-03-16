import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/1400d13aa5a86dbacf71db631f5de1abfc982094.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<table>
		<thead>
			<tr>
				<th id="header1">Projects</th>
				<th id="header2">Exams</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td colspan="2" headers="header1 header2">15%</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
