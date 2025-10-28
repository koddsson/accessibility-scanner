import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import serverSideImageMap from "../src/rules/server-side-image-map";

const scanner = new Scanner([serverSideImageMap]);

describe("server-side-image-map", function () {
  it("returns error for img with ismap attribute", async () => {
    const element = await fixture(html`
      <a href="/maps">
        <img src="image.jpg" ismap alt="Map" />
      </a>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures that server-side image maps are not used",
        url: "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription",
      },
    ]);
  });

  it("returns error for img with ismap even without href parent", async () => {
    const element = await fixture(html` <img src="image.jpg" ismap alt="Map" /> `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures that server-side image maps are not used",
        url: "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription",
      },
    ]);
  });

  it("returns errors for multiple img elements with ismap", async () => {
    const element = await fixture(html`
      <div>
        <a href="/map1">
          <img src="map1.jpg" ismap alt="First Map" />
        </a>
        <a href="/map2">
          <img src="map2.jpg" ismap alt="Second Map" />
        </a>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "Ensures that server-side image maps are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription",
    });
    expect(results[1]).to.eql({
      text: "Ensures that server-side image maps are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription",
    });
  });

  it("doesn't return errors for img without ismap attribute", async () => {
    const element = await fixture(html`
      <a href="/page">
        <img src="image.jpg" alt="Normal image" />
      </a>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("doesn't return errors for img with usemap (client-side image map)", async () => {
    const element = await fixture(html`
      <div>
        <img src="image.jpg" usemap="#map" alt="Map" />
        <map name="map">
          <area shape="rect" coords="0,0,50,50" href="/area1" alt="Area 1" />
        </map>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("doesn't return errors for regular images", async () => {
    const element = await fixture(html`
      <div>
        <img src="photo.jpg" alt="A photo" />
        <img src="logo.png" alt="Company logo" />
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("detects ismap in nested structure", async () => {
    const element = await fixture(html`
      <div>
        <section>
          <article>
            <a href="/navigation">
              <img src="nav.jpg" ismap alt="Navigation" />
            </a>
          </article>
        </section>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures that server-side image maps are not used",
        url: "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription",
      },
    ]);
  });
});
