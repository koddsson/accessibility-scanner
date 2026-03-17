import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[8fc3b6]Object element rendering non-text content has non-empty accessible name", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/8fc3b6/c3ed1c920db04a7b13d043fae5766694cf50d561.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<style>
		.offScreen {
			position: absolute;
			left: -9999px;
			top: -9999px;
		}
	</style>
	<body>
		<object title="Moon speech" data="/WAI/content-assets/wcag-act-rules/test-assets/moon-audio/moon-speech.mp3" class="offScreen"></object>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/object-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
