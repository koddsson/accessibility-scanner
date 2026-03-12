import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import { ariaHiddenBody } from "../src/rules/aria-hidden-body";

const scanner = new Scanner([ariaHiddenBody]);

describe("aria-hidden-body", function () {
  describe("has no errors if", function () {
    it("the body does not have aria-hidden", async () => {
      const container = await fixture(html`<div>Content</div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("the body has aria-hidden set to false", async () => {
      document.body.setAttribute("aria-hidden", "false");
      const container = await fixture(html`<div>Content</div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
      document.body.removeAttribute("aria-hidden");
    });
  });

  describe("has errors if", function () {
    it("the body has aria-hidden set to true", async () => {
      document.body.setAttribute("aria-hidden", "true");
      const container = await fixture(html`<div>Content</div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: 'aria-hidden="true" must not be present on the document <body>',
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-hidden-body",
        },
      ]);
      document.body.removeAttribute("aria-hidden");
    });

    it("includes id in errors", async () => {
      document.body.setAttribute("aria-hidden", "true");
      const container = await fixture(html`<div>Content</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "aria-hidden-body");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
      document.body.removeAttribute("aria-hidden");
    });
  });
});
