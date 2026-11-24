import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[d0f69e]Table header cell has assigned cells", function () {
  afterEach(cleanup);

  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/4d021e317ad660d19925651ead361fcaf474dc76.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<table>
		<tr>
			<th>Time</th>
		</tr>
		<tr>
			<td>05:41</td>
		</tr>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/th-has-data-cells"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
