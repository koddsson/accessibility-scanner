import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bf051a]HTML page `lang` attribute has valid language tag", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bf051a/5c998eef8cb13a8f577dade1a3b9fe591bc69204.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="#1"></html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-lang-valid"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});
