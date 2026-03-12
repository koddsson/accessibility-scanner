import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[59796f]Image button has non-empty accessible name", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/59796f/0bbd55ba8e418361f99f717418206a37d57fd978.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<input type="image" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/search-icon.svg" aria-labelledby="non-existing" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
