import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import imageAlt from "../src/rules/image-alt";

const scanner = new Scanner([imageAlt]);

// TODO: expand all `passes` and `violations` arrays. There seems to be some
// rendering issue when doing dynamic elements like this.
const passes = [
  await fixture(html`<img src="img.jpg" id="pass1" alt="monkeys" />`),
  await fixture(html`<img src="img.jpg" id="pass2" aria-label="monkeys" />`),
  await fixture(html`<img src="img.jpg" id="pass4" alt="" />`),
  await fixture(html`<img src="img.jpg" id="pass5" title="monkeys" />`),
  await fixture(html`<img src="img.jpg" id="pass6" role="presentation" />`),
  await fixture(html`<img src="img.jpg" id="pass7" role="none" />`),
  await fixture(
    html`<img src="img.jpg" id="pass9" role="button" aria-label="foo" />`
  ),
  await fixture(
    html`<img src="img.jpg" id="pass10" role="checkbox" title="bar" />`
  ),
  // await fixture(html`<img src="img.jpg" id="inapplicable1" role="separator" />`),
];

const violations = [
  await fixture(html`<img src="img.jpg" id="violation1" />`),
  await fixture(html`<img src="img.jpg" id="violation2" aria-label="" />`),
  await fixture(
    html`<img src="img.jpg" id="violation3" aria-labelledby="nomatchy" />`
  ),
  await fixture(html`<img src="img.jpg" id="violation4" aria-labelledby="" />`),
  await fixture(html`<img src="img.jpg" id="violation5" title="" />`),
  await fixture(html`<img src="img.jpg" id="violation6" alt=" " />`),
  await fixture(
    html`<img
      src="img.jpg"
      id="violation7"
      role="presentation"
      aria-live="assertive"
    />`
  ),
  await fixture(
    html`<img
      src="img.jpg"
      id="violation8"
      role="none"
      aria-live="assertive"
    />`
  ),
  await fixture(
    html`<img src="img.jpg" id="violation9" role="presentation" tabindex="0" />`
  ),
  await fixture(
    html`<img src="img.jpg" id="violation10" role="none" tabindex="0" />`
  ),
  await fixture(html`<img src="img.jpg" id="violation11" role="button" />`),
  await fixture(
    html`<img src="img.jpg" id="violation12" role="separator" tabindex="0" />`
  ),
  await fixture(
    html`<img src="img.jpg" id="violation13" role="option" aria-label="" />`
  ),
  await fixture(
    html`<img src="img.jpg" id="violation14" role="progressbar" title="" />`
  ),
  await fixture(
    html`<img
      src="img.jpg"
      id="violation15"
      role="treeitem"
      aria-labelledby=""
    />`
  ),
  await fixture(html`<img role="button" id="violation16" />`),
];

describe("image-alt", async function () {
  it("dont worry about it", async () => {
    const el = await fixture(html`
      <div>
        <div id="monkeys">Bananas</div>
        <img src="img.jpg" id="pass3" aria-labelledby="monkeys" />
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
        <img src="img.jpg" id="pass8" aria-labelledby="ninjamonkeys" />
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
        id="pass11"
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
          text: "Images must have alternate text",
          url: "https://dequeuniversity.com/rules/axe/4.4/image-alt?application=RuleDescription",
        },
      ]);
    });
  }
});
