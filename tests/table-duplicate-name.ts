import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tableDuplicateName from "../src/rules/table-duplicate-name";

const scanner = new Scanner([tableDuplicateName]);

describe("table-duplicate-name", function () {
  describe("has errors if", function () {
    it("table has matching caption and summary", async () => {
      const table = await fixture(html`
        <table summary="Sales Data">
          <caption>
            Sales Data
          </caption>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
      expect(results[0].text).to.equal(
        "tables should not have the same summary and caption",
      );
    });

    it("table has matching caption and summary with extra whitespace", async () => {
      const table = await fixture(html`
        <table summary="Monthly Report">
          <caption>
            Monthly Report
          </caption>
          <tr>
            <td>Cell 1</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(1);
    });
  });

  describe("has no errors if", function () {
    it("table has different caption and summary", async () => {
      const table = await fixture(html`
        <table summary="Summary of sales data">
          <caption>
            Sales Data
          </caption>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table has no summary attribute", async () => {
      const table = await fixture(html`
        <table>
          <caption>
            Sales Data
          </caption>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table has no caption element", async () => {
      const table = await fixture(html`
        <table summary="Sales Data">
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table has neither caption nor summary", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table has empty summary attribute", async () => {
      const table = await fixture(html`
        <table summary="">
          <caption>
            Sales Data
          </caption>
          <tr>
            <td>Cell 1</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });
  });
});
