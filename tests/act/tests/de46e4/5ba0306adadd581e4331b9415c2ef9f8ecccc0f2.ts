import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/5ba0306adadd581e4331b9415c2ef9f8ecccc0f2.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<body>
		<div lang="invalid">
			<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" alt="Fireworks over Paris" />
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
