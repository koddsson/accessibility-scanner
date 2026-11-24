import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/486f868f7a1f41507a2bc214eb94087a8e906b4c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<iframe id="top-level" title="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html">
	</iframe>
	
	<iframe
		id="container"
		srcdoc="<iframe id='nested' title='List of Contributors' src='/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html'> </iframe>"
	></iframe>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
