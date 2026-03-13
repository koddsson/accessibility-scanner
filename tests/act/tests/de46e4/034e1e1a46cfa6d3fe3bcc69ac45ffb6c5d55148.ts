import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it.skip("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/034e1e1a46cfa6d3fe3bcc69ac45ffb6c5d55148.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="fr">
	<body>
		<p lang="en-US-GB">
			They wandered into a strange Tiki bar on the edge of the small beach town.
		</p>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
