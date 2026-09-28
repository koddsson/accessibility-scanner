import { expect } from "@open-wc/testing";
import { parseColor } from "../src/utils/color";

function renderWithCanvas(color: string) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
}

function expectClose(color: string, tolerance = 1) {
  const actual = parseColor(color);
  const expected = renderWithCanvas(color);
  expect(actual, color).to.not.equal(null);
  expect(Math.abs(actual!.r - expected.r), `${color} r`).to.be.at.most(
    tolerance,
  );
  expect(Math.abs(actual!.g - expected.g), `${color} g`).to.be.at.most(
    tolerance,
  );
  expect(Math.abs(actual!.b - expected.b), `${color} b`).to.be.at.most(
    tolerance,
  );
}

describe("parseColor", function () {
  it("parses hex colors", () => {
    expect(parseColor("#abc")).to.deep.equal({ r: 170, g: 187, b: 204, a: 1 });
    expect(parseColor("#aabbcc80")).to.deep.equal({
      r: 170,
      g: 187,
      b: 204,
      a: 128 / 255,
    });
  });

  it("parses legacy and modern rgb() syntax", () => {
    expect(parseColor("rgb(1, 2, 3)")).to.deep.equal({
      r: 1,
      g: 2,
      b: 3,
      a: 1,
    });
    expect(parseColor("rgba(1, 2, 3, 0.5)")).to.deep.equal({
      r: 1,
      g: 2,
      b: 3,
      a: 0.5,
    });
    expect(parseColor("rgb(1 2 3 / 50%)")).to.deep.equal({
      r: 1,
      g: 2,
      b: 3,
      a: 0.5,
    });
  });

  for (const color of [
    "hsl(120 50% 50%)",
    "hsl(0.25turn, 60%, 40%)",
    "hwb(200 20% 30%)",
    "lab(50 20 -30)",
    "lch(60% 40 120)",
    "oklab(0.6 0.1 -0.05)",
    "oklch(0.7 0.1 150)",
    "oklch(0.546 0.245 262.881)",
    "oklch(0.514 0.222 16.935)",
    "oklch(0.985 0.002 247.839)",
    "oklch(0.21 0.034 264.665)",
    "color(srgb 0.2 0.4 0.6)",
    "color(srgb-linear 0.2 0.4 0.6)",
    "color(display-p3 0.3 0.5 0.7)",
    "color(a98-rgb 0.3 0.5 0.7)",
    "color(prophoto-rgb 0.3 0.5 0.7)",
    "color(rec2020 0.3 0.5 0.7)",
    "color(xyz-d65 0.2 0.3 0.4)",
    "color(xyz-d50 0.2 0.3 0.4)",
    "rebeccapurple",
  ]) {
    it(`matches the browser for ${color}`, () => {
      expectClose(color);
    });
  }

  it("parses alpha on modern color functions", () => {
    expect(parseColor("oklch(1 0 0 / 0.25)")?.a).to.equal(0.25);
    expect(parseColor("oklab(0.5 0 0 / 40%)")?.a).to.equal(0.4);
  });

  it("treats none as zero", () => {
    expect(parseColor("oklch(1 none none)")).to.deep.equal({
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    });
  });

  it("returns null for invalid colors", () => {
    expect(parseColor("not-a-color")).to.equal(null);
    expect(parseColor("oklch(1 0)")).to.equal(null);
  });

  it("does not mutate the document", () => {
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe(document, { childList: true, subtree: true });
    for (const color of [
      "oklch(0.546 0.245 262.881)",
      "color(display-p3 1 0 0)",
      "rebeccapurple",
      "not-a-color",
    ]) {
      parseColor(color);
    }
    records.push(...observer.takeRecords());
    observer.disconnect();
    expect(records).to.be.empty;
  });
});
