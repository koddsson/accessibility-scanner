import { fixture, html, expect } from "@open-wc/testing";
import { Scanner, allRules } from "../src/scanner";

describe("scanner", function () {
  it("does not mutate the document while scanning", async () => {
    const container = await fixture(
      html`<main style="background-color: oklch(0.985 0.002 247.839);">
        <h1 style="color: oklch(0.21 0.034 264.665);">Groups</h1>
        <nav>
          <a href="/a" style="color: oklch(0.546 0.245 262.881);">Alpha</a>
          <a
            href="/b"
            style="color: color-mix(in oklab, oklch(0.546 0.245 262.881) 50%, transparent);"
            >Beta</a
          >
          <a href="/c" style="color: color(display-p3 0.2 0.3 0.8);">Gamma</a>
          <a href="/d" style="color: rebeccapurple;">Delta</a>
        </nav>
        <p style="color: lab(40 20 -30); background: lch(95 5 100);">
          Text with an <img src="data:," alt="icon" /> image and a
          <a href="/e">link</a>.
        </p>
        <form>
          <label for="name"
            >Name
            <select>
              <option>Mr</option>
            </select></label
          >
          <input id="name" type="text" />
          <button type="submit" style="color: hwb(200 10% 20%);">Send</button>
        </form>
        <table>
          <tr>
            <th>Header</th>
          </tr>
          <tr>
            <td>Cell</td>
          </tr>
        </table>
        <div aria-hidden="true"><span>Hidden</span></div>
      </main>`,
    );

    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });

    await new Scanner(allRules).scan(container);

    records.push(...observer.takeRecords());
    observer.disconnect();
    expect(records.map((r) => `${r.type} on <${r.target.nodeName}>`)).to.be
      .empty;
  });
});
