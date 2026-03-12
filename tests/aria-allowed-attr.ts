import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import { ariaAllowedAttr } from "../src/rules/aria-allowed-attr";

const scanner = new Scanner([ariaAllowedAttr]);

describe("aria-allowed-attr", function () {
  describe("has no errors if", function () {
    it("an HTML element has the document role", async () => {
      const container = await fixture(
        html`<div><span>no matching elements</span></div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("an element with a matching implicit role is present", async () => {
      const container = await fixture(html`<div><span>safe</span></div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("an <i> element is present without a matching role", async () => {
      const container = await fixture(html`<div><i>italic</i></div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "Elements must only use allowed ARIA attributes",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(html`<div><i>text</i></div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "aria-allowed-attr");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});
