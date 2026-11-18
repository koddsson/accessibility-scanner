import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner.js";
import ariaRequiredChildren from "../src/rules/aria-required-children.js";

const scanner = new Scanner([ariaRequiredChildren]);

const passes = [
  await fixture(
    html`<div role="list" id="pass1">
      <div role="listitem" id="ignore1">Item 1</div>
    </div>`,
  ),
  await fixture(
    html`<div>
      <div role="list" id="pass2" aria-owns="ignore2"></div>
      <div role="listitem" id="ignore2"></div>
    </div>`,
  ),
  await fixture(html`<div role="menuitem" id="ignore4"></div>`),
  await fixture(
    html`<div>
      <div role="list" id="pass3" aria-owns="parent"></div>
      <div id="parent">
        <div role="listitem" id="ignore5"></div>
      </div>
    </div>`,
  ),
  await fixture(
    html`<div role="grid" id="pass5">
      <div role="presentation" id="ignore8">
        <div role="row" id="pass6">
          <div role="none" id="ingore9">
            <span role="cell" id="ignore10">Item 1</span>
          </div>
        </div>
      </div>
    </div>`,
  ),
  await fixture(
    html`<div role="menu" id="pass7">
      <ul role="group" id="ignore11">
        <li role="menuitem" id="ignore12">>Inbox</li>
        <li role="separator" id="ignored13"></li>
        <li role="menuitem" id="ignore14">>Archive</li>
        <li role="menuitem" id="ignore15">>Trash</li>
      </ul>
    </div>`,
  ),
  await fixture(
    html`<div role="menu" id="pass8">
      <ul role="group" id="ignore16">
        <li role="menuitem" id="ignore17">>Inbox</li>
        <li role="separator" id="ignored18"></li>
        <li role="menuitem" id="ignore19">>Archive</li>
        <li role="menuitem" id="ignore20">>Trash</li>
      </ul>
    </div>`,
  ),

  await fixture(
    html`<div role="suggestion" id="pass8">
      <span role="deletion">option</span>
      <span role="insertion">option</span>
    </div>`,
  ),

  await fixture(
    html`<div role="listbox" id="pass9">
      <div role="group">
        <div role="option">option</div>
      </div>
    </div>`,
  ),

  await fixture(html`<div role="list" id="pass10" aria-busy="true"></div>`),

  await fixture(
    html`<div role="suggestion" id="pass11" aria-busy="true"></div>`,
  ),

  await fixture(html`<div role="menu" id="pass12" aria-busy="true"></div>`),

  await fixture(html`<div role="listbox" id="pass13" aria-busy="true"></div>`),

  await fixture(
    html`<div role="list" id="pass14">
      <script></script>
      <style></style>
      <canvas hidden></canvas>
      <div><div role="listitem">Item 1</div></div>
      <div role="generic"><div role="listitem">item 2</div></div>
      <div role="presentation"><div role="listitem">item 2</div></div>
      <div role="none"><div role="listitem">item 2</div></div>
    </div>`,
  ),

  await fixture(
    html`<div role="list" id="pass15">
      <script></script>
      <style></style>
      <canvas hidden></canvas>
      <div><div role="listitem">Item 1</div></div>
      <div role="generic"><div role="listitem">item 2</div></div>
      <div role="presentation"><div role="listitem">item 2</div></div>
      <div role="none"><div role="listitem">item 2</div></div>
    </div>`,
  ),

  await fixture(
    html`<ul role="menu" id="pass15">
      <li role="none">
        <a href="#" role="menuitem">Foo</a>
        <ul role="menu" id="pass16">
          <li role="none">
            <a href="#" role="menuitem">Bar</a>
          </li>
        </ul>
      </li>
    </ul>`,
  ),

  await fixture(
    html`<nav role="menubar" id="pass17">
      <a role="menuitem" href="">Item 1</a>
      <a role="menuitem" href="">Item 2</a>
      <span role="separator"></span>
      <a role="menuitem" href="">Item 3</a>
    </nav>`,
  ),

  await fixture(
    html`<div role="menu" id="pass18">
      <div role="menuitem">menu item</div>
      <div aria-hidden="true">shouldn't be flagged but is</div>
    </div>`,
  ),

  await fixture(
    html`<div role="list" id="pass19">
      <div role="presentation">
        <div style="display: none">ignore</div>
        <div style="visibility: hidden" aria-hidden="true">ignore</div>
        <li>item 1</li>
        <li>item 2</li>
      </div>
    </div>`,
  ),

  await fixture(
    html`<ul role="listbox" id="pass20">
      <li><a role="option" href="/a">A</a></li>
      <li><a role="option" href="/b">B</a></li>
    </ul>`,
  ),

  await fixture(
    html`<table role="listbox" id="pass21">
      <tbody>
        <tr>
          <td role="option">A</td>
        </tr>
      </tbody>
    </table>`,
  ),

  await fixture(
    html`<table role="treegrid" id="pass22">
      <tr>
        <td>Item 1</td>
      </tr>
    </table>`,
  ),

  await fixture(html`<ul id="pass23"></ul>`),
  await fixture(html`<ol class="toasts" id="pass24"></ol>`),
  await fixture(html`<ol id="pass25"> </ol>`),
  await fixture(html`<table id="pass26"></table>`),
  await fixture(html`<select id="pass27"></select>`),
];

