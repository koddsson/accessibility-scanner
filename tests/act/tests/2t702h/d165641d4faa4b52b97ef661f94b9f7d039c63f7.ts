import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2t702h]Summary element has non-empty accessible name", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2t702h/d165641d4faa4b52b97ef661f94b9f7d039c63f7.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<details>
		<summary>Opening times</summary>
		<summary></summary>
		<p>This is a website. We are available 24/7.</p>
	</details>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
