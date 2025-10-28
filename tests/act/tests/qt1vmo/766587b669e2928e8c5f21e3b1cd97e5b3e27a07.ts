import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Passed Example 3 (https://act-rules.github.io/testcases/qt1vmo/766587b669e2928e8c5f21e3b1cd97e5b3e27a07.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body>
	<canvas id="logo" width="72" height="48" aria-label="W3C"></canvas>
	<script>
		const img = new Image()
		img.src = '/test-assets/shared/w3c-logo.png'
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
