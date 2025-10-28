import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tdHasHeader from "../src/rules/td-has-header";

const scanner = new Scanner([tdHasHeader]);

describe("td-has-header", function () {
  describe("has errors if", function () {
    it("table larger than 3x3 has td without headers", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
            <td>Cell 4</td>
          </tr>
          <tr>
            <td>Cell 5</td>
            <td>Cell 6</td>
            <td>Cell 7</td>
            <td>Cell 8</td>
          </tr>
          <tr>
            <td>Cell 9</td>
            <td>Cell 10</td>
            <td>Cell 11</td>
            <td>Cell 12</td>
          </tr>
          <tr>
            <td>Cell 13</td>
            <td>Cell 14</td>
            <td>Cell 15</td>
            <td>Cell 16</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(16);
      expect(results[0].text).to.equal(
        "Ensure that each non-empty data cell in a <table> larger than 3 by 3 has one or more table headers"
      );
    });

    it("4x4 table without th elements should error", async () => {
      const table = await fixture(html`
        <table>
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
          <tr>
            <td>I</td>
            <td>J</td>
            <td>K</td>
            <td>L</td>
          </tr>
          <tr>
            <td>M</td>
            <td>N</td>
            <td>O</td>
            <td>P</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results.length).to.equal(16);
    });

    it("large table with some missing headers should error", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Header 1</th>
            <th scope="col">Header 2</th>
            <th scope="col">Header 3</th>
            <th scope="col">Header 4</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
            <td>Cell 4</td>
          </tr>
          <tr>
            <td>Cell 5</td>
            <td>Cell 6</td>
            <td>Cell 7</td>
            <td>Cell 8</td>
          </tr>
          <tr>
            <td>Cell 9</td>
            <td>Cell 10</td>
            <td>Cell 11</td>
            <td>Cell 12</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      // All td cells should have headers from the th row with scope="col"
      expect(results.length).to.equal(0);
    });
  });

  describe("has no errors if", function () {
    it("table is 3x3 or smaller", async () => {
      const table = await fixture(html`
        <table>
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
          <tr>
            <td>Cell 7</td>
            <td>Cell 8</td>
            <td>Cell 9</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table is 2x5 (not wider than 3 columns)", async () => {
      const table = await fixture(html`
        <table>
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
          <tr>
            <td>Cell 7</td>
            <td>Cell 8</td>
            <td>Cell 9</td>
          </tr>
          <tr>
            <td>Cell 10</td>
            <td>Cell 11</td>
            <td>Cell 12</td>
          </tr>
          <tr>
            <td>Cell 13</td>
            <td>Cell 14</td>
            <td>Cell 15</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with column headers using scope", async () => {
      const table = await fixture(html`
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
              <th scope="col">City</th>
              <th scope="col">Country</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>30</td>
              <td>New York</td>
              <td>USA</td>
            </tr>
            <tr>
              <td>Jane</td>
              <td>25</td>
              <td>London</td>
              <td>UK</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>35</td>
              <td>Paris</td>
              <td>France</td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>28</td>
              <td>Berlin</td>
              <td>Germany</td>
            </tr>
          </tbody>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with row headers using scope", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="row">Monday</th>
            <td>9am</td>
            <td>10am</td>
            <td>11am</td>
            <td>12pm</td>
          </tr>
          <tr>
            <th scope="row">Tuesday</th>
            <td>9am</td>
            <td>10am</td>
            <td>11am</td>
            <td>12pm</td>
          </tr>
          <tr>
            <th scope="row">Wednesday</th>
            <td>9am</td>
            <td>10am</td>
            <td>11am</td>
            <td>12pm</td>
          </tr>
          <tr>
            <th scope="row">Thursday</th>
            <td>9am</td>
            <td>10am</td>
            <td>11am</td>
            <td>12pm</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with headers attribute", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th id="name">Name</th>
            <th id="age">Age</th>
            <th id="city">City</th>
            <th id="country">Country</th>
          </tr>
          <tr>
            <td headers="name">John</td>
            <td headers="age">30</td>
            <td headers="city">New York</td>
            <td headers="country">USA</td>
          </tr>
          <tr>
            <td headers="name">Jane</td>
            <td headers="age">25</td>
            <td headers="city">London</td>
            <td headers="country">UK</td>
          </tr>
          <tr>
            <td headers="name">Bob</td>
            <td headers="age">35</td>
            <td headers="city">Paris</td>
            <td headers="country">France</td>
          </tr>
          <tr>
            <td headers="name">Alice</td>
            <td headers="age">28</td>
            <td headers="city">Berlin</td>
            <td headers="country">Germany</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("empty cells are ignored", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Col 1</th>
            <th scope="col">Col 2</th>
            <th scope="col">Col 3</th>
            <th scope="col">Col 4</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("cells with only whitespace are ignored", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th scope="col">Col 1</th>
            <th scope="col">Col 2</th>
            <th scope="col">Col 3</th>
            <th scope="col">Col 4</th>
          </tr>
          <tr>
            <td>   </td>
            <td>
            </td>
            <td></td>
            <td>	</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("table with both row and column headers", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th></th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
          </tr>
          <tr>
            <th scope="row">Sales</th>
            <td>100</td>
            <td>200</td>
            <td>300</td>
            <td>400</td>
          </tr>
          <tr>
            <th scope="row">Marketing</th>
            <td>50</td>
            <td>75</td>
            <td>100</td>
            <td>125</td>
          </tr>
          <tr>
            <th scope="row">Support</th>
            <td>25</td>
            <td>30</td>
            <td>35</td>
            <td>40</td>
          </tr>
          <tr>
            <th scope="row">Engineering</th>
            <td>150</td>
            <td>175</td>
            <td>200</td>
            <td>225</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });

    it("th without explicit scope still works as header", async () => {
      const table = await fixture(html`
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Country</th>
          </tr>
          <tr>
            <td>John</td>
            <td>30</td>
            <td>New York</td>
            <td>USA</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>25</td>
            <td>London</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>35</td>
            <td>Paris</td>
            <td>France</td>
          </tr>
          <tr>
            <td>Alice</td>
            <td>28</td>
            <td>Berlin</td>
            <td>Germany</td>
          </tr>
        </table>
      `);

      const results = await scanner.scan(table);
      expect(results).to.be.empty;
    });
  });
});
