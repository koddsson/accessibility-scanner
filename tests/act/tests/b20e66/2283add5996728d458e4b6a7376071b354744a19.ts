import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  it("Passed Example 11 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/2283add5996728d458e4b6a7376071b354744a19.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 11</title>
</head>
<body>
	<a href="/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/about/contact.html">Contact us</a>
	all the time.
	
	<div id="host">
		<span
			><a href="/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/admissions/contact.html"
				>Contact us</a
			>
			from the light.</span
		>
	</div>
	
	<script>
		const host = document.getElementById('host')
		const shadowRoot = host.attachShadow({ mode: 'open' })
	
		shadowRoot.innerHTML =
			'<a href="/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/about/contact.html">Contact us</a> from the shadow.'
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
