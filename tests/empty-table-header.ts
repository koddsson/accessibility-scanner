import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import emptyTableHeader from "../src/rules/empty-table-header";

const scanner = new Scanner([emptyTableHeader]);

describe("empty-table-header", function () {
  describe("has errors if", function () {
    it("th is empty", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th></th>
          </tr>
        </table>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Table headers must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.11/empty-table-header",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th></th>
          </tr>
        </table>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "empty-table-header");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });

    it("th has only whitespace", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th>   </th>
          </tr>
        </table>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Table headers must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.11/empty-table-header",
        },
      ]);
    });

    it("th has empty aria-label", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th aria-label=""></th>
          </tr>
        </table>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Table headers must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.11/empty-table-header",
        },
      ]);
    });

    it("th has aria-labelledby pointing to empty element", async () => {
      const container = await fixture(html`
        <div>
          <table>
            <tr>
              <th aria-labelledby="emptydiv"></th>
            </tr>
          </table>
          <div id="emptydiv"></div>
        </div>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Table headers must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.11/empty-table-header",
        },
      ]);
    });

    it("th has aria-labelledby pointing to nonexistent element", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th aria-labelledby="nonexistent"></th>
          </tr>
        </table>
      `);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Table headers must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.11/empty-table-header",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("th has text content", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </table>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("th has aria-label", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th aria-label="Name column"></th>
          </tr>
        </table>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("th has valid aria-labelledby", async () => {
      const container = await fixture(html`
        <div>
          <table>
            <tr>
              <th aria-labelledby="labeldiv"></th>
            </tr>
          </table>
          <div id="labeldiv">Header label</div>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("th has child element with text", async () => {
      const container = await fixture(html`
        <table>
          <tr>
            <th><span>Name</span></th>
          </tr>
        </table>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});
