import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import imageAlt from "../src/rules/image-alt";

const scanner = new Scanner([imageAlt]);
const parser = new DOMParser();

// TODO: expand all `passes` and `violations` arrays. There seems to be some
// rendering issue when doing dynamic elements like this.
const passes = [
  `<img src="img.jpg" alt="monkeys" />`,
  `<img src="img.jpg" aria-label="monkeys" />`,
  `<img src="img.jpg" alt="" />`,
  `<img src="img.jpg" title="monkeys" />`,
  `<img src="img.jpg" role="presentation" />`,
  `<img src="img.jpg" role="none" />`,
  `<img src="img.jpg" role="button" aria-label="foo" />`,
  `<img src="img.jpg" role="checkbox" title="bar" />`,
  // await fixture(html`<img src="img.jpg" id="inapplicable1" role="separator" />`),
];

const violations = [
  await fixture(html`<img src="img.jpg" />`),
  await fixture(html`<img src="img.jpg" aria-label="" />`),
  await fixture(html`<img src="img.jpg" aria-labelledby="nomatchy" />`),
  await fixture(html`<img src="img.jpg" aria-labelledby="" />`),
  await fixture(html`<img src="img.jpg" title="" />`),
  await fixture(html`<img src="img.jpg" alt=" " />`),
  await fixture(
    html`<img src="img.jpg" role="presentation" aria-live="assertive" />`,
  ),
  await fixture(html`<img src="img.jpg" role="none" aria-live="assertive" />`),
  await fixture(html`<img src="img.jpg" role="presentation" tabindex="0" />`),
  await fixture(
    html`<img src="img.jpg" id="violation10" role="none" tabindex="0" />`,
  ),
  await fixture(html`<img src="img.jpg" id="violation11" role="button" />`),
  await fixture(
    html`<img src="img.jpg" id="violation12" role="separator" tabindex="0" />`,
  ),
  await fixture(
    html`<img src="img.jpg" id="violation13" role="option" aria-label="" />`,
  ),
  await fixture(
    html`<img src="img.jpg" id="violation14" role="progressbar" title="" />`,
  ),
  await fixture(
    html`<img
      src="img.jpg"
      id="violation15"
      role="treeitem"
      aria-labelledby=""
    />`,
  ),
  await fixture(html`<img role="button" id="violation16" />`),
];

describe("image-alt", async function () {
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
    const el = await fixture(
      html` <div>
        <div id="monkeys">Bananas</div>
        <img src="img.jpg" role="menuitemradio" aria-labelledby="monkeys" />
      </div>`,
    );

    const results = (await scanner.scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  for (const htmlString of passes) {
    it(htmlString, async () => {
      const doc = parser.parseFromString(htmlString, "text/html");
      const results = (await scanner.scan(doc.body)).map(({ text, url }) => {
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
          text: "Images must have alternate text",
          url: "https://dequeuniversity.com/rules/axe/4.4/image-alt?application=RuleDescription",
        },
      ]);
    });
  }
});
