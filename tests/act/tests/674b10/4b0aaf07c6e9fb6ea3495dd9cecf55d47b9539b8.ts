import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[674b10]Role attribute has valid value", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/4b0aaf07c6e9fb6ea3495dd9cecf55d47b9539b8.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<style>
		.link {
			color: #0000ee;
			text-decoration: underline;
			cursor: pointer;
		}
	</style>
	I love <span class="link" onclick="location.href='https://act-rules.github.io/'" role="lnik">ACT rules</span>.
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-roles"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
