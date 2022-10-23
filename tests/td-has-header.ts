import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tdHasHeader from "../src/rules/td-has-header";

const scanner = new Scanner([tdHasHeader]);

const passes = [
  await fixture(
    html`<table>
      <tr>
        <th>hi</th>
        <td>hello</td>
      </tr>
    </table>`
  ),
  await fixture(html`<table>
    <tr>
      <th>hi</th>
      <th>hello</th>
    </tr>
    <tr>
      <td>hi</td>
      <td>hello</td>
    </tr>
  </table>`),
  await fixture(html`<table>
    <tr>
      <td aria-label="one">hi</td>
      <td aria-label="two">hello</td>
    </tr>
    <tr>
      <td aria-label="one">hi</td>
      <td aria-label="two">hello</td>
    </tr>
  </table>`),
  await fixture(html`<div id="one">one</div>
    <div id="two">two</div>
    <table>
      <tr>
        <td aria-labelledby="one">hi</td>
        <td aria-labelledby="two">hello</td>
      </tr>
      <tr>
        <td aria-labelledby="one">hi</td>
        <td aria-labelledby="two">hello</td>
      </tr>
    </table>`),
  await fixture(html` <div id="one">one</div>
    <div id="two">two</div>
    <table>
      <tr>
        <td headers="one">hi</td>
        <td headers="two">hello</td>
      </tr>
      <tr>
        <td headers="one">hi</td>
        <td headers="two">hello</td>
      </tr>
    </table>`),
  await fixture(html` <table>
    <tr>
      <th>hi</th>
      <th>hello</th>
    </tr>
    <tr>
      <th></th>
      <td>hello</td>
    </tr>
  </table>`),
  await fixture(
    html`<table>
      <tr>
        <td></td>
        <td></td>
      </tr>
    </table>`
  ),
  await fixture(html` <table>
    <tr>
      <th>Hello</th>
      <td headers="">goodbye</td>
    </tr>
  </table>`),
  await fixture(html` <table>
    <tr>
      <th>Hello</th>
      <td headers="beatles">goodbye</td>
    </tr>
  </table>`),
];

const violations = [
  await fixture(html`
    <table>
      <thead>
        <tr>
          <td rowspan="2">Species</td>
          <td colspan="2">Info</td>
        </tr>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gorilla</td>
          <td>Koko</td>
          <td>44</td>
        </tr>
        <tr>
          <td>Human</td>
          <td>Matt</td>
          <td>33</td>
        </tr>
      </tbody>
    </table>
  `),
  await fixture(
    html`<table>
      <tr>
        <td>hi</td>
        <td>hello</td>
      </tr>
    </table>`
  ),
  await fixture(html`<table>
    <tr>
      <td colspan="3">Psuedo-Caption</td>
    </tr>
    <tr>
      <td>hi</td>
      <td>hello</td>
      <td>Ok</td>
    </tr>
  </table>`),
  await fixture(html` <table>
    <tr>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <td>hi</td>
      <td>hello</td>
    </tr>
  </table>`),
];

describe("td-has-header", function () {
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

      expect(results).to.include([
        {
          text: "All non-empty <td> elements in tables larger than 3 by 3 must have an associated table header",
          url: "https://dequeuniversity.com/rules/axe/4.4/td-has-header",
        },
      ]);
    });
  }
});
