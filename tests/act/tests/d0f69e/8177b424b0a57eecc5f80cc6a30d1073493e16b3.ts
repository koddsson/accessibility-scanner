import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[d0f69e]Table header cell has assigned cells", function () {
  afterEach(cleanup);

  it("Inapplicable Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/8177b424b0a57eecc5f80cc6a30d1073493e16b3.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 6</title>
</head>
<body>
	<div>
		<tr>
			<th>Column A</th>
		</tr>
	</div>
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
