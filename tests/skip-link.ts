import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import skipLink from "../src/rules/skip-link";

const scanner = new Scanner([skipLink]);

describe("skip-link", function () {
  describe("has no errors if", function () {
    it("skip link has a valid target", async () => {
      const container = await fixture(html`
        <div>
          <a href="#main">Skip to main content</a>
          <div id="main">Main content here</div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("link with href='#' has no specific target", async () => {
      const container = await fixture(html`
        <div>
          <a href="#">Back to top</a>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("regular external links are present", async () => {
      const container = await fixture(html`
        <div>
          <a href="https://example.com">Example</a>
          <a href="/about">About</a>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("multiple skip links all have valid targets", async () => {
      const container = await fixture(html`
        <div>
          <a href="#nav">Skip to navigation</a>
          <a href="#main">Skip to main content</a>
          <nav id="nav">Navigation</nav>
          <main id="main">Main content</main>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("skip link target does not exist", async () => {
      const container = await fixture(html`
        <div>
          <a href="#nonexistent">Skip to content</a>
        </div>
      `);

      const results = (await scanner.scan(container)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Skip links must have a focusable target",
          url: "https://dequeuniversity.com/rules/axe/4.11/skip-link",
        },
      ]);
    });

    it("multiple skip links with some invalid targets", async () => {
      const container = await fixture(html`
        <div>
          <a href="#valid">Skip to valid</a>
          <a href="#invalid">Skip to invalid</a>
          <div id="valid">Valid target</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Skip links must have a focusable target",
          url: "https://dequeuniversity.com/rules/axe/4.11/skip-link",
        },
      ]);
    });
  });
});
