import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[5c01ea]ARIA state or property is permitted", function () {
  afterEach(cleanup);

  it("Passed Example 12 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/5f9eefc34edefab96f156894ecbd1c0b5781045d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 12</title>
</head>
<body>
	<div role="switch" aria-checked="false" tabindex="0" aria-required="true">
		<span class="label">Notifications</span>
		<span
			class="switch"
			style="position: relative; display: inline-block; top: 6px; border: 2px solid black; border-radius: 12px; height: 20px; width: 40px;"
		>
			<span
				style="position: absolute; top: 2px; left: 2px; display: inline-block; border: 2px solid black; border-radius: 8px; height: 12px; width: 12px; background: black;"
			></span>
		</span>
		<span class="on" aria-hidden="true" style="display: none;">On</span>
		<span class="off" aria-hidden="true">Off</span>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});
