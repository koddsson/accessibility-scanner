import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import definitionList from "../src/rules/definition-list";

const scanner = new Scanner([definitionList]);

describe("definition-list", function () {
  describe("has errors if", function () {
    it("<dl> contains invalid direct child element", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term</dt>
          <dd>Definition</dd>
          <span>Invalid child</span>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dl> elements are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/definition-list",
        },
      ]);
    });

    it("<dl> contains paragraph element", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term</dt>
          <dd>Definition</dd>
          <p>Invalid paragraph</p>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dl> elements are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/definition-list",
        },
      ]);
    });

    it("<dl> contains multiple invalid elements", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term 1</dt>
          <span>Invalid span</span>
          <dd>Definition 1</dd>
          <p>Invalid paragraph</p>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dl> elements are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/definition-list",
        },
        {
          text: "Ensures <dl> elements are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/definition-list",
        },
      ]);
    });

    it("<dl> contains ul element", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term</dt>
          <dd>Definition</dd>
          <ul>
            <li>Invalid list</li>
          </ul>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dl> elements are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/definition-list",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("<dl> contains only dt and dd elements", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term 1</dt>
          <dd>Definition 1</dd>
          <dt>Term 2</dt>
          <dd>Definition 2</dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dl> contains dt, dd, and script elements", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term</dt>
          <dd>Definition</dd>
          <script>
            // Valid script tag
          </script>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dl> contains dt, dd, and template elements", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term</dt>
          <dd>Definition</dd>
          <template>
            <dt>Template term</dt>
            <dd>Template definition</dd>
          </template>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dl> contains dt, dd, and div elements", async () => {
      const container = await fixture(html`
        <dl>
          <div>
            <dt>Term 1</dt>
            <dd>Definition 1</dd>
          </div>
          <div>
            <dt>Term 2</dt>
            <dd>Definition 2</dd>
          </div>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dl> with multiple dt elements before dd", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term 1a</dt>
          <dt>Term 1b</dt>
          <dd>Definition 1</dd>
          <dt>Term 2</dt>
          <dd>Definition 2a</dd>
          <dd>Definition 2b</dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dl> with all valid elements mixed", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term 1</dt>
          <dd>Definition 1</dd>
          <script>
            // Script
          </script>
          <div>
            <dt>Term 2</dt>
            <dd>Definition 2</dd>
          </div>
          <template>
            <dt>Template term</dt>
          </template>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("empty <dl>", async () => {
      const container = await fixture(html`<dl></dl>`);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("multiple <dl> elements that are all valid", async () => {
      const container = await fixture(html`
        <div>
          <dl>
            <dt>Term 1</dt>
            <dd>Definition 1</dd>
          </dl>
          <dl>
            <dt>Term 2</dt>
            <dd>Definition 2</dd>
          </dl>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("nested elements inside dt and dd are allowed", async () => {
      const container = await fixture(html`
        <dl>
          <dt>
            <strong>Bold Term</strong>
          </dt>
          <dd>
            <p>Definition with paragraph</p>
            <ul>
              <li>List inside definition</li>
            </ul>
          </dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});
