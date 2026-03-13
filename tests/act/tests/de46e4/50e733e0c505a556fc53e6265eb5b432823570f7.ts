import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it.skip("Failed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/50e733e0c505a556fc53e6265eb5b432823570f7.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="lb">
	<body>
		<p lang="i-lux">Lëtzebuerg ass e Land an Europa.</p>
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
