import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[0ssw9k]Scrollable content can be reached with sequential focus navigation", function () {
  it.skip("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/731acbc281943f3fef81aee32f6a553fc426e20f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<style>
		section {
			height: 100px;
			width: 400px;
			overflow-y: auto;
			white-space: nowrap;
		}
		section > img {
			display: inline-block;
			width: 80px;
		}
	</style>
	<h1>Our sponsors:</h1>
	<section>
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/eu-logo.svg" alt="EU" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/eu-logo.svg" alt="EU" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/eu-logo.svg" alt="EU" />
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C" />
	</section>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
