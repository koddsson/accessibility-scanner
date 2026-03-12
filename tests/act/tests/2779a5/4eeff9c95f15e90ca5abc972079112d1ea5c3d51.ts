import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/4eeff9c95f15e90ca5abc972079112d1ea5c3d51.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<title> </title>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});
