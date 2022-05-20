import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import buttonName from "../src/rules/button-name";

const scanner = new Scanner([buttonName]);

describe("button-name", function () {
  describe("has errors if", function () {
    it("it doesn't have text", async () => {
      const container = await fixture(html`<button id="empty"></button>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });

    it("just has a value but no discernible text", async () => {
      const container = await fixture(
        html`<button id="val" value="Button Name"></button>`
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });

    it("has a empty aria-label", async () => {
      const container = await fixture(
        html`<button id="alempty" aria-label=""></button>`
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });

    it("has a invalid aria-labelledby attribute", async () => {
      const container = await fixture(
        html`<button id="albmissing" aria-labelledby="nonexistent"></button>`
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });

    it("has a empty aria-labelledby element", async () => {
      const container = await fixture(html`<div>
        <button id="albempty" aria-labelledby="emptydiv"></button>
        <div id="emptydiv"></div>
      </div>`);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });

    it("has certain roles and no discernible text", async () => {
      const container = await fixture(html`
        <div>
          <button role="presentation"></button>
          <button role="none"></button>
          <button role="img" disabled></button>
          <button role="gridcell"></button>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
        {
          text: "Buttons must have discernible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("has presentation/none roles and is disabled", async () => {
      const container = await fixture(html`
        <div>
          <button role="presentation" disabled></button>
          <button role="none" disabled></button>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });

  it("has text or a valid equivilant", async function () {
    const container = await fixture(html`
      <div>
        <button id="text">Name</button>
        <button id="al" aria-label="Name"></button>
        <button id="alb" aria-labelledby="labeldiv"></button>
        <div id="labeldiv">Button label</div>
        <button id="combo" aria-label="Aria Name">Name</button>
        <button id="buttonTitle" title="Title"></button>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("has a child that has a valid text", async function () {
    const container = await fixture(html`
      <div>
        <button>
          <span> Hello! </span>
        </button>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("has a child that has a valid aria-label", async function () {
    const container = await fixture(html`
      <div>
        <button>
          <span>
            <img aria-label="foobar" />
          </span>
        </button>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
