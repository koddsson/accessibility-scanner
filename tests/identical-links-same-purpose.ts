import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import identicalLinksSamePurpose from "../src/rules/identical-links-same-purpose";

const scanner = new Scanner([identicalLinksSamePurpose]);

describe("identical-links-same-purpose", function () {
  describe("returns errors if", function () {
    it("two links have the same text but different hrefs", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page2">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Links with the same accessible name should have a similar purpose",
        url: "https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose",
      });
    });

    it("links with same aria-label but different hrefs", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1" aria-label="Read more">Link 1</a>
          <a href="/page2" aria-label="Read more">Link 2</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Links with the same accessible name should have a similar purpose",
        url: "https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose",
      });
    });

    it("multiple links with same text but different hrefs flags all duplicates", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page2">Click here</a>
          <a href="/page3">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
    });
  });

  describe("does not return errors if", function () {
    it("two links have the same text and same href", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page1">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("links have different text", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Go to page 1</a>
          <a href="/page2">Go to page 2</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("there is only a single link", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("there are no links", async () => {
      const element = await fixture(html`
        <div>
          <p>No links here</p>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});
