import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner.js";
import { ariaAllowedAttr } from "../src/rules/aria-allowed-attr.js";

const scanner = new Scanner([ariaAllowedAttr]);

describe("aria-allowed-attr", function () {
  describe("has no errors if", function () {
    it("elements have no ARIA attributes", async () => {
      const container = await fixture(
        html`<div><button>Click</button></div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("a presentational role is ignored on a focusable element", async () => {
      const container = await fixture(
        html`<div><button role="none" aria-pressed="false">Toggle</button></div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("aria-required is used on a switch", async () => {
      const container = await fixture(
        html`<div>
          <div role="switch" aria-checked="false" aria-required="true">On</div>
        </div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("a role-specific ARIA attribute is used on an allowed role", async () => {
      const container = await fixture(
        html`<div role="checkbox" aria-checked="true">Check</div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("a global ARIA attribute is used on any element", async () => {
      const container = await fixture(
        html`<div aria-label="description">Content</div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("a role-specific ARIA attribute is used on an element without a role", async () => {
      const container = await fixture(
        html`<div><audio controls aria-orientation="horizontal"></audio></div>`,
      );
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

    it("a role-specific ARIA attribute is used on a disallowed role", async () => {
      const container = await fixture(
        html`<div><span aria-checked="true">Not a checkbox</span></div>`,
      );
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
      const container = await fixture(
        html`<div><p aria-sort="ascending">text</p></div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "aria-allowed-attr");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});
