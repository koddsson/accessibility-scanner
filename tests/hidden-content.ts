import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import hiddenContent from "../src/rules/hidden-content";

const scanner = new Scanner([hiddenContent]);

describe("hidden-content", function () {
  it("returns errors for elements with hidden attribute", async () => {
    const element = await fixture(html`
      <div>
        <p hidden>This is hidden content</p>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });

  it("returns errors for elements with aria-hidden='true'", async () => {
    const element = await fixture(html`
      <div>
        <span aria-hidden="true">This is aria hidden</span>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });

  it("returns errors for elements with display:none", async () => {
    const element = await fixture(html`
      <div>
        <div style="display: none;">Hidden by display none</div>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });

  it("returns errors for elements with visibility:hidden", async () => {
    const element = await fixture(html`
      <div>
        <p style="visibility: hidden;">Hidden by visibility</p>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });

  it("returns errors for multiple hidden elements", async () => {
    const element = await fixture(html`
      <div>
        <p hidden>Hidden 1</p>
        <span aria-hidden="true">Hidden 2</span>
        <div style="display: none;">Hidden 3</div>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(3);
  });

  it("doesn't return errors for visible elements", async () => {
    const element = await fixture(html`
      <div>
        <p>Visible paragraph</p>
        <span>Visible span</span>
        <div>Visible div</div>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("doesn't return errors for aria-hidden='false'", async () => {
    const element = await fixture(html`
      <div>
        <span aria-hidden="false">This is visible</span>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors for nested hidden content", async () => {
    const element = await fixture(html`
      <div>
        <section hidden>
          <p>Nested paragraph</p>
          <span>Nested span</span>
        </section>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    // Only the section with hidden attribute should be reported
    expect(results).to.have.lengthOf(1);
  });

  it("handles mixed visibility states", async () => {
    const element = await fixture(html`
      <div>
        <p hidden>Hidden paragraph</p>
        <p>Visible paragraph</p>
        <span aria-hidden="true">Hidden span</span>
        <span>Visible span</span>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
  });

  it("returns error if the scanned element itself is hidden", async () => {
    const element = await fixture(html` <div hidden>Hidden content</div> `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });

  it("returns errors for SVG elements with aria-hidden='true'", async () => {
    const element = await fixture(html`
      <div>
        <svg aria-hidden="true" width="100" height="100">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Informs users about hidden content.",
      url: "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription",
    });
  });
});
