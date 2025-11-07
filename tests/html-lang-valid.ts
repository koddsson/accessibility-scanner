import { expect } from "@open-wc/testing";
import htmlLangValid from "../src/rules/html-lang-valid";

describe("html-lang-valid", function () {
  describe("validation function", function () {
    it("detects invalid lang on html element", () => {
      // Create a test document
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="zzz"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "The lang attribute of the <html> element must have a valid value",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-lang-valid",
        },
      ]);
    });

    it("detects malformed lang attribute", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en-US-GB"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "The lang attribute of the <html> element must have a valid value",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-lang-valid",
        },
      ]);
    });

    it("detects numeric lang attribute", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="123"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "The lang attribute of the <html> element must have a valid value",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-lang-valid",
        },
      ]);
    });

    it("passes for valid lang attribute", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes for valid lang attribute with region", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en-US"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes for valid lang attribute with different case", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="FR"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes for valid lang with extra whitespace", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="  en  "><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes for html element without lang attribute", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        "<!DOCTYPE html><html><body></body></html>",
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      // This rule doesn't check for missing lang (that's html-has-lang)
      expect(results).to.be.empty;
    });

    it("passes for html element with empty lang attribute", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang=""><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlLangValid(htmlElement);
      // This rule doesn't check for empty lang (that's html-has-lang)
      expect(results).to.be.empty;
    });
  });
});
