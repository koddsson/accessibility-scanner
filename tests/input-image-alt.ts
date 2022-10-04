import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import inputImageAlt from "../src/rules/input-image-alt";

const scanner = new Scanner([inputImageAlt]);

// TODO: expand all `passes` and `violations` arrays. There seems to be some
// rendering issue when doing dynamic elements like this.
const passes = [
  await fixture(html`<input type="image" alt="monkeys" />`),
  await fixture(html`<input type="image" aria-label="monkeys" />`),
  await fixture(html`<input type="image" alt="" />`),
  await fixture(html`<input type="image" title="monkey" />`),
];

const violations = [
  await fixture(html`<input type="image" />`),
  await fixture(html`<input type="image" aria-label="" />`),
  await fixture(html`<input type="image" aria-labelledby="nomatchy" />`),
  await fixture(html`<input type="image" aria-labelledby="" />`),
  await fixture(html`<input type="image" alt=" " />`),
];

describe("input-image-alt", async function () {
  it("dont worry about it", async () => {
    const el = await fixture(html`
      <div>
        <div id="monkeys">Bananas</div>
        <img src="img.jpg" aria-labelledby="monkeys" />
      </div>
    `);

    const results = (await scanner.scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("dont worry about it", async () => {
    const el = await fixture(html`
      <div>
        <div id="ninjamonkeys" style="display:none">Banana bombs</div>
        <img src="img.jpg" aria-labelledby="ninjamonkeys" />
      </div>
    `);

    const results = (await scanner.scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("dont worry about it", async () => {
    const el = await fixture(html` <div>
      <div id="monkeys">Bananas</div>
      <img
        src="img.jpg"
        role="menuitemradio"
        aria-labelledby="monkeys"
      />
    </div>`);

    const results = (await scanner.scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  for (const el of passes) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          "text": "Image buttons must have alternate text",
          "url": "https://dequeuniversity.com/rules/axe/4.4/input-image-alt?application=RuleDescription"
        },
      ]);
    });
  }
});
