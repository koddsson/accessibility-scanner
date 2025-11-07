import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import accesskeys from "../src/rules/accesskeys";

const scanner = new Scanner([accesskeys]);

describe("accesskeys", function () {
  describe("returns errors if", function () {
    it("two elements have the same accesskey", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey="a">Button 1</button>
          <button accesskey="a">Button 2</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results[0]).to.eql({
        text: "Ensures every accesskey attribute value is unique",
        url: "https://dequeuniversity.com/rules/axe/4.4/accesskeys",
      });
      expect(results[1]).to.eql({
        text: "Ensures every accesskey attribute value is unique",
        url: "https://dequeuniversity.com/rules/axe/4.4/accesskeys",
      });
    });

    it("multiple elements have the same accesskey", async () => {
      const element = await fixture(html`
        <div>
          <a href="#" accesskey="s">Link 1</a>
          <a href="#" accesskey="s">Link 2</a>
          <button accesskey="s">Button</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(3);
    });

    it("accesskeys with whitespace are treated as duplicates", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey=" a ">Button 1</button>
          <button accesskey="a">Button 2</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
    });

    it("detects duplicates in different element types", async () => {
      const element = await fixture(html`
        <div>
          <input type="text" accesskey="x" />
          <textarea accesskey="x"></textarea>
          <select accesskey="x">
            <option>Option</option>
          </select>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(3);
    });
  });

  describe("does not return errors if", function () {
    it("all accesskeys are unique", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey="a">Button 1</button>
          <button accesskey="b">Button 2</button>
          <button accesskey="c">Button 3</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("there are no elements with accesskey", async () => {
      const element = await fixture(html`
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <a href="#">Link</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("only one element has an accesskey", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey="a">Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("accesskeys are empty strings", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey="">Button 1</button>
          <button accesskey="  ">Button 2</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("accesskeys are case-sensitive and different", async () => {
      const element = await fixture(html`
        <div>
          <button accesskey="a">Button 1</button>
          <button accesskey="A">Button 2</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});
