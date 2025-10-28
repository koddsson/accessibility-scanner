import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import autocompleteValid from "../src/rules/autocomplete-valid";

const scanner = new Scanner([autocompleteValid]);

describe("autocomplete-valid", function () {
  it("passes for inputs with valid autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="name" />
        <input type="email" autocomplete="email" />
        <input type="tel" autocomplete="tel" />
        <input type="text" autocomplete="given-name" />
        <input type="text" autocomplete="family-name" />
        <input type="text" autocomplete="street-address" />
        <input type="text" autocomplete="address-line1" />
        <input type="text" autocomplete="postal-code" />
        <input type="text" autocomplete="country" />
        <input type="password" autocomplete="current-password" />
        <input type="password" autocomplete="new-password" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for inputs with on/off autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="on" />
        <input type="text" autocomplete="off" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for inputs with valid compound autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="shipping name" />
        <input type="text" autocomplete="billing street-address" />
        <input type="text" autocomplete="section-blue shipping address-line1" />
        <input type="tel" autocomplete="tel home" />
        <input type="tel" autocomplete="tel work" />
        <input type="tel" autocomplete="tel mobile" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for select and textarea elements with valid autocomplete", async function () {
    const form = await fixture(html`
      <form>
        <select autocomplete="country">
          <option>USA</option>
        </select>
        <textarea autocomplete="street-address"></textarea>
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for inputs without autocomplete attribute", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" />
        <input type="email" />
        <select>
          <option>Test</option>
        </select>
        <textarea></textarea>
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for inputs with empty autocomplete attribute", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("fails for inputs with invalid autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="invalid" />
        <input type="text" autocomplete="notavalidtoken" />
        <input type="text" autocomplete="random-value" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
    ]);
  });

  it("fails for inputs with invalid compound autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="shipping invalid" />
        <input type="text" autocomplete="name invalid-token" />
        <input type="text" autocomplete="invalid-section name" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
    ]);
  });

  it("fails for inputs with tokens in wrong order", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="name shipping" />
        <input type="text" autocomplete="home tel" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
    ]);
  });

  it("handles case-insensitive autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="NAME" />
        <input type="text" autocomplete="Given-Name" />
        <input type="text" autocomplete="SHIPPING STREET-ADDRESS" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("fails for select and textarea with invalid autocomplete", async function () {
    const form = await fixture(html`
      <form>
        <select autocomplete="invalid-token">
          <option>Test</option>
        </select>
        <textarea autocomplete="notvalid"></textarea>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
    ]);
  });

  it("passes for credit card autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="cc-name" />
        <input type="text" autocomplete="cc-number" />
        <input type="text" autocomplete="cc-exp" />
        <input type="text" autocomplete="cc-exp-month" />
        <input type="text" autocomplete="cc-exp-year" />
        <input type="text" autocomplete="cc-csc" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for birthday autocomplete values", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="bday" />
        <input type="text" autocomplete="bday-day" />
        <input type="text" autocomplete="bday-month" />
        <input type="text" autocomplete="bday-year" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for webauthn token", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" autocomplete="username webauthn" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("passes for complex valid autocomplete with all optional tokens", async function () {
    const form = await fixture(html`
      <form>
        <input type="tel" autocomplete="section-contact shipping tel mobile" />
        <input type="text" autocomplete="section-blue billing address-line1" />
      </form>
    `);

    const results = await scanner.scan(form);
    expect(results).to.be.empty;
  });

  it("checks hidden and disabled inputs", async function () {
    const form = await fixture(html`
      <form>
        <input type="hidden" autocomplete="invalid-value" />
        <input type="text" autocomplete="bad-token" disabled />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
      {
        text: "Ensure the autocomplete attribute is correct and suitable for the form field",
        url: "https://dequeuniversity.com/rules/axe/4.4/autocomplete-valid",
      },
    ]);
  });
});
