import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Inapplicable Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/2e1787fbc8a76fd8a2f8cae08d72097dab75abfd.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C logo" style="display:none" />
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});
