import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/9fbe21d1ffdb176ef89afc95cc3f4f666353ee25.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<table>
		<thead>
			<tr>
				<th>Projects</th>
				<th>Exams</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td colspan="2">15%</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/th-has-data-cells"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
