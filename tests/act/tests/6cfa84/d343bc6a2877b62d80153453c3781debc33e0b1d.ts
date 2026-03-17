import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[6cfa84]Element with aria-hidden has no content in sequential focus navigation", function () {
  it.skip("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6cfa84/d343bc6a2877b62d80153453c3781debc33e0b1d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<div
		id="sampleModal"
		role="dialog"
		aria-label="Sample Modal"
		aria-modal="true"
		style="border: solid black 1px; padding: 1rem;"
	>
		<label>First and last name <input id="dialogFirst"/></label><br />
		<button id="closeButton">Close button</button>
	</div>
	<div aria-hidden="true">
		<a href="#" id="sentinelAfter" style="position:absolute; top:-999em"
			>Upon receiving focus, this focus sentinel should wrap focus to the top of the modal</a
		>
	</div>
	<script>
		document.getElementById('sentinelAfter').addEventListener('focus', () => {
			document.getElementById('dialogFirst').focus()
		})
		document.getElementById('closeButton').addEventListener('click', () => {
			document.getElementById('sampleModal').style.display = 'none'
		})
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-hidden-focus"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
