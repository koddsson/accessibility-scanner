import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it.skip("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/d8c5a59532ae0624edd875aea31ef39086873b7a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="fr">
	<body>
		<article lang="invalid">
			<div lang="en">
				They wandered into a strange Tiki bar on the edge of the small beach town.
			</div>
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
