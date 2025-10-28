import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import linkInTextBlock from "../src/rules/link-in-text-block";

const scanner = new Scanner([linkInTextBlock]);

describe("link-in-text-block", function () {
  describe("has errors if", function () {
    it("link in text block has no distinguishing features", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="text-decoration: none;">link</a> that relies only
          on color.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Links must be distinguished from surrounding text in a way that does not rely on color",
      );
    });

    it("link in a paragraph without text decoration", async () => {
      const container = await fixture(html`
        <div>
          <p style="color: black;">
            Here is a long paragraph of text that contains a
            <a
              href="#test"
              style="color: blue; text-decoration: none; font-weight: normal;"
              >link to something</a
            >
            and the link is only distinguished by its color which is not
            sufficient for accessibility.
          </p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("multiple links in text block without distinguishing features", async () => {
      const container = await fixture(html`
        <article>
          <p>
            This paragraph has
            <a href="#1" style="text-decoration: none;">first link</a> and
            <a href="#2" style="text-decoration: none;">second link</a> both
            without distinguishing features.
          </p>
        </article>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });
  });

  describe("has no errors if", function () {
    it("link has underline text decoration", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="text-decoration: underline;">link</a> that has
          underline.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link has default underline (no override)", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a <a href="#">link</a> with default styling.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is bold (font-weight)", async () => {
      const container = await fixture(html`
        <p style="font-weight: normal;">
          This is some text with a
          <a href="#" style="text-decoration: none; font-weight: bold;">link</a>
          that is bold.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is italic", async () => {
      const container = await fixture(html`
        <p style="font-style: normal;">
          This is some text with a
          <a href="#" style="text-decoration: none; font-style: italic;"
            >link</a
          >
          that is italic.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link has border", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a
            href="#"
            style="text-decoration: none; border-bottom: 1px solid black;"
            >link</a
          >
          that has a border.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is not in a text block", async () => {
      const container = await fixture(html`
        <div>
          <a href="#" style="text-decoration: none;">Standalone link</a>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is the only content in a block", async () => {
      const container = await fixture(html`
        <p>
          <a href="#" style="text-decoration: none;">Only link</a>
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link has no text content", async () => {
      const container = await fixture(html`
        <p>
          This is some text with an
          <a href="#" style="text-decoration: none;"></a> empty link.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is hidden", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="display: none; text-decoration: none;">link</a>
          that is hidden.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link has visibility hidden", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="visibility: hidden; text-decoration: none;"
            >link</a
          >
          that is not visible.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link with overline decoration", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="text-decoration: overline;">link</a> that has
          overline.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link with line-through decoration", async () => {
      const container = await fixture(html`
        <p>
          This is some text with a
          <a href="#" style="text-decoration: line-through;">link</a> that has
          line-through.
        </p>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link in a list item", async () => {
      const container = await fixture(html`
        <ul>
          <li>
            <a href="#" style="text-decoration: none;">List item link</a>
          </li>
        </ul>
      `);
      const results = await scanner.scan(container);

      // List item link without surrounding text should not error
      expect(results).to.be.empty;
    });
  });
});
