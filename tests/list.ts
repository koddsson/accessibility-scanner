import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import rule from "../src/rules/list";

const scanner = new Scanner([rule]);

const passes = [
  `<ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>`,
  `<ol>
    <li>First item</li>
    <li>Second item</li>
  </ol>`,
  `<ul>
    <li>Item</li>
    <script>console.log('allowed');</script>
    <template>Allowed template</template>
  </ul>`,
  `<div role="list">
    <div role="listitem">Item 1</div>
    <div role="listitem">Item 2</div>
  </div>`,
  `<div role="list" aria-owns="item1 item2"></div>
   <div id="item1">Item 1</div>
   <div id="item2">Item 2</div>`,
];

const violations = [
  `<ul>
    <div>Not a list item</div>
  </ul>`,
  `<ol>
    <span>Invalid child</span>
  </ol>`,
  `<ul>
    <li>Valid item</li>
    <p>Invalid paragraph</p>
  </ul>`,
  `<div role="list">
    <!-- Empty ARIA list without listitem children or aria-owns -->
  </div>`,
  `<div role="list">
    <div>Not a listitem</div>
  </div>`,
];

describe.skip("list", async function () {
  for (const markup of passes) {
    const el = await fixture(markup);
    it(el.outerHTML, async function () {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const markup of violations) {
    const el = await fixture(markup);
    it(el.outerHTML, async function () {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.not.be.empty;
      results.forEach((result) => {
        expect(result).to.eql({
          text: "Ensures that lists are structured correctly",
          url: "https://dequeuniversity.com/rules/axe/4.4/list?application=RuleDescription",
        });
      });
    });
  }
});
