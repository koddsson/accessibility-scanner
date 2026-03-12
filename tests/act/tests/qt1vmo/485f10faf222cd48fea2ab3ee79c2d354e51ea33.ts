import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/485f10faf222cd48fea2ab3ee79c2d354e51ea33.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="ERCIM logo" />
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
