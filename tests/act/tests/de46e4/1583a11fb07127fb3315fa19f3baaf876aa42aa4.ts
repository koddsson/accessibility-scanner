import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  afterEach(cleanup);

  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/1583a11fb07127fb3315fa19f3baaf876aa42aa4.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<body>
		<blockquote lang="fr-CH">
			Ils ont trouvé un étrange bar Tiki aux abords de la petite ville balnéaire.
		</blockquote>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/valid-lang"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
