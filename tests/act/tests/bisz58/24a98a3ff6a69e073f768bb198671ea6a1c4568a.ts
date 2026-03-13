import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bisz58]Meta element has no refresh delay (no exception)", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/24a98a3ff6a69e073f768bb198671ea6a1c4568a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="0; https://w3.org" />
	<meta http-equiv="refresh" content="30; https://w3.org" />
</head>
</html>`, 'text/html');

    const results = (await scan(document.body))
      .filter(({ id }) => id === "meta-refresh-no-exceptions")
      .map(({ text, url }) => ({ text, url }));

    expect(results).to.be.empty;
  });
});
