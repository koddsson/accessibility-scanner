import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it.skip("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/dee6c55162904cfb77c7f65614c4e6ae2baacea2.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<style>
		.offScreenLink {
			position: absolute;
			left: -9999px;
			top: -9999px;
		}
	</style>
	<body>
		<a class="offScreenLink" href="https://www.w3.org/WAI">Web Accessibility Initiative (WAI)</a>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
