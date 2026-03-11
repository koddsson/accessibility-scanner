import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkNoDuplicateContentinfo from "../src/rules/landmark-no-duplicate-contentinfo";

const scanner = new Scanner([landmarkNoDuplicateContentinfo]);

describe("landmark-no-duplicate-contentinfo", function () {
  describe("has no errors if", function () {
    it("there is a single top-level footer", async () => {
      const element = await fixture(html`
        <div>
          <footer>Footer content</footer>
        </div>
      `);

      const results = await scanner.scan(element);
      expect(results).to.be.empty;
    });

    it("a footer is inside an article and another is top-level", async () => {
      const element = await fixture(html`
        <div>
          <article>
            <footer>Article footer</footer>
          </article>
          <footer>Page footer</footer>
        </div>
      `);

      const results = await scanner.scan(element);
      expect(results).to.be.empty;
    });

    it("there are no footers or contentinfo landmarks", async () => {
      const element = await fixture(html`
        <div>
          <p>No footers here</p>
        </div>
      `);

      const results = await scanner.scan(element);
      expect(results).to.be.empty;
    });

    it("a single element has role=contentinfo", async () => {
      const element = await fixture(html`
        <div>
          <div role="contentinfo">Content info</div>
        </div>
      `);

      const results = await scanner.scan(element);
      expect(results).to.be.empty;
    });

    it("footer is inside a section element", async () => {
      const element = await fixture(html`
        <div>
          <section>
            <footer>Section footer</footer>
          </section>
          <footer>Page footer</footer>
        </div>
      `);

      const results = await scanner.scan(element);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("there are two top-level footers", async () => {
      const element = await fixture(html`
        <div>
          <footer>First footer</footer>
          <footer>Second footer</footer>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Document should have at most one contentinfo landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-contentinfo",
        },
      ]);
    });

    it("there are two elements with role=contentinfo", async () => {
      const element = await fixture(html`
        <div>
          <div role="contentinfo">First</div>
          <div role="contentinfo">Second</div>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Document should have at most one contentinfo landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-contentinfo",
        },
      ]);
    });

    it("there is a top-level footer and an element with role=contentinfo", async () => {
      const element = await fixture(html`
        <div>
          <footer>Footer</footer>
          <div role="contentinfo">Content info</div>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Document should have at most one contentinfo landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-contentinfo",
        },
      ]);
    });
  });
});
