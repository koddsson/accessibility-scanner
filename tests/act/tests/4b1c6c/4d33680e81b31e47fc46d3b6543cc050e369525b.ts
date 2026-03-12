import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/4d33680e81b31e47fc46d3b6543cc050e369525b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<iframe title="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>

	<iframe aria-label="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
