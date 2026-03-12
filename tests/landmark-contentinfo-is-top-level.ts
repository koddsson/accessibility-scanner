import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkContentinfoIsTopLevel from "../src/rules/landmark-contentinfo-is-top-level";

const scanner = new Scanner([landmarkContentinfoIsTopLevel]);

describe("landmark-contentinfo-is-top-level", function () {
  describe("has errors if", function () {
    it("role=contentinfo is inside a main element", async () => {
      const container = await fixture(html`
        <main>
          <div role="contentinfo">Footer content</div>
        </main>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Contentinfo landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-contentinfo-is-top-level",
        },
      ]);
    });

    it("role=contentinfo is inside a nav element", async () => {
      const container = await fixture(html`
        <nav>
          <div role="contentinfo">Footer content</div>
        </nav>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Contentinfo landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-contentinfo-is-top-level",
        },
      ]);
    });

    it("role=contentinfo is inside a role=main landmark", async () => {
      const container = await fixture(html`
        <div role="main">
          <div role="contentinfo">Footer content</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Contentinfo landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-contentinfo-is-top-level",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("role=contentinfo is at the top level", async () => {
      const container = await fixture(html`
        <div role="contentinfo">Footer content</div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("no contentinfo elements are present", async () => {
      const container = await fixture(html`
        <div>
          <p>No contentinfo here</p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("role=contentinfo is inside another contentinfo", async () => {
      const container = await fixture(html`
        <footer>
          <div role="contentinfo">Nested footer content</div>
        </footer>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});
