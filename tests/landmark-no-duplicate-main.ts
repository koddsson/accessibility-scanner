import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkNoDuplicateMain from "../src/rules/landmark-no-duplicate-main";

const scanner = new Scanner([landmarkNoDuplicateMain]);

describe("landmark-no-duplicate-main", function () {
  describe("has no errors if", function () {
    it("there is a single main element", async () => {
      const container = await fixture(html`
        <div>
          <main>Content</main>
        </div>
      `);
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("there are no main elements", async () => {
      const container = await fixture(html`
        <div>
          <p>No main here</p>
        </div>
      `);
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("there is a single element with role=main", async () => {
      const container = await fixture(html`
        <div>
          <div role="main">Content</div>
        </div>
      `);
      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("there are two main elements", async () => {
      const container = await fixture(html`
        <div>
          <main>First</main>
          <main>Second</main>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Document should have at most one main landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-main",
        },
      ]);
    });

    it("there is a main element and an element with role=main", async () => {
      const container = await fixture(html`
        <div>
          <main>First</main>
          <div role="main">Second</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Document should have at most one main landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-main",
        },
      ]);
    });

    it("there are three main elements giving two errors", async () => {
      const container = await fixture(html`
        <div>
          <main>First</main>
          <main>Second</main>
          <main>Third</main>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results[0]).to.eql({
        text: "Document should have at most one main landmark",
        url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-main",
      });
      expect(results[1]).to.eql({
        text: "Document should have at most one main landmark",
        url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-main",
      });
    });
  });
});
