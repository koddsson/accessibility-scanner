import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/c02748c85d58e188b3c13773986272df616b2f3c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<table>
		<tr>
			<th colspan="2" id="header1">Projects</th>
			<th colspan="2" id="header2">Exams</th>
		</tr>
		<tr>
			<th id="e1" headers="header1">1</th>
			<th id="e2" headers="header1">2</th>
			<th id="p1" headers="header2">1</th>
			<th id="p2" headers="header2">2</th>
		</tr>
		<tr>
			<td colspan="2" headers="header1 e1 e2">15%</td>
			<td headers="header2 p1">15%</td>
			<td headers="header2 p2">45%</td>
		</tr>
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
