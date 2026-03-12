import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import list from "../src/rules/list";

const scanner = new Scanner([list]);

describe("list", function () {
  describe("has no errors if", function () {
    it("a ul only contains li children", async () => {
      const container = await fixture(html`
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("an ol only contains li children", async () => {
      const container = await fixture(html`
        <ol>
          <li>Item 1</li>
          <li>Item 2</li>
        </ol>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("an ARIA list contains listitem children", async () => {
      const container = await fixture(html`
        <div role="list">
          <div role="listitem">Item 1</div>
          <div role="listitem">Item 2</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("a ul contains non-li direct children", async () => {
      const container = await fixture(html`
        <ul>
          <div>Not a list item</div>
        </ul>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "Ensures that lists are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.11/list",
        },
      ]);
    });

    it("an ARIA list has no listitem children and no aria-owns", async () => {
      const container = await fixture(html`
        <div role="list">
          <div>Not a listitem</div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "Ensures that lists are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.11/list",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(html`
        <ul>
          <span>Bad child</span>
        </ul>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "list");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});
