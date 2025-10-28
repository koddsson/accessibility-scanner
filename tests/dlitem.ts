import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import dlitem from "../src/rules/dlitem";

const scanner = new Scanner([dlitem]);

describe("dlitem", function () {
  describe("has errors if", function () {
    it("<dd> element is not contained in a definition list", async () => {
      const container = await fixture(html`
        <div>
          <dd>Invalid definition</dd>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("<dt> element is not contained in a definition list", async () => {
      const container = await fixture(html`
        <div>
          <dt>Invalid term</dt>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("<dd> element is directly in body", async () => {
      const container = await fixture(html`<dd>Orphan definition</dd>`);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("<dt> element is directly in body", async () => {
      const container = await fixture(html`<dt>Orphan term</dt>`);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("element with role='definition' is not contained in a definition list", async () => {
      const container = await fixture(html`
        <div>
          <div role="definition">Invalid definition</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("element with role='term' is not contained in a definition list", async () => {
      const container = await fixture(html`
        <div>
          <div role="term">Invalid term</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });

    it("multiple <dd> and <dt> elements without proper parents", async () => {
      const container = await fixture(html`
        <div>
          <dt>First invalid term</dt>
          <dd>First invalid definition</dd>
          <dt>Second invalid term</dt>
          <dd>Second invalid definition</dd>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
        {
          text: "Ensures <dt> and <dd> elements are contained by a <dl>",
          url: "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("<dd> and <dt> elements are inside <dl>", async () => {
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

    it("elements with role='definition' and role='term' are inside element with role='list'", async () => {
      const container = await fixture(html`
        <div role="list">
          <div role="term">Term 1</div>
          <div role="definition">Definition 1</div>
          <div role="term">Term 2</div>
          <div role="definition">Definition 2</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dd> and <dt> elements are inside nested <dl>", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Main term</dt>
          <dd>
            Main definition
            <dl>
              <dt>Nested term</dt>
              <dd>Nested definition</dd>
            </dl>
          </dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<dd> and <dt> elements inside <dl> with other valid children", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Term 1</dt>
          <dd>Definition 1</dd>
          <script>
            // Script tag is allowed
          </script>
          <dt>Term 2</dt>
          <dd>Definition 2</dd>
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

    it("<dd> and <dt> elements inside role='list' with wrapper divs", async () => {
      const container = await fixture(html`
        <div role="list">
          <div>
            <div role="term">Deeply nested term</div>
            <div role="definition">Deeply nested definition</div>
          </div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("mixed semantic and ARIA definition list structures", async () => {
      const container = await fixture(html`
        <div>
          <dl>
            <dt>Semantic term</dt>
            <dd>Semantic definition</dd>
          </dl>
          <div role="list">
            <div role="term">ARIA term</div>
            <div role="definition">ARIA definition</div>
          </div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("multiple definitions for one term", async () => {
      const container = await fixture(html`
        <dl>
          <dt>Coffee</dt>
          <dd>Black hot drink</dd>
          <dd>Beverage made from roasted beans</dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("multiple terms for one definition", async () => {
      const container = await fixture(html`
        <dl>
          <dt>HTML</dt>
          <dt>HyperText Markup Language</dt>
          <dd>Standard markup language for web pages</dd>
        </dl>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});
