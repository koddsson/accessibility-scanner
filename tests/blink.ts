import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import blink from "../src/rules/blink";

const scanner = new Scanner([blink]);

describe("blink", function () {
  it("returns errors if a blink element is present", async () => {
    const element = await fixture(html` <blink>Blinking text</blink> `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure <blink> elements are not used",
        url: "https://dequeuniversity.com/rules/axe/4.4/blink",
      },
    ]);
  });

  it("returns errors for nested blink elements", async () => {
    const element = await fixture(html`
      <div>
        <blink>First blink</blink>
        <p><blink>Nested blink</blink></p>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "Ensure <blink> elements are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/blink",
    });
  });

  it("doesn't return errors if no blink element is present", async () => {
    const element = await fixture(html`
      <div>
        <p>Normal text</p>
        <span>More text</span>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("doesn't return errors for elements with 'blink' in class or id", async () => {
    const element = await fixture(html`
      <div class="blink-animation">
        <span id="blink-text">This is not a blink element</span>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
