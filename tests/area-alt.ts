import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../src/scanner";

describe.skip("area-alt", function () {
  it("empty alt attribute fails", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" alt="" />
        </map>
      </div>
    `);

    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  });

  it("area element with a valid alt attribute has no errors", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" alt="monkeys" />
        </map>
      </div>
    `);

    expect(await scan(container)).to.be.empty;
  });

  it("area element with a valid aria-label attribute has no errors", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" aria-label="monkeys" />
        </map>
      </div>
    `);

    expect(await scan(container)).to.be.empty;
  });

  it("area element with a valid aria-labelledby attribute has no errors", async () => {
    const container = await fixture(html`
      <div>
        <div id="monkeys">Bananas</div>
        <map>
          <area href="#" aria-labelledby="monkeys" />
        </map>
      </div>
    `);

    expect(await scan(container)).to.be.empty;
  });

  it("empty aria-label attribute fails", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" aria-label="" />
        </map>
      </div>
    `);

    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  });

  it("invalid aria-labelledby attribute fails", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" aria-labelledby="nomatchy" />
        </map>
      </div>
    `);

    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  });

  it("empty aria-labelledby attribute fails", async () => {
    const container = await fixture(html`
      <div>
        <map>
          <area href="#" aria-labelledby="" />
        </map>
      </div>
    `);

    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  });

  it("area elements without a href don't trigger errors", async () => {
    const container = await fixture(
      html` <div>
        <map>
          <!-- no href, not violations -->
          <area alt="" />
          <area aria-label="" />
          <area aria-labelledby="" />
          <area aria-labelledby="nomatchy" />
        </map>
      </div>`,
    );

    expect(await scan(container)).to.be.empty;
  });

  it("works with shadow dom", async () => {
    class MyEl extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `<map>
          <area href="#" alt="" />
        </map>`;
      }
    }
    customElements.define("my-el", MyEl);

    const container = await fixture(html`<my-el></my-el>`);

    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  });
});
