import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2t702h]Summary element has non-empty accessible name", function () {
  it.skip("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2t702h/a7fd233a404e737baaee10e34c35e40bbe7f14bb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<details>
		<summary role="none"></summary>
		<p>This is a website. We are available 24/7.</p>
	</details>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
