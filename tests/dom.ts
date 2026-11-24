import { expect } from "@open-wc/testing";
import {
  isDocument,
  isHTMLElement,
  isHTMLTag,
  isShadowRoot,
  parentOrHost,
} from "../src/utils/dom.js";

describe("dom guards", function () {
  let frame: HTMLIFrameElement;

  beforeEach(async () => {
    frame = document.createElement("iframe");
    const loaded = new Promise((resolve) => {
      frame.addEventListener("load", resolve, { once: true });
    });
    frame.srcdoc = `<input id="field"><svg id="graphic"></svg><div id="host"></div>`;
    document.body.append(frame);
    await loaded;
  });

  afterEach(() => frame.remove());

  it("recognise elements from another window", () => {
    const doc = frame.contentDocument!;
    const field = doc.querySelector("#field")!;

    expect(field instanceof HTMLInputElement).to.be.false;
    expect(isHTMLElement(field)).to.be.true;
    expect(isHTMLTag(field, "input")).to.be.true;
    expect(isHTMLTag(field, "select", "textarea")).to.be.false;
    expect(isDocument(doc)).to.be.true;
  });

  it("do not treat SVG elements or other nodes as HTML elements", () => {
    const doc = frame.contentDocument!;

    expect(isHTMLElement(doc.querySelector("#graphic"))).to.be.false;
    expect(isHTMLElement(doc)).to.be.false;
    expect(isHTMLElement(null)).to.be.false;
  });

  it("walk from a shadow tree to its host", () => {
    const host = frame.contentDocument!.querySelector("#host")!;
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<span></span>";

    expect(isShadowRoot(root)).to.be.true;
    expect(isShadowRoot(host)).to.be.false;
    expect(parentOrHost(root.querySelector("span")!)).to.equal(host);
    expect(parentOrHost(host)).to.equal(host.parentElement);
  });
});
