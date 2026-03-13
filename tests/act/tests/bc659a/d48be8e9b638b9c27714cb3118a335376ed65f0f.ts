import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc659a]Meta element has no refresh delay", function () {
  it.skip("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/d48be8e9b638b9c27714cb3118a335376ed65f0f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="0; https://w3.org" />
	<meta http-equiv="refresh" content="5; https://w3.org" />
</head>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
