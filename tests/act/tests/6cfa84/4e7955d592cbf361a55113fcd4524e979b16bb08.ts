import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[6cfa84]Element with aria-hidden has no content in sequential focus navigation", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6cfa84/4e7955d592cbf361a55113fcd4524e979b16bb08.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<div aria-hidden="true">
		<a href="/" style="position:absolute; top:-999em">Link</a>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-hidden-focus"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
