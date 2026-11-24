import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  afterEach(cleanup);

  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/bac67a5a2ada971100bbec89961ad3e6c869f268.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<canvas id="logo" width="72" height="48" aria-label="HTML 5 logo"></canvas>
	<script>
		const img = new Image()
		img.src = '/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png'
		img.onload = function() {
			const ctx = document.querySelector('#logo').getContext('2d')
			ctx.drawImage(img, 0, 0)
		}
	</script>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
  });
});
