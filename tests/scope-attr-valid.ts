import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("scope-attr-valid", function () {
  it("invalid scope value should error", async () => {
    const table = await fixture(html`
      <table>
        <tr>
          <th id="badvalue" scope="whatever"></th>
        </tr>
      </table>
    `);

    const results = (await scan(table)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Scope attribute should be used correctly on tables",
        url: "https://dequeuniversity.com/rules/axe/4.4/scope-attr-valid?application=RuleDescription",
      },
    ]);
  });

  it("scope on a table cell should error", async () => {
    const table = await fixture(html`
      <table>
        <tr>
          <td id="tdrow" scope="row"></td>
        </tr>
      </table>
    `);

    const results = (await scan(table)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Scope attribute should be used correctly on tables",
        url: "https://dequeuniversity.com/rules/axe/4.4/scope-attr-valid?application=RuleDescription",
      },
    ]);
  });

  it("row scope on a table header should not error", async () => {
    const table = await fixture(html`
      <table>
        <tr>
          <th id="throw" scope="row"></th>
        </tr>
      </table>
    `);

    const results = (await scan(table)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty
  });

  it("scope on a table cell should error", async () => {
    const table = await fixture(html`
      <table>
        <tr>
          <td id="tdcol" scope="col"></td>
        </tr>
      </table>
    `);

    const results = (await scan(table)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Scope attribute should be used correctly on tables",
        url: "https://dequeuniversity.com/rules/axe/4.4/scope-attr-valid?application=RuleDescription",
      },
    ]);
  });

  it("invalid scope value should error", async () => {
    const table = await fixture(html`
      <table>
        <tr>
          <th id="thcol" scope="colgroup"></th>
        </tr>
      </table>
    `);

    const results = (await scan(table)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty
  });
});
