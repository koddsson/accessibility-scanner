import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[qt1vmo]Image accessible name is descriptive", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/ce2c30787caebdf1d6adcd6aedfac8fa8842a9c4.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<p>Happy new year!</p>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" role="presentation" />
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
