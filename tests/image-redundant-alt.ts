import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import imageRedundantAlt from "../src/rules/image-redundant-alt";

const scanner = new Scanner([imageRedundantAlt]);

describe("image-redundant-alt", function () {
  it("passes when img has unique alt text", async function () {
    const el = await fixture(
      html`<div>Some text <img src="img.jpg" alt="A unique description" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("fails when img alt matches parent text", async function () {
    const el = await fixture(
      html`<div>A cute puppy <img src="img.jpg" alt="A cute puppy" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.have.property("id", "image-redundant-alt");
    expect(results[0]).to.have.property("element");
    expect(results[0]).to.have.property("text");
    expect(results[0]).to.have.property("url");
  });

  it("passes when img has empty alt", async function () {
    const el = await fixture(
      html`<div>Some text <img src="img.jpg" alt="" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("skips img without alt attribute", async function () {
    const el = await fixture(
      html`<div>Some text <img src="img.jpg" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("passes when img alt differs from surrounding text", async function () {
    const el = await fixture(
      html`<div>Welcome to our site <img src="img.jpg" alt="Company logo" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("fails case-insensitively", async function () {
    const el = await fixture(
      html`<div>Hello World <img src="img.jpg" alt="hello world" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.have.lengthOf(1);
  });

  it("passes when img alt has only whitespace", async function () {
    const el = await fixture(
      html`<div>Some text <img src="img.jpg" alt="   " /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("fails when alt text is a substring of parent text", async function () {
    const el = await fixture(
      html`<div>Click here to see a cute puppy photo <img src="img.jpg" alt="cute puppy" /></div>`,
    );
    const results = await scanner.scan(el);
    expect(results).to.have.lengthOf(1);
  });
});
