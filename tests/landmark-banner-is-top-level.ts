import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkBannerIsTopLevel from "../src/rules/landmark-banner-is-top-level";

const scanner = new Scanner([landmarkBannerIsTopLevel]);

describe("landmark-banner-is-top-level", function () {
  describe("has errors if", function () {
    it("role=banner is inside main", async () => {
      const container = await fixture(html`
        <main>
          <div role="banner">Banner inside main</div>
        </main>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Banner landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-banner-is-top-level",
        },
      ]);
    });

    it("role=banner is inside nav", async () => {
      const container = await fixture(html`
        <nav>
          <div role="banner">Banner inside nav</div>
        </nav>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Banner landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-banner-is-top-level",
        },
      ]);
    });

    it("role=banner is inside an element with role=navigation", async () => {
      const container = await fixture(html`
        <div role="navigation">
          <div role="banner">Banner inside navigation</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Banner landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-banner-is-top-level",
        },
      ]);
    });

    it("role=banner is inside aside", async () => {
      const container = await fixture(html`
        <aside>
          <div role="banner">Banner inside aside</div>
        </aside>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Banner landmark should be at top level",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-banner-is-top-level",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("role=banner is at top level", async () => {
      const container = await fixture(html`
        <div role="banner">Top-level banner</div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("role=banner is not nested inside a landmark", async () => {
      const container = await fixture(html`
        <div>
          <div role="banner">Banner in a regular div</div>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("no banner elements are present", async () => {
      const container = await fixture(html`
        <div>
          <p>No banner here</p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});
