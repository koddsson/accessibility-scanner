import { expect, fixture, html } from "@open-wc/testing";
import { scan } from "../src/scanner";
import documentTitle from "../src/rules/document-title";

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

describe("document-title", function () {
  describe("has errors if", function () {
    it("document has no <title> element", async () => {
      const container = await createHTMLElement("<html><head></head></html>");

      const results = (await scan(container, [documentTitle])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.include("<title>");
      expect(results[0].url).to.include("document-title");
    });

    it("document has empty <title> element", async () => {
      const container = await createHTMLElement(
        "<html><head><title></title></head></html>",
      );

      const results = (await scan(container, [documentTitle])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.include("<title>");
    });

    it("document has <title> element with only whitespace", async () => {
      const container = await createHTMLElement(
        "<html><head><title>    </title></head></html>",
      );

      const results = (await scan(container, [documentTitle])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.include("<title>");
    });

    it("document has <title> element with newlines only", async () => {
      const container = await createHTMLElement(
        "<html><head><title>\n\n\n</title></head></html>",
      );

      const results = (await scan(container, [documentTitle])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
    });
  });

  describe("has no errors if", function () {
    it("document has valid <title> element", async () => {
      const container = await createHTMLElement(
        "<html><head><title>Valid Page Title</title></head></html>",
      );

      const results = await scan(container, [documentTitle]);

      expect(results).to.be.empty;
    });

    it("document has <title> with leading/trailing whitespace but valid content", async () => {
      const container = await createHTMLElement(
        "<html><head><title>  Page Title  </title></head></html>",
      );

      const results = await scan(container, [documentTitle]);

      expect(results).to.be.empty;
    });

    it("document has <title> with special characters", async () => {
      const container = await createHTMLElement(
        "<html><head><title>Page Title - Section & More!</title></head></html>",
      );

      const results = await scan(container, [documentTitle]);

      expect(results).to.be.empty;
    });

    it("document has <title> with single character", async () => {
      const container = await createHTMLElement(
        "<html><head><title>A</title></head></html>",
      );

      const results = await scan(container, [documentTitle]);

      expect(results).to.be.empty;
    });
  });
});
