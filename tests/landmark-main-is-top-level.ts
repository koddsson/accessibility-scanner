import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkMainIsTopLevel from "../src/rules/landmark-main-is-top-level";

const scanner = new Scanner([landmarkMainIsTopLevel]);

describe("landmark-main-is-top-level", function () {
  describe("has errors if", function () {
    it("main is nested inside aside", async () => {
      const container = await fixture(html`
        <aside>
          <main>Content</main>
        </aside>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Main landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-main-is-top-level",
        },
      ]);
    });

    it("role=main is nested inside nav", async () => {
      const container = await fixture(html`
        <nav>
          <div role="main">Content</div>
        </nav>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Main landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-main-is-top-level",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("main is at top level", async () => {
      const container = await fixture(html`
        <div>
          <main>Content</main>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("role=main is at top level", async () => {
      const container = await fixture(html`
        <div>
          <div role="main">Content</div>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("no main elements are present", async () => {
      const container = await fixture(html`
        <div>
          <p>No main here</p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});
