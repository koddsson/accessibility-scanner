import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import landmarkNoDuplicateBanner from "../src/rules/landmark-no-duplicate-banner";

const scanner = new Scanner([landmarkNoDuplicateBanner]);

const errorResult = {
  text: "Document should have at most one banner landmark",
  url: "https://dequeuniversity.com/rules/axe/4.11/landmark-no-duplicate-banner",
};

describe("landmark-no-duplicate-banner", function () {
  describe("passes when", function () {
    it("there is no header", async () => {
      const el = await fixture(html`<div><p>Hello</p></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("there is a single top-level header", async () => {
      const el = await fixture(
        html`<div><header>Banner</header><main>Content</main></div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("there is a single role=banner element", async () => {
      const el = await fixture(
        html`<div><div role="banner">Banner</div></div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("there is a top-level header and a header inside a section", async () => {
      const el = await fixture(
        html`<div>
          <header>Banner</header>
          <article><header>Article header</header></article>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("there are headers only inside sectioning elements", async () => {
      const el = await fixture(
        html`<div>
          <article><header>Article header</header></article>
          <section><header>Section header</header></section>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });
  });

  describe("fails when", function () {
    it("there are two top-level headers", async () => {
      const el = await fixture(
        html`<div>
          <header>First banner</header>
          <header>Second banner</header>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.eql([errorResult]);
    });

    it("there are two role=banner elements", async () => {
      const el = await fixture(
        html`<div>
          <div role="banner">First</div>
          <div role="banner">Second</div>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.eql([errorResult]);
    });

    it("there is a top-level header and a role=banner element", async () => {
      const el = await fixture(
        html`<div>
          <header>Banner</header>
          <div role="banner">Another banner</div>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.eql([errorResult]);
    });

    it("there are three top-level headers", async () => {
      const el = await fixture(
        html`<div>
          <header>First</header>
          <header>Second</header>
          <header>Third</header>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.eql([errorResult, errorResult]);
    });
  });
});
