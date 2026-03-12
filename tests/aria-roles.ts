import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaRoles from "../src/rules/aria-roles";

const scanner = new Scanner([ariaRoles]);

describe("aria-roles", function () {
  describe("has no errors if", function () {
    it("elements use valid landmark roles", async () => {
      const container = await fixture(html`
        <div>
          <div role="banner">Banner</div>
          <div role="navigation">Nav</div>
          <div role="main">Main</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("elements have no role attribute", async () => {
      const container = await fixture(
        html`<div><span>No role</span></div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("an element has an invalid role", async () => {
      const container = await fixture(
        html`<div><span role="foobar">Invalid</span></div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "ARIA roles used must conform to valid values",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-roles",
        },
      ]);
    });

    it("an element has an empty role attribute", async () => {
      const container = await fixture(
        html`<div><span role="">Empty role</span></div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "ARIA roles used must conform to valid values",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-roles",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(
        html`<div><span role="invalid">Bad</span></div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "aria-roles");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});
