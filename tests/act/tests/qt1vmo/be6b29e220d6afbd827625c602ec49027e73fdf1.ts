import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[qt1vmo]Image accessible name is descriptive", function () {
  it("Passed Example 1 (https://act-rules.github.io/testcases/qt1vmo/be6b29e220d6afbd827625c602ec49027e73fdf1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html> <html lang="en">
	<img src="/test-assets/shared/w3c-logo.png" alt="W3C" />
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
