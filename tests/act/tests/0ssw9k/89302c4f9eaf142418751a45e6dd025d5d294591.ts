import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[0ssw9k]Scrollable content can be reached with sequential focus navigation", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/89302c4f9eaf142418751a45e6dd025d5d294591.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
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
		</p>
	</section>
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
