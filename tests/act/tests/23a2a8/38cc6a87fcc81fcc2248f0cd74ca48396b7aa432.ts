import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[23a2a8]Image has non-empty accessible name", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/38cc6a87fcc81fcc2248f0cd74ca48396b7aa432.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div
		role="img"
		aria-label="W3C logo"
		style="width:72px; height:48px; background-image: url(/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png)"
	></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
