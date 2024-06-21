import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Passed Example 3 (https://act-rules.github.io/testcases/qt1vmo/766587b669e2928e8c5f21e3b1cd97e5b3e27a07.html)", async () => {
    await fixture(`<!DOCTYPE html> <html lang="en">
	<canvas id="logo" width="72" height="48" aria-label="W3C"></canvas>
	<script>
		const img = new Image()
		img.src = '/test-assets/shared/w3c-logo.png'
		img.onload = function() {
			const ctx = document.querySelector('#logo').getContext('2d')
			ctx.drawImage(img, 0, 0)
		}
	</script>
</html>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
