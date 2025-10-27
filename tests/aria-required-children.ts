import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaRequiredChildren from "../src/rules/aria-required-children";

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
];

const violations = [
  await fixture(
    html`<div role="list" id="fail1">
      <div role="menuitem" id="ignore3"></div>
    </div>`,
  ),
  await fixture(html`<div role="list" id="fail2" aria-owns="ingore4"></div>`),
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
    html`<div role="list" id="fail12">
      <div aria-busy="true"></div>
    </div>`,
  ),

  await fixture(
    html`<div role="list" id="fail13" aria-busy="true">
      <div role="alert">unallowed role</div>
    </div>`,
  ),
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
          text: "Certain ARIA roles must contain particular children",
          url: `https://dequeuniversity.com/rules/axe/4.4/aria-required-children`,
        },
      ]);
    });
  }
});
