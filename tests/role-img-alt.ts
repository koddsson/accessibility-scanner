import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import roleImgAlt from "../src/rules/role-img-alt";

const scanner = new Scanner([roleImgAlt]);
const parser = new DOMParser();

// TODO: expand all `passes` and `violations` arrays. There seems to be some
// rendering issue when doing dynamic elements like this.
const passes = [
  `<div><div id="match">Bananas</div><div role="img" aria-labelledby="match" id="pass2"></div></div>`,
  `<div><div id="hidden-match" style="display:none">Banana bombs</div><div role="img" aria-labelledby="hidden-match" id="pass3"></div></div>`,
  `<div role="img" aria-label="blah" id="pass1"></div>`,
  `<div role="img" title="title" id="pass4"></div>`,
];

const violations = [
  await fixture(html`<div role="img" id="violation1"></div>`),
  await fixture(html`<div role="img" aria-label="" id="violation2"></div>`),
  await fixture(html`<div role="img" alt="blah" id="violation3"></div>`),
  await fixture(
    html`<div role="img" aria-labelledby="no-match" id="violation4"></div>`,
  ),
  await fixture(html`<div role="img" title="" id="violation5"></div>`),
];

describe("role-img-alt", async function () {
  it("dont worry about it", async () => {
    const el = await fixture(html`
      <div>
        <div id="monkeys">Bananas</div>
        <img src="img.jpg" aria-labelledby="monkeys" />
      </div>
    `);

    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("dont worry about it", async () => {
    const el = await fixture(html`
      <div>
        <div id="ninjamonkeys" style="display:none">Banana bombs</div>
        <img src="img.jpg" aria-labelledby="ninjamonkeys" />
      </div>
    `);

    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("dont worry about it", async () => {
    const el = await fixture(
      html` <div>
        <div id="monkeys">Bananas</div>
        <img src="img.jpg" role="menuitemradio" aria-labelledby="monkeys" />
      </div>`,
    );

    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  for (const htmlString of passes) {
    it(htmlString, async () => {
      const doc = parser.parseFromString(htmlString, "text/html");
      const results = await scanner.scan(doc.body);
      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(el.outerHTML, async () => {
      const errors = await scanner.scan(el);
      const results = errors.map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: 'Elements containing role="img" have an alternative text',
          url: "https://dequeuniversity.com/rules/axe/4.4/role-img-alt?application=RuleDescription",
        },
      ]);
    });
  }
});
