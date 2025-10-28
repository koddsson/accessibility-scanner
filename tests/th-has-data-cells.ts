import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import thHasDataCells from "../src/rules/th-has-data-cells";

const scanner = new Scanner([thHasDataCells]);

describe("th-has-data-cells", function () {
  describe("has errors if", function () {
    it("th element has no data cells but table has other data cells", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Data</td>
            <th>Header 3</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      // Header 2 and Header 3 don't have data cells they describe
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal(
        "Ensure that <th> elements and elements with role=columnheader/rowheader have data cells they describe"
      );
    });

    it("column header has no data cells below it", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(2);
    });

    it("row header has no data cells in the row", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="row">Monday</th>
          </tr>
          <tr>
            <th scope="row">Tuesday</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(2);
    });

    it("th with id but no cells reference it", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="header1">Header</th>
          </tr>
          <tr>
            <td>Data</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      // The th should have data cells in the same column
      expect(results.length).to.equal(0);
    });

    it("element with role=columnheader has no data cells", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="columnheader">Header</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
    });

    it("element with role=rowheader has no data cells", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="rowheader">Header</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results.length).to.equal(1);
    });
  });

  describe("has no errors if", function () {
    it("table with only headers (no data cells) is not flagged", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("column header has data cells below", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
          </tr>
          <tr>
            <td>John</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>25</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("row header has data cells in the row", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="row">Monday</th>
            <td>9am</td>
            <td>10am</td>
          </tr>
          <tr>
            <th scope="row">Tuesday</th>
            <td>9am</td>
            <td>10am</td>
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
            <th id="age">Age</th>
          </tr>
          <tr>
            <td headers="name">John</td>
            <td headers="age">30</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("th without scope in first row acts as column header", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
          <tr>
            <td>John</td>
            <td>30</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("th without scope in first column acts as row header", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Monday</th>
            <td>9am</td>
            <td>10am</td>
          </tr>
          <tr>
            <th>Tuesday</th>
            <td>9am</td>
            <td>10am</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("complex table with both row and column headers", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th></th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
          </tr>
          <tr>
            <th scope="row">Sales</th>
            <td>100</td>
            <td>200</td>
            <td>300</td>
          </tr>
          <tr>
            <th scope="row">Marketing</th>
            <td>50</td>
            <td>75</td>
            <td>100</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      // The empty th in corner should fail
      expect(results.length).to.equal(1);
    });

    it("element with role=columnheader has data cells", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="columnheader">Name</div>
            <div role="columnheader">Age</div>
          </div>
          <div role="row">
            <div role="cell">John</div>
            <div role="cell">30</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("element with role=rowheader has data cells", async () => {
      const container = await fixture(html`
        <div role="table">
          <div role="row">
            <div role="rowheader">Monday</div>
            <div role="cell">9am</div>
            <div role="cell">10am</div>
          </div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("hidden headers are skipped", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th aria-hidden="true">Hidden</th>
            <th>Visible</th>
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

    it("table with colgroup scope", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="colgroup" colspan="2">Group 1</th>
            <th scope="colgroup" colspan="2">Group 2</th>
          </tr>
          <tr>
            <th scope="col">A</th>
            <th scope="col">B</th>
            <th scope="col">C</th>
            <th scope="col">D</th>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with rowgroup scope", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="rowgroup" rowspan="2">Group 1</th>
            <th scope="row">A</th>
            <td>1</td>
            <td>2</td>
          </tr>
          <tr>
            <th scope="row">B</th>
            <td>3</td>
            <td>4</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });
  });
});
