import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/ba5019010a6e0cfbcb46b2f7e9e63a6117e06f97.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<table>
		<tr>
			<th id="name" colspan="2">Name</th>
		</tr>
		<tr>
			<th headers="name">Firstname</th>
			<th headers="name">Lastname</th>
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
