import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ff89c9]ARIA required context role", function () {
  it.skip("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/52508dc0ac389108301d7cbd7f931be45a45741f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<div role="list">
		<div aria-live="polite">
			<div role="listitem">List item 1</div>
			<div role="listitem">List item 2</div>
		</div>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-parent"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
