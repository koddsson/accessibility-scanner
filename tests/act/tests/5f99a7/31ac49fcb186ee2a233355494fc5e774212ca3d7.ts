import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5f99a7]ARIA attribute is defined in WAI-ARIA", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5f99a7/31ac49fcb186ee2a233355494fc5e774212ca3d7.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="dialog" aria-modal="true">Contains modal content...</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body))
      .filter(({ id }) => id === "aria-valid-attr")
      .map(({ text, url }) => ({ text, url }));

    expect(results).to.be.empty;
  });
});
