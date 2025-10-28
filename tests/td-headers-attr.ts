import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tdHeadersAttr from "../src/rules/td-headers-attr";

const scanner = new Scanner([tdHeadersAttr]);

describe("td-headers-attr", function () {
  describe("has errors if", function () {
    it("td references header outside of its table", async () => {
      const container = await fixture(html`
        <div>
          <table id="table1">
            <tr>
              <th id="header1">Header 1</th>
              <td>Cell 1</td>
            </tr>
          </table>
          <table id="table2">
            <tr>
              <th id="header2">Header 2</th>
              <td headers="header1">Cell 2</td>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
      expect(results[0].text).to.equal(
        "Ensure that each cell in a table that uses the headers attribute refers only to other cells in that table"
      );
    });

    it("headers attribute references non-existent ID", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="col1">Column 1</th>
            <th id="col2">Column 2</th>
          </tr>
          <tr>
            <td headers="nonexistent">Data 1</td>
            <td headers="col2">Data 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });

    it("headers attribute references element that is not a table cell", async () => {
      const container = await fixture(html`
        <div>
          <div id="notacell">Not a cell</div>
          <table>
            <tr>
              <th id="header1">Header 1</th>
              <td headers="notacell">Data 1</td>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
    });

    it("multiple headers with one invalid reference", async () => {
      const container = await fixture(html`
        <div>
          <table id="table1">
            <tr>
              <th id="header1">Header 1</th>
              <th id="header2">Header 2</th>
            </tr>
            <tr>
              <td headers="header1 header2">Valid</td>
              <td headers="header1 invalid">Invalid</td>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
    });

    it("th element with invalid headers attribute", async () => {
      const container = await fixture(html`
        <div>
          <table id="table1">
            <tr>
              <th id="header1">Header 1</th>
            </tr>
          </table>
          <table id="table2">
            <tr>
              <th headers="header1">Header 2</th>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
    });
  });

  describe("has no errors if", function () {
    it("headers attribute references valid cells in same table", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="col1">Column 1</th>
            <th id="col2">Column 2</th>
          </tr>
          <tr>
            <td headers="col1">Data 1</td>
            <td headers="col2">Data 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("headers attribute with multiple valid references", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="col1">Column 1</th>
            <th id="col2">Column 2</th>
            <th id="row1">Row 1</th>
          </tr>
          <tr>
            <td headers="col1 row1">Data 1</td>
            <td headers="col2 row1">Data 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("cell without headers attribute", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("empty headers attribute is ignored", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="header1">Header 1</th>
          </tr>
          <tr>
            <td headers="">Data 1</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("headers attribute with only whitespace is ignored", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="header1">Header 1</th>
          </tr>
          <tr>
            <td headers="   ">Data 1</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("complex table with valid headers attribute", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="corner"></th>
            <th id="q1">Q1</th>
            <th id="q2">Q2</th>
            <th id="q3">Q3</th>
          </tr>
          <tr>
            <th id="sales">Sales</th>
            <td headers="sales q1">100</td>
            <td headers="sales q2">200</td>
            <td headers="sales q3">300</td>
          </tr>
          <tr>
            <th id="marketing">Marketing</th>
            <td headers="marketing q1">50</td>
            <td headers="marketing q2">75</td>
            <td headers="marketing q3">100</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("nested tables with separate header references", async () => {
      const container = await fixture(html`
        <div>
          <table>
            <tr>
              <th id="outer-header">Outer</th>
              <td headers="outer-header">
                <table>
                  <tr>
                    <th id="inner-header">Inner</th>
                    <td headers="inner-header">Inner data</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("non-table element with headers attribute is ignored", async () => {
      const container = await fixture(html`
        <div>
          <div headers="something">Not a table cell</div>
          <table>
            <tr>
              <th id="header1">Header</th>
              <td headers="header1">Data</td>
            </tr>
          </table>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });
});
