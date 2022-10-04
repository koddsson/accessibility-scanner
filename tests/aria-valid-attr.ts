import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaValidAttr from "../src/rules/aria-valid-attr";

const scanner = new Scanner([ariaValidAttr]);

const passes = [
  await fixture(html`<div id="pass1" aria-activedescendant="stuff">hi</div>`),
  await fixture(html`<div id="pass2" aria-atomic="stuff">hi</div>`),
  await fixture(html`<div id="pass3" aria-autocomplete="stuff">hi</div>`),
  await fixture(html`<div id="pass4" aria-busy="stuff">hi</div>`),
  await fixture(html`<div id="pass5" aria-checked="stuff">hi</div>`),
  await fixture(html`<div id="pass6" aria-controls="stuff">hi</div>`),
  await fixture(html`<div id="pass7" aria-describedby="stuff">hi</div>`),
  await fixture(html`<div id="pass8" aria-disabled="stuff">hi</div>`),
  await fixture(html`<div id="pass9" aria-dropeffect="stuff">hi</div>`),
  await fixture(html`<div id="pass10" aria-expanded="stuff">hi</div>`),
  await fixture(html`<div id="pass11" aria-flowto="stuff">hi</div>`),
  await fixture(html`<div id="pass12" aria-grabbed="stuff">hi</div>`),
  await fixture(html`<div id="pass13" aria-haspopup="stuff">hi</div>`),
  await fixture(html`<div id="pass14" aria-hidden="stuff">hi</div>`),
  await fixture(html`<div id="pass15" aria-invalid="stuff">hi</div>`),
  await fixture(html`<div id="pass16" aria-keyshortcuts="stuff">hi</div>`),
  await fixture(html`<div id="pass17" aria-label="stuff">hi</div>`),
  await fixture(html`<div id="pass18" aria-labelledby="stuff">hi</div>`),
  await fixture(html`<div id="pass19" aria-level="stuff">hi</div>`),
  await fixture(html`<div id="pass20" aria-live="stuff">hi</div>`),
  await fixture(html`<div id="pass21" aria-modal="stuff">hi</div>`),
  await fixture(html`<div id="pass22" aria-multiline="stuff">hi</div>`),
  await fixture(html`<div id="pass23" aria-multiselectable="stuff">hi</div>`),
  await fixture(html`<div id="pass24" aria-placeholder="stuff">hi</div>`),
  await fixture(html`<div id="pass25" aria-orientation="stuff">hi</div>`),
  await fixture(html`<div id="pass26" aria-owns="stuff">hi</div>`),
  await fixture(html`<div id="pass27" aria-posinset="stuff">hi</div>`),
  await fixture(html`<div id="pass28" aria-pressed="stuff">hi</div>`),
  await fixture(html`<div id="pass29" aria-readonly="stuff">hi</div>`),
  await fixture(html`<div id="pass30" aria-relevant="stuff">hi</div>`),
  await fixture(html`<div id="pass31" aria-required="stuff">hi</div>`),
  await fixture(html`<div id="pass32" aria-selected="stuff">hi</div>`),
  await fixture(html`<div id="pass33" aria-setsize="stuff">hi</div>`),
  await fixture(html`<div id="pass34" aria-sort="stuff">hi</div>`),
  await fixture(html`<div id="pass35" aria-valuemax="stuff">hi</div>`),
  await fixture(html`<div id="pass36" aria-valuemin="stuff">hi</div>`),
  await fixture(html`<div id="pass37" aria-valuenow="stuff">hi</div>`),
  await fixture(html`<div id="pass38" aria-valuetext="stuff">hi</div>`),
  await fixture(html`<div id="pass39" role="alert" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass40" role="application" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass41" role="banner" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass42" role="checkbox" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass43" role="contentinfo" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass44" role="doc-appendix" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass45" role="doc-glossary" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass46" role="group" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass47" role="log" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass48" role="menubar" aria-errormessage="stuff">hi</div>`),
  await fixture(html`<div id="pass49" role="scrollbar" aria-errormessage="stuff">hi</div>`),
];

const violations = [
  await fixture(html`<div aria-cat="maybe" id="violation1"></div>`),
  await fixture(html`<div aria-bat="no" id="violation2"></div>`),
  await fixture(html`<div aria-fat="a lil bit" id="violation3"></div>`),
  await fixture(html`<div aria-rat="ew" id="violation4"></div>`),
  await fixture(html`<div aria-pat="ok" id="violation5"></div>`),
  await fixture(html`<div aria-hat="plz" id="violation6"></div>`),
  await fixture(html`<div aria-sat="or sun" id="violation7"></div>`),
  await fixture(html`<div aria-mat="lie" id="violation8"></div>`)
];

describe("aria-valid-attr", async function () {
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
      "text": "ARIA attributes must conform to valid names",
      "url": "https://dequeuniversity.com/rules/axe/4.4/aria-valid-attr"
        },
      ]);
    });
  }
});
