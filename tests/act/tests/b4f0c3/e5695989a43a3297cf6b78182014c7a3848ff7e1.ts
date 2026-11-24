import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  afterEach(cleanup);

  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/e5695989a43a3297cf6b78182014c7a3848ff7e1.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<head>
		<title>Simple page showing random text</title>
		<meta name="viewport" content="maximum-scale=yes" />
	</head>
	<body>
		<p>
			Lorem ipsum
		</p>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-viewport"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
