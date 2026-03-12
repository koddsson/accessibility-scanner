import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5c01ea]ARIA state or property is permitted", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/f91d77e96c069380252b674faaf08eecab375503.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="button" aria-pressed="false">My button</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
