import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/824fa57ab563edbac93384a58e21b3045bd71c65.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<head>
		<title>Lorem ipsum</title>
		<meta charset="UTF-8" />
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

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-viewport"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
