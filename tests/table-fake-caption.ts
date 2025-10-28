import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tableFakeCaption from "../src/rules/table-fake-caption";

const scanner = new Scanner([tableFakeCaption]);

describe("table-fake-caption", function () {
  describe("has errors if", function () {
    it("table has first row with single cell spanning all columns", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td colspan="3">This is a fake caption</td>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
          <tr>
            <td>Cell 4</td>
            <td>Cell 5</td>
            <td>Cell 6</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
      expect(results[0].text).to.equal(
        "Ensure that tables with a caption use the <caption> element."
      );
    });

    it("table with th cell as fake caption", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th colspan="4">Table Title</th>
          </tr>
          <tr>
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
          </tr>
          <tr>
            <td>E</td>
            <td>F</td>
            <td>G</td>
            <td>H</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });

    it("table with implicit colspan matching table width", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td colspan="2">Fake Caption</td>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });

    it("table with very large colspan as fake caption", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td colspan="10">This spans many columns</td>
          </tr>
          <tr>
            <td>A</td>
            <td>B</td>
          </tr>
          <tr>
            <td>C</td>
            <td>D</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });
  });

  describe("has no errors if", function () {
    it("table has proper caption element", async () => {
      const table = await fixture(html`
        <table>
          <caption>This is a proper caption</caption>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
          <tr>
            <td>Cell 4</td>
            <td>Cell 5</td>
            <td>Cell 6</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with first row having multiple cells", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
          <tr>
            <td>Cell 4</td>
            <td>Cell 5</td>
            <td>Cell 6</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("single column table", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td>Row 1</td>
          </tr>
          <tr>
            <td>Row 2</td>
          </tr>
          <tr>
            <td>Row 3</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with first cell not spanning full width", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td colspan="2">Partial span</td>
            <td>Cell</td>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with caption and first row spanning", async () => {
      const table = await fixture(html`
        <table>
          <caption>Proper Caption</caption>
          <tr>
            <td colspan="3">This is OK because there's already a caption</td>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("empty table", async () => {
      const table = await fixture(html`<table></table>`);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with only one row", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td colspan="3">Only Row</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with varying column counts", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });
  });
});