const needsReview = [
  await fixture(html`<div role="list" id="review1"></div>`),
  await fixture(html`<div role="list" id="review2" aria-owns="ingore4"></div>`),
  await fixture(
    html`<div role="list" id="review3">
      <div aria-busy="true"></div>
    </div>`,
  ),
  await fixture(html`<div role="listbox" id="review4"></div>`),
  await fixture(html`<div role="menu" id="review5"></div>`),
  await fixture(html`<div role="tablist" id="review6"></div>`),
  await fixture(html`<div role="tree" id="review7"></div>`),
  await fixture(html`<ul role="list" id="review8"></ul>`),
];

const violations = [
  await fixture(
    html`<div role="list" id="fail1">
      <div role="menuitem" id="ignore3"></div>
    </div>`,
  ),
  await fixture(html`<div role="row" id="fail3"></div>`),

  await fixture(
    html`<div role="list" id="fail4">
      <div role="tabpanel" id="ignore6">
        <div role="listitem" id="ignore7">List item 1</div>
      </div>
    </div>`,
  ),
  await fixture(
    html`<div role="grid" id="pass4">
      <div role="row" id="fail5">
        <span>Item 1</span>
      </div>
    </div>`,
  ),
  await fixture(html`<div role="suggestion" id="fail6"></div>`),
  await fixture(
    html`<div role="suggestion" id="fail7">
      <div aria-busy="true"></div>
    </div>`,
  ),
  await fixture(
    html`<div role="suggestion" id="fail8" aria-busy="false"></div>`,
  ),
  await fixture(
    html`<div role="list" id="fail9">
      <li>Item 1</li>
      <span role="link">Item 2</span>
    </div>`,
  ),
  await fixture(
    html`<div role="list" id="fail10">
      <div aria-live="polite">
        <div role="listitem">List item 1</div>
        <div role="listitem">List item 2</div>
      </div>
    </div>`,
  ),
  await fixture(
    html`<div role="list" id="fail11">
      <div tabindex="0">
        <div role="listitem">List item 1</div>
        <div role="listitem">List item 2</div>
      </div>
    </div>`,
  ),

  await fixture(
    html`<div role="list" id="fail13" aria-busy="true">
      <div role="alert">unallowed role</div>
    </div>`,
  ),
  await fixture(
    html`<ol role="tablist" id="fail14">
      <li role="listitem">Item 1</li>
    </ol>`,
  ),
  await fixture(
    html`<ul role="tablist" id="fail15">
      <li><span>Not a tab</span></li>
    </ul>`,
  ),
  await fixture(
    html`<ul id="fail16">
      <div></div>
      <div></div>
    </ul>`,
  ),
  await fixture(html`<div role="list" id="fail17">Item 1</div>`),
  await fixture(html`<div role="list" id="fail18"><span>Item 1</span></div>`),
];

describe("aria-required-children", async function () {
  for (const el of passes) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const el of needsReview) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(
        ({ text, url, needsReview }) => {
          return { text, url, needsReview };
        },
      );

      expect(results).to.eql([
        {
          text: "Certain ARIA roles must contain particular children",
          url: `https://dequeuniversity.com/rules/axe/4.11/aria-required-children`,
          needsReview: true,
        },
      ]);
    });
  }

  for (const el of violations) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(
        ({ text, url, needsReview }) => {
          return { text, url, needsReview: Boolean(needsReview) };
        },
      );

      expect(results).to.eql([
        {
          text: "Certain ARIA roles must contain particular children",
          url: `https://dequeuniversity.com/rules/axe/4.11/aria-required-children`,
          needsReview: false,
        },
      ]);
    });
  }
});
