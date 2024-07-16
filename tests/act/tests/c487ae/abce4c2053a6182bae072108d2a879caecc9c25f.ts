import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 2 (https://act-rules.github.io/testcases/c487ae/abce4c2053a6182bae072108d2a879caecc9c25f.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <div role="link" onclick="openLink(event)" onkeyup="openLink(event)" tabindex="0">
	Web Accessibility Initiative (WAI)
</div>
<script>
	function openLink(event) {
		if (event.type === 'click' || ['Enter', ' '].includes(event.key)) {
			window.location.href = 'https://www.w3.org/WAI/'
		}
	}
</script>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
