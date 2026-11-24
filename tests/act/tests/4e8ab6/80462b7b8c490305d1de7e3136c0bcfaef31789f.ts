import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/80462b7b8c490305d1de7e3136c0bcfaef31789f.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<div role="heading">
		My First Heading
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
