import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bisz58]Meta element has no refresh delay (no exception)", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/6a414a1455a58e4505d7c550486d628f0fd80fdd.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="0; URL='https://w3.org'" />
</head>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
