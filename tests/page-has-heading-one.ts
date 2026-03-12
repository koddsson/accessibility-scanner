import { expect, fixture, html } from "@open-wc/testing";
import { scan } from "../src/scanner";
import pageHasHeadingOne from "../src/rules/page-has-heading-one";

/**
 * Create a `<html></html>` in a iframe so that we aren't using the `<html>` element of the test runner.
 */
async function createHTMLElement(htmlString: string): Promise<HTMLElement> {
  const iframe = (await fixture(
    html`<iframe srcdoc="<!DOCTYPE html>${htmlString}"></iframe>`,
  )) as HTMLIFrameElement;

  // Wait for the iframe to finish loading its srcdoc content before accessing the document.
  await new Promise<void>((resolve) => {
    if (iframe.contentDocument?.readyState === "complete") {
      resolve();
    } else {
      iframe.addEventListener("load", () => resolve(), { once: true });
    }
  });

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
