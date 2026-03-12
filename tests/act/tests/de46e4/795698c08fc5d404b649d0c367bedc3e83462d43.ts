import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/795698c08fc5d404b649d0c367bedc3e83462d43.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="es">
	<body>
		<article lang="english">
			<p aria-hidden="true">
				They wandered into a strange Tiki bar on the edge of the small beach town.
			</p>
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/valid-lang"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
