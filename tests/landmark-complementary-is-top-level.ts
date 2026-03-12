import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkComplementaryIsTopLevel from "../src/rules/landmark-complementary-is-top-level";

const scanner = new Scanner([landmarkComplementaryIsTopLevel]);

describe("landmark-complementary-is-top-level", function () {
  describe("has errors if", function () {
    it("aside is inside main", async () => {
      const container = await fixture(
        html`<main><aside>Sidebar</aside></main>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Aside should not be contained in another landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-complementary-is-top-level",
        },
      ]);
    });

    it("role=complementary is inside nav", async () => {
      const container = await fixture(html`
        <nav>
          <div role="complementary">Sidebar</div>
        </nav>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Aside should not be contained in another landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-complementary-is-top-level",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("aside is at the top level", async () => {
      const container = await fixture(
        html`<aside>Sidebar content</aside>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("role=complementary is at the top level", async () => {
      const container = await fixture(
        html`<div role="complementary">Sidebar content</div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("no aside or complementary elements are present", async () => {
      const container = await fixture(html`
        <div>
          <p>No asides here</p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});
