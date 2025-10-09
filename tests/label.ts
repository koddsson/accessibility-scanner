import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import label from "../src/rules/label";

const scanner = new Scanner([label]);

describe("select-name", function () {
  it("fails when there are errors", async function () {
    const form = await fixture(html`
      <form action="#">
        <input type="text" />
        <textarea></textarea>
        <label><input type="text" /></label>
        <label><textarea></textarea></label>
        <label for="fail1"></label><input type="text" id="fail1" />
        <label for="fail2"></label><textarea id="fail2"></textarea>

        <label for="fail3" style="display: none;">Text</label>
        <input type="text" id="fail3" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
    ]);
  });

  it("fails when there are errors", async function () {
    const form = await fixture(html`
      <form action="#">
        <label>
          <label>
            <input type="text" />
          </label>
        </label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
    ]);
  });

  it("fails when the only label for a input is a `aria-labelledby` select element", async function () {
    const form = await fixture(html`
      <form action="#">
        <div>
          <label>
            <select id="fail4">
              <option selected="selected">Chosen</option>
              <option>Not Selected</option>
            </select>
          </label>
          <input aria-labelledby="fail4" type="text" />
        </div>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
    ]);
  });

  it("fails when the only label for a input is a select element", async function () {
    const form = await fixture(html`
      <form action="#">
        <div>
          <label for="fail5">
            <select>
              <option selected="selected">Chosen</option>
              <option>Not Selected</option>
            </select>
          </label>
          <input type="text" id="fail5" />
        </div>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form <input> elements must have labels",
        url: "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription",
      },
    ]);
  });

  it("passes when there are no errors", async function () {
    const form = await fixture(html`
      <form action="#">
        <input type="text" aria-label="label" id="pass1" />
        <textarea aria-label="label" id="pass3"></textarea>
        <input type="text" aria-labelledby="label" id="pass4" />
        <textarea aria-labelledby="label" id="pass6"></textarea>
        <div id="label">Label</div>
        <label>Label <input type="text" id="pass7" /></label>
        <label>Label <textarea id="pass9"></textarea></label>

        <label for="pass10">Label</label>
        <input type="text" id="pass10" />
        <label for="pass12">Label</label>
        <textarea id="pass12"></textarea>

        <input id="pass13" title="Label" />
        <textarea id="pass15" title="Label"></textarea>

        <div>
          <label for="pass-gh1176" style="display:none"> Hello world </label>
          <input id="pass-gh1176" title="Hi" />
        </div>

        <input id="pass16" role="none" disabled />
        <input id="pass17" role="presentation" disabled />

        <div id="hiddenlabel" aria-hidden="true">Hidden label</div>
        <input type="text" id="pass18" aria-labelledby="hiddenlabel" />

        <input type="hidden" />

        <input type="submit" value="Submit" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});
