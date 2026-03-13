import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/d761116217a5875490cd7a2adf0219bdb1bff5cf.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="link" onclick="openLink(event)" onkeyup="openLink(event)" tabindex="0">
		Web Accessibility Initiative (WAI)
	</div>
	<script>
		function openLink(event) {
			if (event.type === 'click' || ['Enter', ' '].includes(event.key)) {
				window.location.href = 'https://www.w3.org/WAI/'
			}
		}
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
