import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[97a4e1]Button has non-empty accessible name", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/97a4e1/1a6035f4f09b339ac53bc547fc727a51ab05a3c6.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<style>
		.notInPage {
			position: absolute;
			left: -9999px;
			top: -9999px;
		}
	</style>
	<body>
		<button class="notInPage" value="delete"></button>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
