import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner.js";
import decorativeImage from "../src/rules/decorative-image.js";

const scanner = new Scanner([decorativeImage]);

describe("decorative-image", function () {
  it("passes an image with an empty alt", async () => {
    const container = await fixture(html`<div><img src="a.png" alt="" /></div>`);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("passes an image that is exposed with a text alternative", async () => {
    const container = await fixture(
      html`<div><img src="a.png" alt="Company logo" /></div>`,
    );

    expect(await scanner.scan(container)).to.be.empty;
  });

  for (const hidden of [
    html`<div><img src="a.png" role="none" alt="Company logo" /></div>`,
    html`<div><img src="a.png" aria-hidden="true" alt="Company logo" /></div>`,
    html`<div><img src="a.png" alt="" title="Company logo" /></div>`,
  ]) {
    it("flags a hidden image that still describes itself for review", async () => {
      const container = await fixture(hidden);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].needsReview).to.be.true;
      expect(results[0].url).to.equal(
        "https://dequeuniversity.com/rules/axe/4.11/decorative-image",
      );
    });
  }
});
