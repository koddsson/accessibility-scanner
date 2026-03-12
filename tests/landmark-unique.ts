import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkUnique from "../src/rules/landmark-unique";

const scanner = new Scanner([landmarkUnique]);

describe("landmark-unique", function () {
  describe("has no errors if", function () {
    it("two navs have different aria-labels", async () => {
      const container = await fixture(html`
        <div>
          <nav aria-label="Primary">Links</nav>
          <nav aria-label="Secondary">More links</nav>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("a single nav is present", async () => {
      const container = await fixture(html`
        <div>
          <nav>Links</nav>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("two mains where one has a label", async () => {
      const container = await fixture(html`
        <div>
          <main>Content</main>
          <main aria-label="Secondary content">More content</main>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("landmarks of different roles without labels", async () => {
      const container = await fixture(html`
        <div>
          <nav>Links</nav>
          <main>Content</main>
          <aside>Sidebar</aside>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("two asides with different titles", async () => {
      const container = await fixture(html`
        <div>
          <aside title="Related articles">Articles</aside>
          <aside title="Advertisements">Ads</aside>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("two navs have no labels", async () => {
      const container = await fixture(html`
        <div>
          <nav>Links</nav>
          <nav>More links</nav>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results).to.eql([
        {
          text: "Landmarks must have a unique role or role/label/title combination",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-unique",
        },
      ]);
    });

    it("a nav and role=navigation both have no labels", async () => {
      const container = await fixture(html`
        <div>
          <nav>Links</nav>
          <div role="navigation">More links</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results).to.eql([
        {
          text: "Landmarks must have a unique role or role/label/title combination",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-unique",
        },
      ]);
    });

    it("two navs have the same aria-label", async () => {
      const container = await fixture(html`
        <div>
          <nav aria-label="Main">Links</nav>
          <nav aria-label="Main">More links</nav>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(1);
    });

    it("three asides have no labels", async () => {
      const container = await fixture(html`
        <div>
          <aside>One</aside>
          <aside>Two</aside>
          <aside>Three</aside>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });
  });
});
