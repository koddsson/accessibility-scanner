import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[674b10]Role attribute has valid value", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/527c265ba570f0131dddef3687981b66f6dd156f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<style>
		.ref {
			color: #0000ee;
			text-decoration: underline;
			cursor: pointer;
		}
	</style>
	See [<span class="ref" onclick="location.href='https://act-rules.github.io/'" role="bibliographic-reference lnik"
		>ACT rules</span
	>].
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
