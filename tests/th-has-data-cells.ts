import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import thHasDataCells from "../src/rules/th-has-data-cells";

const scanner = new Scanner([thHasDataCells]);

describe("th-has-data-cells", function () {
  describe("has no errors if", function () {
    it("column header has data cells below", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Name</th>
          </tr>
          <tr>
            <td>John</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("row header has data cells in row", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="row">Monday</th>
            <td>9am</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("th with headers attribute reference", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="name">Name</th>
          </tr>
          <tr>
            <td headers="name">John</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with only headers is skipped", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("role=columnheader with data cells", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="columnheader">Name</div>
          </div>
          <div role="row">
            <div role="cell">John</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("table with no data cells is skipped", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="columnheader">Header 1</div>
            <div role="columnheader">Header 2</div>
          </div>
          <div role="row">
            <div role="columnheader">Header 3</div>
            <div role="columnheader">Header 4</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("column header has no data cells in column", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Empty</th>
          </tr>
          <tr>
            <td>John</td>
            <th scope="col">Bad</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(2);
    });

    it("row header has no data cells in row", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="row">Monday</th>
            <td>9am</td>
          </tr>
          <tr>
            <th scope="row">Bad</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });

    it("th in column with no data cells", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="header1">Header 1</th>
            <th id="header2">Header 2</th>
          </tr>
          <tr>
            <td headers="header1">Data 1</td>
            <th>Not a data cell</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      // header2 has no data cells in its column
      expect(results.length).to.equal(1);
    });
  });
});
