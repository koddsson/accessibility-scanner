import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaInputFieldName from "../src/rules/aria-input-field-name";

const scanner = new Scanner([ariaInputFieldName]);

describe("aria-input-field-name", function () {
  it("combobox with aria-label passes", async () => {
    const container = await fixture(html`
      <div id="pass1" aria-label="country" role="combobox">England</div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("listbox with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="pass2Label">Select a color:</p>
        <div id="pass2" role="listbox" aria-labelledby="pass2Label">
          <div role="option">Orange</div>
        </div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("searchbox with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="pass3Label">Search:</p>
        <div
          id="pass3"
          role="searchbox"
          contenteditable="true"
          aria-labelledby="pass3Label"
        ></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("slider with aria-label passes", async () => {
    const container = await fixture(html`
      <div
        id="pass4"
        role="slider"
        aria-label="Choose a value"
        aria-valuemin="1"
        aria-valuemax="7"
        aria-valuenow="2"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("spinbutton with aria-label passes", async () => {
    const container = await fixture(html`
      <div
        id="pass5"
        role="spinbutton"
        aria-valuemin="0"
        aria-valuemax="10"
        aria-valuenow="8"
        aria-label="Enter quantity:"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("textbox with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <label id="foo">
        foo
        <div id="pass6" role="textbox" aria-labelledby="foo"></div>
      </label>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("combobox with empty aria-label fails", async () => {
    const container = await fixture(
      html`<div id="fail1" aria-label=" " role="combobox">England</div>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA input fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-input-field-name",
      },
    ]);
  });

  it("combobox with non-existing aria-labelledby fails", async () => {
    const container = await fixture(
      html`<div id="fail2" aria-labelledby="non-existing" role="combobox">
        England
      </div>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA input fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-input-field-name",
      },
    ]);
  });

  it("textbox without accessible name fails", async () => {
    const container = await fixture(html`
      <label>
        first name
        <div id="fail3" role="textbox"></div>
      </label>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA input fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-input-field-name",
      },
    ]);
  });

  it("combobox without accessible name fails", async () => {
    const container = await fixture(html`
      <div id="fail5" role="combobox">England</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA input fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-input-field-name",
      },
    ]);
  });

  it("slider without accessible name fails", async () => {
    const container = await fixture(html`
      <div
        id="fail8"
        role="slider"
        aria-valuemin="1"
        aria-valuemax="7"
        aria-valuenow="2"
      ></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA input fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-input-field-name",
      },
    ]);
  });

  it("native input is ignored", async () => {
    const container = await fixture(html`<input id="inapplicable2" />`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("native select is ignored", async () => {
    const container = await fixture(html`
      <select id="inapplicable3">
        <option value="volvo">Volvo</option>
      </select>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("native textarea is ignored", async () => {
    const container = await fixture(
      html`<textarea id="inapplicable4" title="Label"></textarea>`,
    );
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });
});

