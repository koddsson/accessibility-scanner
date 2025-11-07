import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import pAsHeading from "../src/rules/p-as-heading";

const scanner = new Scanner([pAsHeading]);

describe("p-as-heading", function () {
  describe("has errors if", function () {
    it("paragraph is bold with larger font size than next element", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 24px;">This looks like a heading</p>
          <p style="font-size: 16px;">This is normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure bold, italic text and font-size is not used to style <p> elements as a heading",
          url: "https://dequeuniversity.com/rules/axe/4.4/p-as-heading",
        },
      ]);
    });

    it("paragraph is italic with larger font size than next element", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-style: italic; font-size: 20px;">This looks like a heading</p>
          <p style="font-size: 14px;">This is normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure bold, italic text and font-size is not used to style <p> elements as a heading",
          url: "https://dequeuniversity.com/rules/axe/4.4/p-as-heading",
        },
      ]);
    });

    it("paragraph with font-weight 600 and larger font size", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: 600; font-size: 22px;">Heading-like paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure bold, italic text and font-size is not used to style <p> elements as a heading",
          url: "https://dequeuniversity.com/rules/axe/4.4/p-as-heading",
        },
      ]);
    });

    it("paragraph with 'bold' keyword and larger font size", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 22px;">Heading-like paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure bold, italic text and font-size is not used to style <p> elements as a heading",
          url: "https://dequeuniversity.com/rules/axe/4.4/p-as-heading",
        },
      ]);
    });

    it("multiple paragraphs styled as headings", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 24px;">First heading-like</p>
          <p style="font-size: 16px;">Normal text</p>
          <p style="font-weight: 700; font-size: 20px;">Second heading-like</p>
          <p style="font-size: 14px;">More normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results[0]).to.eql({
        text: "Ensure bold, italic text and font-size is not used to style <p> elements as a heading",
        url: "https://dequeuniversity.com/rules/axe/4.4/p-as-heading",
      });
    });
  });

  describe("has no errors if", function () {
    it("paragraph is bold but same font size as next element", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 16px;">Bold paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph has larger font size but is not bold or italic", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-size: 20px;">Larger paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph is italic with same or smaller font size", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-style: italic; font-size: 16px;">Italic paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("proper heading elements are used", async () => {
      const container = await fixture(html`
        <div>
          <h1>This is a heading</h1>
          <p>This is normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph is last element with no siblings", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 24px;">Last paragraph</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph is empty", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 24px;"></p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph is hidden", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: bold; font-size: 24px; display: none;">Hidden paragraph</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("paragraph with font-weight less than 600", async () => {
      const container = await fixture(html`
        <div>
          <p style="font-weight: 500; font-size: 24px;">Not bold enough</p>
          <p style="font-size: 16px;">Normal text</p>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});
