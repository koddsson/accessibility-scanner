import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/2a66c7b8d8ef78d350b1c995e0ad232008f6564f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<canvas id="logo" width="72" height="48" aria-label="W3C logo"></canvas>
	<script>
		const img = new Image()
		img.src = '/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png'
		img.onload = function() {
			const ctx = document.querySelector('#logo').getContext('2d')
			ctx.drawImage(img, 0, 0)
		}
	</script>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
