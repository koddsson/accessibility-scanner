import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/8816eee206375f88c562d618852cb0383b89fe6e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 8</title>
</head>
<body>
	<a href="https://www.w3.org/WAI" style="left: -9999px; position: absolute;">
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" />
	</a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
