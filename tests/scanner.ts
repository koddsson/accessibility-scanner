import { fixture, html, expect } from "@open-wc/testing";
import { Scanner, Rule } from "../src/scanner";
import ariaRequiredChildren from "../src/rules/aria-required-children";
import emptyHeading from "../src/rules/empty-heading";
import duplicateId from "../src/rules/duplicate-id";
import roleImgAlt from "../src/rules/role-img-alt";

describe("scanner", function () {
  describe("hidden content", function () {
    it("does not report elements that are not rendered", async () => {
      const container = await fixture(html`
        <div>
          <dialog>
            <input aria-label="Search" />
            <ul role="listbox" aria-label="Results" hidden></ul>
          </dialog>
          <div style="display: none"><h2></h2></div>
          <div hidden><ul role="list"></ul></div>
        </div>
      `);
      const scanner = new Scanner([ariaRequiredChildren, emptyHeading]);

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("still reports the same markup once it is rendered", async () => {
      const container = await fixture(html`
        <div>
          <ul role="listbox" aria-label="Results"></ul>
          <h2></h2>
        </div>
      `);
      const scanner = new Scanner([ariaRequiredChildren, emptyHeading]);

      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });

    it("keeps findings from rules that opt in to hidden content", async () => {
      const container = await fixture(html`
        <div hidden>
          <p id="dup"></p>
          <p id="dup"></p>
        </div>
      `);
      const scanner = new Scanner([duplicateId]);

      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });

    it("lets custom rules opt in with includeHidden", async () => {
      const container = await fixture(html`<div hidden>content</div>`);
      const report: Rule = (element) => [
        { id: "custom", text: "custom", url: "", element },
      ];
      const reportHidden: Rule = (element) => [
        { id: "custom", text: "custom", url: "", element },
      ];
      reportHidden.includeHidden = true;

      expect(await new Scanner([report]).scan(container)).to.be.empty;
      expect(await new Scanner([reportHidden]).scan(container)).to.have.lengthOf(
        1,
      );
    });
  });

  describe("aria-hidden content", function () {
    it("does not report elements inside aria-hidden", async () => {
      const container = await fixture(html`
        <div>
          <div role="img" aria-hidden="true"></div>
          <div aria-hidden="true"><div role="img"></div></div>
        </div>
      `);
      const scanner = new Scanner([roleImgAlt]);

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("still reports elements with aria-hidden set to false", async () => {
      const container = await fixture(
        html`<div><div role="img" aria-hidden="false"></div></div>`,
      );
      const scanner = new Scanner([roleImgAlt]);

      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("lets custom rules opt in with includeAriaHidden", async () => {
      const container = await fixture(
        html`<div aria-hidden="true">content</div>`,
      );
      const report: Rule = (element) => [
        { id: "custom", text: "custom", url: "", element },
      ];
      const reportAriaHidden: Rule = (element) => [
        { id: "custom", text: "custom", url: "", element },
      ];
      reportAriaHidden.includeAriaHidden = true;

      expect(await new Scanner([report]).scan(container)).to.be.empty;
      expect(
        await new Scanner([reportAriaHidden]).scan(container),
      ).to.have.lengthOf(1);
    });
  });
});
