import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/59911c86fd770ba2c98dc1c669f9003c2c7e71ac.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
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
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
