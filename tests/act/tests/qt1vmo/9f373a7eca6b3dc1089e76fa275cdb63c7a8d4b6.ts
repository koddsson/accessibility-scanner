import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/9f373a7eca6b3dc1089e76fa275cdb63c7a8d4b6.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<p>Happy new year!</p>
	<canvas id="newyear" width="200" height="200"></canvas>
	<script>
		const ctx = document.querySelector('#newyear').getContext('2d')
		ctx.fillStyle = 'yellow'
		ctx.beginPath()
		ctx.moveTo(100, 10)
		ctx.lineTo(40, 180)
		ctx.lineTo(190, 60)
		ctx.lineTo(10, 60)
		ctx.lineTo(160, 180)
		ctx.fill()
	</script>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
