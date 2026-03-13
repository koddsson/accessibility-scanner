import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ff89c9]ARIA required context role", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/2fb70cb7f44a01a2d75f4ef7ca7992cf3fb4fe1d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<div role="list">
		<div role="tabpanel">
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
