import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bf051a]HTML page `lang` attribute has valid language tag", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bf051a/7d8c4fd028c504d10c4e5e9bd7183c139549e1a1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="FR"></html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-lang-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
