import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[0ssw9k]Scrollable content can be reached with sequential focus navigation", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/c5f649f91ebe4979270972db7c42279a74efc6c5.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<style>
		dialog:-internal-dialog-in-top-layer::backdrop {
	    		background: rgba(1, 1, 1, 0.8);
		}
	</style>
	<section style="height: 100px; width: 500px; overflow: scroll;" tabindex="0">
		<h1>WCAG 2.1 Abstract</h1>
		<p>
			Web Content Accessibility Guidelines (WCAG) 2.1 covers a wide range of recommendations for making Web content more
			accessible. Following these guidelines will make content more accessible to a wider range of people with
			disabilities, including accommodations for blindness and low vision, deafness and hearing loss, limited movement,
			speech disabilities, photosensitivity, and combinations of these, and some accommodation for learning disabilities
			and cognitive limitations; but will not address every user need for people with these disabilities. These guidelines
			address accessibility of web content on desktops, laptops, tablets, and mobile devices. Following these guidelines
			will also often make Web content more usable to users in general.
			<button id="ppButton" onclick="openDialog()">Read more about WCAG 2.2</button>
		</p>
	</section>
	<dialog id="ppDialog" aria-labelledby="dialogLabel">
		<h2 id="dialogLabel">WCAG 2.2</h2>
		<p>
			<a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a>
		</p>
		<button id="cancel" onclick="ppDialog.close()">Cancel</button>
	</dialog>
	<script>
		const openDialog = () => {
			ppDialog.showModal();
			myFrame.tabIndex = '-1'
		}
		ppDialog.addEventListener('close', () => myFrame.tabIndex = 0)
		window.addEventListener('DOMContentLoaded', openDialog);
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
