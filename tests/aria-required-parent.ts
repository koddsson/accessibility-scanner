import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaRequiredParent from "../src/rules/aria-required-parent";

const scanner = new Scanner([ariaRequiredParent]);

const passes = [
  // listitem in list
  await fixture(
    html`<div role="list">
      <div role="listitem" id="pass1">Item 1</div>
    </div>`,
  ),

  // listitem in list (implicit roles)
  await fixture(
    html`<ul>
      <li id="pass2">Item 1</li>
    </ul>`,
  ),

  // option in listbox
  await fixture(
    html`<div role="listbox">
      <div role="option" id="pass3">Option 1</div>
    </div>`,
  ),

  // option in listbox (implicit)
  await fixture(
    html`<select>
      <option id="pass4">Option 1</option>
    </select>`,
  ),

  // tab in tablist
  await fixture(
    html`<div role="tablist">
      <div role="tab" id="pass5">Tab 1</div>
    </div>`,
  ),

  // treeitem in tree
  await fixture(
    html`<div role="tree">
      <div role="treeitem" id="pass6">Item 1</div>
    </div>`,
  ),

  // row in table
  await fixture(
    html`<table>
      <tr id="pass7">
        <td>Cell</td>
      </tr>
    </table>`,
  ),

  // row in grid
  await fixture(
    html`<div role="grid">
      <div role="row" id="pass8">
        <div role="gridcell">Cell</div>
      </div>
    </div>`,
  ),

  // row in rowgroup
  await fixture(
    html`<div role="table">
      <div role="rowgroup">
        <div role="row" id="pass9">
          <div role="cell">Cell</div>
        </div>
      </div>
    </div>`,
  ),

  // cell in row
  await fixture(
    html`<table>
      <tr>
        <td id="pass10">Cell</td>
      </tr>
    </table>`,
  ),

  // gridcell in row
  await fixture(
    html`<div role="grid">
      <div role="row">
        <div role="gridcell" id="pass11">Cell</div>
      </div>
    </div>`,
  ),

  // columnheader in row
  await fixture(
    html`<table>
      <tr>
        <th id="pass12">Header</th>
      </tr>
    </table>`,
  ),

  // rowheader in row
  await fixture(
    html`<table>
      <tr>
        <th scope="row" id="pass13">Header</th>
      </tr>
    </table>`,
  ),

  // rowgroup in table
  await fixture(
    html`<table>
      <tbody id="pass14">
        <tr>
          <td>Cell</td>
        </tr>
      </tbody>
    </table>`,
  ),

  // menuitem in menu
  await fixture(
    html`<div role="menu">
      <div role="menuitem" id="pass15">Item 1</div>
    </div>`,
  ),

  // menuitem in menubar
  await fixture(
    html`<div role="menubar">
      <div role="menuitem" id="pass16">Item 1</div>
    </div>`,
  ),

  // menuitemcheckbox in menu
  await fixture(
    html`<div role="menu">
      <div role="menuitemcheckbox" id="pass17">Item 1</div>
    </div>`,
  ),

  // menuitemradio in menubar
  await fixture(
    html`<div role="menubar">
      <div role="menuitemradio" id="pass18">Item 1</div>
    </div>`,
  ),

  // row in treegrid
  await fixture(
    html`<div role="treegrid">
      <div role="row" id="pass19">
        <div role="gridcell">Cell</div>
      </div>
    </div>`,
  ),

  // Nested with presentation role (transparent)
  await fixture(
    html`<div role="list">
      <div role="presentation">
        <div role="listitem" id="pass20">Item 1</div>
      </div>
    </div>`,
  ),

  // Nested with none role (transparent)
  await fixture(
    html`<div role="list">
      <div role="none">
        <div role="listitem" id="pass21">Item 1</div>
      </div>
    </div>`,
  ),

  // Nested with generic role (transparent)
  await fixture(
    html`<div role="list">
      <div role="generic">
        <div role="listitem" id="pass22">Item 1</div>
      </div>
    </div>`,
  ),

  // Element without required parent (e.g., button doesn't need parent)
  await fixture(html`<div role="button" id="pass23">Button</div>`),
];

const violations = [
  // listitem without list
  await fixture(html`<div role="listitem" id="fail1">Item 1</div>`),

  // option without listbox
  await fixture(html`<div role="option" id="fail2">Option 1</div>`),

  // tab without tablist
  await fixture(html`<div role="tab" id="fail3">Tab 1</div>`),

  // treeitem without tree
  await fixture(html`<div role="treeitem" id="fail4">Item 1</div>`),

  // row without table/grid/rowgroup
  await fixture(html`<div role="row" id="fail5"><div role="cell">Cell</div></div>`),

  // cell without row
  await fixture(html`<div role="cell" id="fail6">Cell</div>`),

  // gridcell without row
  await fixture(html`<div role="gridcell" id="fail7">Cell</div>`),

  // columnheader without row
  await fixture(html`<div role="columnheader" id="fail8">Header</div>`),

  // rowheader without row
  await fixture(html`<div role="rowheader" id="fail9">Header</div>`),

  // rowgroup without table/grid/treegrid
  await fixture(html`<div role="rowgroup" id="fail10"><div role="row">Row</div></div>`),

  // menuitem without menu/menubar
  await fixture(html`<div role="menuitem" id="fail11">Item 1</div>`),

  // menuitemcheckbox without menu/menubar
  await fixture(html`<div role="menuitemcheckbox" id="fail12">Item 1</div>`),

  // menuitemradio without menu/menubar
  await fixture(html`<div role="menuitemradio" id="fail13">Item 1</div>`),

  // listitem with wrong parent (not list)
  await fixture(
    html`<div role="grid">
      <div role="listitem" id="fail14">Item 1</div>
    </div>`,
  ),

  // option with wrong parent (not listbox)
  await fixture(
    html`<div role="menu">
      <div role="option" id="fail15">Option 1</div>
    </div>`,
  ),

  // row with wrong parent (not table/grid/rowgroup/treegrid)
  await fixture(
    html`<div role="list">
      <div role="row" id="fail16">
        <div role="cell">Cell</div>
      </div>
    </div>`,
  ),

  // cell in grid (not in row) - invalid nesting
  await fixture(
    html`<div role="grid">
      <div role="cell" id="fail17">Cell</div>
    </div>`,
  ),

  // menuitem with intervening role
  await fixture(
    html`<div role="menu">
      <div role="tabpanel">
        <div role="menuitem" id="fail18">Item 1</div>
      </div>
    </div>`,
  ),

  // listitem with intervening non-transparent role
  await fixture(
    html`<div role="list">
      <div role="tabpanel">
        <div role="listitem" id="fail19">Item 1</div>
      </div>
    </div>`,
  ),
];

describe("aria-required-parent", async function () {
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
          text: "Certain ARIA roles must be contained by particular parents",
          url: `https://dequeuniversity.com/rules/axe/4.4/aria-required-parent`,
        },
      ]);
    });
  }
});
