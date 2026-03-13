import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bf051a]HTML page `lang` attribute has valid language tag", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bf051a/a49f11c86ad81c4d42700dfca58a7eeec377f02e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en-US-GB"></html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-lang-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});
