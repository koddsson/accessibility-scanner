import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/cecfce83c949d20c816a0e43cbc4c26a3468754b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="es">
	<body>
		<div lang="EN">
			<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" alt="Fireworks over Paris" />
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
