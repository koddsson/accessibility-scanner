import { expect } from "@open-wc/testing";
import { scan } from "../src/scanner";
import pageHasHeadingOne from "../src/rules/page-has-heading-one";

/**
 * Create a `<html></html>` in a iframe so that we aren't using the `<html>` element of the test runner.
 * Creates the iframe manually to attach the load listener before DOM insertion,
 * avoiding the race condition where the load event fires before we start listening.
 */
async function createHTMLElement(htmlString: string): Promise<HTMLElement> {
  const iframe = document.createElement("iframe");
  const loaded = new Promise<void>((resolve) => {
    iframe.addEventListener("load", () => resolve(), { once: true });
  });
  iframe.srcdoc = `<!DOCTYPE html>${htmlString}`;
  document.body.appendChild(iframe);
  await loaded;

  return iframe.contentDocument!.querySelector("html")!;
}

describe("page-has-heading-one", function () {
  describe("has no errors if", function () {
    it("page contains an h1 element", async () => {
      const container = await createHTMLElement(
        "<html><body><h1>Main Heading</h1><p>Content</p></body></html>",
      );

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });

    it("page contains a role=heading with aria-level=1", async () => {
      const container = await createHTMLElement(
        '<html><body><div role="heading" aria-level="1">Main Heading</div></body></html>',
      );

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });

    it("h1 is nested inside other elements", async () => {
      const container = await createHTMLElement(
        "<html><body><div><section><h1>Nested</h1></section></div></body></html>",
      );

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("page contains only an h2 element", async () => {
      const container = await createHTMLElement(
        "<html><body><h2>Secondary</h2></body></html>",
      );

      const results = (await scan(container, [pageHasHeadingOne])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Page should contain a level-one heading",
      );
      expect(results[0].url).to.include("page-has-heading-one");
    });

    it("page has no headings", async () => {
      const container = await createHTMLElement(
        "<html><body></body></html>",
      );

      const results = (await scan(container, [pageHasHeadingOne])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Page should contain a level-one heading",
      );
    });
  });
});
