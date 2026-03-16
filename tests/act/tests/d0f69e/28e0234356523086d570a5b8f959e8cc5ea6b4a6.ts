import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/28e0234356523086d570a5b8f959e8cc5ea6b4a6.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<table>
		<tr>
			<th id="col1">Cities</th>
			<th id="col2">Count</th>
		</tr>
		<tr>
			<td>Paris</td>
		</tr>
		<tr>
			<td headers="col2">1</td>
		</tr>
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
