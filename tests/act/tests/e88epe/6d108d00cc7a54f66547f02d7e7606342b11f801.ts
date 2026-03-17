import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  it.skip("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/6d108d00cc7a54f66547f02d7e7606342b11f801.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<canvas id="w3c" width="200" height="60"></canvas>
	<script>
		const ctx = document.querySelector('#w3c').getContext('2d')
		ctx.font = '30px Arial'
		ctx.fillText('ACT Rules!', 20, 40)
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
