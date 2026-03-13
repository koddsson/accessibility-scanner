import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/1583a11fb07127fb3315fa19f3baaf876aa42aa4.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<body>
		<blockquote lang="fr-CH">
			Ils ont trouvé un étrange bar Tiki aux abords de la petite ville balnéaire.
		</blockquote>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body))
      .filter(({ id }) => id === "de46e4")
      .map(({ text, url }) => ({ text, url }));

    expect(results).to.be.empty;
  });
});
