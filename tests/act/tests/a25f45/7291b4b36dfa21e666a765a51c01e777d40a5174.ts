import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/7291b4b36dfa21e666a765a51c01e777d40a5174.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<table>
		<tr>
			<td></td>
			<th id="projects2">Projects</th>
		</tr>
		<tr>
			<td headers="projects2">15%</td>
			<td></td>
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
