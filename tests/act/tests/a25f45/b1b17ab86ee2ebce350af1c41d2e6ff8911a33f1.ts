import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/b1b17ab86ee2ebce350af1c41d2e6ff8911a33f1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<table>
		<tr>
			<th id="projects1" scope="row">Projects</th>
			<th id="progress1" scope="row">Progress</th>
		</tr>
		<tr>
			<td headers="projects1">My Project</td>
			<td headers="progress1">15%</td>
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
