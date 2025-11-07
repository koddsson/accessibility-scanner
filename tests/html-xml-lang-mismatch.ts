import { expect } from "@open-wc/testing";
import htmlXmlLangMismatch from "../src/rules/html-xml-lang-mismatch";

describe("html-xml-lang-mismatch", function () {
  describe("validation function", function () {
    it("detects mismatch between lang and xml:lang", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en" xml:lang="fr"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-xml-lang-mismatch",
        },
      ]);
    });

    it("detects mismatch with different cases", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="EN" xml:lang="FR"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-xml-lang-mismatch",
        },
      ]);
    });

    it("passes when lang and xml:lang match exactly", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en" xml:lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when lang and xml:lang match with different cases", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="EN" xml:lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when lang and xml:lang have same primary subtag but different regions", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en-US" xml:lang="en-GB"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when only lang attribute is present", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when only xml:lang attribute is present", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html xml:lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when neither attribute is present", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        "<!DOCTYPE html><html><body></body></html>",
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when lang is empty", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="" xml:lang="en"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when xml:lang is empty", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en" xml:lang=""><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("passes when lang and xml:lang match with whitespace", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="  en  " xml:lang="  en  "><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });

    it("detects mismatch with complex language tags", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en-US-x-custom" xml:lang="fr-FR-x-custom"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page",
          url: "https://dequeuniversity.com/rules/axe/4.4/html-xml-lang-mismatch",
        },
      ]);
    });

    it("passes when complex language tags have same primary subtag", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        '<!DOCTYPE html><html lang="en-US-x-custom" xml:lang="en-GB-x-different"><body></body></html>',
        "text/html",
      );
      const htmlElement = doc.documentElement;

      const results = htmlXmlLangMismatch(htmlElement);
      expect(results).to.be.empty;
    });
  });
});
