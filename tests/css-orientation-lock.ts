import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import cssOrientationLock from "../src/rules/css-orientation-lock";

const scanner = new Scanner([cssOrientationLock]);

describe("css-orientation-lock", function () {
  it("passes when no orientation locking is present", async () => {
    const element = await fixture(html`
      <div>
        <style>
          body {
            margin: 0;
          }
        </style>
        <p>Content without orientation lock</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("passes when transform is used without orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          .rotated {
            transform: rotate(90deg);
          }
        </style>
        <p class="rotated">Rotated content</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("passes when orientation media query exists without rotation transform", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: landscape) {
            body {
              background: blue;
            }
          }
        </style>
        <p>Content with orientation query but no rotation</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("passes when rotation is 45 degrees in orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: portrait) {
            .content {
              transform: rotate(45deg);
            }
          }
        </style>
        <p class="content">Content with non-locking rotation</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("fails when rotate(90deg) is used in portrait orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: portrait) {
            body {
              transform: rotate(90deg);
            }
          }
        </style>
        <p>Content locked to landscape</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
    expect(results[0].text).to.equal(
      "Ensures content is not locked to any specific display orientation, and the content is operable in all display orientations"
    );
    expect(results[0].url).to.equal(
      "https://dequeuniversity.com/rules/axe/4.4/css-orientation-lock?application=RuleDescription"
    );
  });

  it("fails when rotate(-90deg) is used in landscape orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: landscape) {
            .content {
              transform: rotate(-90deg);
            }
          }
        </style>
        <p class="content">Content locked to portrait</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("fails when rotate(270deg) is used in orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: portrait) {
            body {
              transform: rotate(270deg);
            }
          }
        </style>
        <p>Content locked with 270deg rotation</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("fails when rotateZ(90deg) is used in orientation media query", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: landscape) {
            .element {
              transform: rotateZ(90deg);
            }
          }
        </style>
        <p class="element">Content with rotateZ</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("fails with rotation and whitespace variations", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: portrait) {
            .test {
              transform: rotate( 90deg );
            }
          }
        </style>
        <p class="test">Content with whitespace in transform</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("only reports error once per document", async () => {
    const element = await fixture(html`
      <div>
        <style>
          @media (orientation: portrait) {
            .one {
              transform: rotate(90deg);
            }
            .two {
              transform: rotate(-90deg);
            }
          }
        </style>
        <p class="one">First locked element</p>
        <p class="two">Second locked element</p>
      </div>
    `);

    const results = await scanner.scan(element);
    // Should only report once per document, not once per violation
    expect(results).to.have.lengthOf(1);
  });
});
