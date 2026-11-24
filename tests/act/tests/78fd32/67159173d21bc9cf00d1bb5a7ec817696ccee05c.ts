import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/67159173d21bc9cf00d1bb5a7ec817696ccee05c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<style>
		p {
			font-size: 20px;
		}
	</style>
	
	<p style="line-height: 20px !important; max-width: 200px;">
		The toy brought back fond memories of being lost in the rain forest.
	</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/avoid-inline-spacing"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
