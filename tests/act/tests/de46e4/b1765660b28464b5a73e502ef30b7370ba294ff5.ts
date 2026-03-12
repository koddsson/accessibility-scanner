import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/b1765660b28464b5a73e502ef30b7370ba294ff5.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="es">
	<body>
		<article lang="dutch">
			Zij liepen een vreemde Tiki bar binnen, aan de rand van een dorpje aan het strand.
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
