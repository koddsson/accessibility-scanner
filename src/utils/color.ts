/**
 * Color utilities for contrast calculation following WCAG 2.0 standards
 * https://www.w3.org/TR/WCAG21/#contrast-minimum
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Parse a CSS color string to RGB values without touching the DOM.
 * Supports hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch() and
 * color(); anything else (e.g. named colors) goes through a detached canvas.
 */
export function parseColor(color: string): RGB | null {
  if (!color) return { r: 255, g: 255, b: 255, a: 0 };
  const value = color.trim().toLowerCase();
  if (value === "transparent") return { r: 255, g: 255, b: 255, a: 0 };
  return parseColorSyntax(value) ?? parseWithCanvas(value);
}

type Vec3 = [number, number, number];
type Matrix = [Vec3, Vec3, Vec3];

interface Component {
  value: number;
  unit: "" | "%" | "deg" | "rad" | "grad" | "turn";
}

const NONE: Component = { value: 0, unit: "" };

function parseColorSyntax(value: string): RGB | null {
  const hex = value.match(/^#([\da-f]+)$/);
  if (hex) return parseHex(hex[1]);

  const fn = value.match(/^([a-z-]+)\((.*)\)$/);
  if (!fn) return null;
  const args = parseArguments(fn[2]);
  if (!args) return null;
  const { space, channels, alpha } = args;
  if (fn[1] === "color") return parseColorFunction(space, channels, alpha);
  if (space !== undefined || channels.length !== 3) return null;

  switch (fn[1]) {
    case "rgb":
    case "rgba": {
      const [r, g, b] = channels.map((c) =>
        c.unit === "%" ? c.value / 100 : c.value / 255,
      );
      return toRGB([r, g, b], alpha);
    }
    case "hsl":
    case "hsla": {
      const rgb = hslToRgb(
        normalizeHue(toHue(channels[0])),
        clamp(channels[1].value / 100),
        clamp(channels[2].value / 100),
      );
      return { ...rgb, a: alpha };
    }
    case "hwb": {
      return toRGB(
        hwbToSrgb(
          toHue(channels[0]),
          channels[1].value / 100,
          channels[2].value / 100,
        ),
        alpha,
      );
    }
    case "lab": {
      const [l, a, b] = channels;
      return fromXyzD50(
        labToXyzD50(percent(l, 100), percent(a, 125), percent(b, 125)),
        alpha,
      );
    }
    case "lch": {
      const [l, c, h] = channels;
      const [a, b] = polarToCartesian(percent(c, 150), toHue(h));
      return fromXyzD50(labToXyzD50(percent(l, 100), a, b), alpha);
    }
    case "oklab": {
      const [l, a, b] = channels;
      return fromLinearSrgb(
        oklabToLinearSrgb(percent(l, 1), percent(a, 0.4), percent(b, 0.4)),
        alpha,
      );
    }
    case "oklch": {
      const [l, c, h] = channels;
      const [a, b] = polarToCartesian(percent(c, 0.4), toHue(h));
      return fromLinearSrgb(oklabToLinearSrgb(percent(l, 1), a, b), alpha);
    }
    default: {
      return null;
    }
  }
}

function parseHex(digits: string): RGB | null {
  if (digits.length === 3 || digits.length === 4) {
    digits = [...digits].map((d) => d + d).join("");
  }
  if (digits.length !== 6 && digits.length !== 8) return null;
  const byte = (i: number) => parseInt(digits.slice(i, i + 2), 16);
  return {
    r: byte(0),
    g: byte(2),
    b: byte(4),
    a: digits.length === 8 ? byte(6) / 255 : 1,
  };
}

// Accepts both the legacy comma syntax and the modern space/slash syntax.
function parseArguments(
  body: string,
): { space?: string; channels: Component[]; alpha: number } | null {
  const parts = body.split("/");
  if (parts.length > 2) return null;
  const tokens = parts[0].split(/[\s,]+/).filter(Boolean);
  if (parts.length === 1 && body.includes(",") && tokens.length === 4) {
    parts.push(tokens.pop()!);
  }
  const space =
    /^[a-z][\da-z-]*$/.test(tokens[0] ?? "") && tokens[0] !== "none"
      ? tokens.shift()
      : undefined;

  const channels: Component[] = [];
  for (const token of tokens) {
    const component = parseComponent(token);
    if (!component) return null;
    channels.push(component);
  }

  let alpha = 1;
  if (parts.length === 2) {
    const component = parseComponent(parts[1].trim());
    if (!component) return null;
    alpha = clamp(
      component.unit === "%" ? component.value / 100 : component.value,
    );
  }
  return { space, channels, alpha };
}

function parseComponent(token: string): Component | null {
  if (token === "none") return NONE;
  const match = token.match(
    /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|deg|rad|grad|turn)?$/,
  );
  if (!match) return null;
  return {
    value: parseFloat(match[1]),
    unit: (match[2] ?? "") as Component["unit"],
  };
}

function percent(component: Component, full: number): number {
  return component.unit === "%"
    ? (component.value / 100) * full
    : component.value;
}

function toHue(component: Component): number {
  switch (component.unit) {
    case "rad": {
      return (component.value * 180) / Math.PI;
    }
    case "grad": {
      return component.value * 0.9;
    }
    case "turn": {
      return component.value * 360;
    }
    default: {
      return component.value;
    }
  }
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function polarToCartesian(chroma: number, hue: number): [number, number] {
  const radians = (hue * Math.PI) / 180;
  return [chroma * Math.cos(radians), chroma * Math.sin(radians)];
}

function mapVec([x, y, z]: Vec3, fn: (c: number) => number): Vec3 {
  return [fn(x), fn(y), fn(z)];
}

function multiply(m: Matrix, [x, y, z]: Vec3): Vec3 {
  return [
    m[0][0] * x + m[0][1] * y + m[0][2] * z,
    m[1][0] * x + m[1][1] * y + m[1][2] * z,
    m[2][0] * x + m[2][1] * y + m[2][2] * z,
  ];
}

// Matrices and transfer functions follow the CSS Color 4 sample code.
const D50_TO_D65: Matrix = [
  [0.955_473_421_488_075, -0.023_098_454_948_764_71, 0.063_259_243_200_570_72],
  [
    -0.028_369_709_333_863_7, 1.009_995_398_081_304_1,
    0.021_041_441_191_917_323,
  ],
  [
    0.012_314_014_864_481_998, -0.020_507_649_298_898_964,
    1.330_365_926_242_124,
  ],
];

const XYZ_D65_TO_LINEAR_SRGB: Matrix = [
  [3.240_969_941_904_522_6, -1.537_383_177_570_094, -0.498_610_760_293_003_4],
  [-0.969_243_636_280_879_6, 1.875_967_501_507_720_2, 0.041_555_057_407_175_59],
  [
    0.055_630_079_696_993_66, -0.203_976_958_888_976_52,
    1.056_971_514_242_878_6,
  ],
];

const DISPLAY_P3_TO_XYZ_D65: Matrix = [
  [0.486_570_948_648_216_26, 0.265_667_693_169_092_94, 0.198_217_285_234_362_5],
  [0.228_974_564_069_748_7, 0.691_738_521_836_506_2, 0.079_286_914_093_745],
  [0, 0.045_113_381_858_902_57, 1.043_944_368_900_975_7],
];

const A98_TO_XYZ_D65: Matrix = [
  [0.576_669_042_910_130_5, 0.185_558_237_906_546_3, 0.188_228_646_234_994_7],
  [0.297_344_975_250_536_05, 0.627_363_566_255_466_1, 0.075_291_458_493_997_88],
  [0.027_031_361_386_412_34, 0.070_688_852_535_827_23, 0.991_337_536_837_638_8],
];

const REC2020_TO_XYZ_D65: Matrix = [
  [0.636_958_048_301_291_4, 0.144_616_903_586_208_32, 0.168_880_975_164_172_1],
  [0.262_700_212_011_267_1, 0.677_998_071_518_870_8, 0.059_301_716_469_861_96],
  [0, 0.028_072_693_049_087_428, 1.060_985_057_710_791],
];

const PROPHOTO_TO_XYZ_D50: Matrix = [
  [0.797_766_644_900_642_3, 0.135_181_297_400_533_08, 0.031_347_734_128_392_2],
  [0.288_074_828_819_401_3, 0.711_835_234_241_873, 0.000_089_936_938_725_64],
  [0, 0, 0.825_104_602_510_460_2],
];

function srgbToLinear(c: number): number {
  const abs = Math.abs(c);
  return abs <= 0.040_45
    ? c / 12.92
    : Math.sign(c) * Math.pow((abs + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const abs = Math.abs(c);
  return abs > 0.003_130_8
    ? Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055)
    : 12.92 * c;
}

function a98ToLinear(c: number): number {
  return Math.sign(c) * Math.pow(Math.abs(c), 563 / 256);
}

function prophotoToLinear(c: number): number {
  const abs = Math.abs(c);
  return abs <= 16 / 512 ? c / 16 : Math.sign(c) * Math.pow(abs, 1.8);
}

function rec2020ToLinear(c: number): number {
  const alpha = 1.099_296_826_809_44;
  const beta = 0.018_053_968_510_807;
  const abs = Math.abs(c);
  return abs < beta * 4.5
    ? c / 4.5
    : Math.sign(c) * Math.pow((abs + alpha - 1) / alpha, 1 / 0.45);
}

function hwbToSrgb(hue: number, white: number, black: number): Vec3 {
  if (white + black >= 1) {
    const gray = white / (white + black);
    return [gray, gray, gray];
  }
  const { r, g, b } = hslToRgb(normalizeHue(hue), 1, 0.5, false);
  const scale = 1 - white - black;
  return [r * scale + white, g * scale + white, b * scale + white];
}

function labToXyzD50(l: number, a: number, b: number): Vec3 {
  const kappa = 24_389 / 27;
  const epsilon = 216 / 24_389;
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const x = fx ** 3 > epsilon ? fx ** 3 : (116 * fx - 16) / kappa;
  const y = l > kappa * epsilon ? fy ** 3 : l / kappa;
  const z = fz ** 3 > epsilon ? fz ** 3 : (116 * fz - 16) / kappa;
  return [(x * 0.3457) / 0.3585, y, (z * (1 - 0.3457 - 0.3585)) / 0.3585];
}

function oklabToLinearSrgb(l: number, a: number, b: number): Vec3 {
  const lms = [
    l + 0.396_337_777_4 * a + 0.215_803_757_3 * b,
    l - 0.105_561_345_8 * a - 0.063_854_172_8 * b,
    l - 0.089_484_177_5 * a - 1.291_485_548 * b,
  ].map((v) => v ** 3) as Vec3;
  return multiply(
    [
      [4.076_741_662_1, -3.307_711_591_3, 0.230_969_929_2],
      [-1.268_438_004_6, 2.609_757_401_1, -0.341_319_396_5],
      [-0.004_196_086_3, -0.703_418_614_7, 1.707_614_701],
    ],
    lms,
  );
}

function parseColorFunction(
  space: string | undefined,
  channels: Component[],
  alpha: number,
): RGB | null {
  if (channels.length !== 3) return null;
  const c = channels.map((channel) => percent(channel, 1)) as Vec3;
  switch (space) {
    case "srgb": {
      return toRGB(c, alpha);
    }
    case "srgb-linear": {
      return fromLinearSrgb(c, alpha);
    }
    case "display-p3": {
      return fromXyzD65(
        multiply(DISPLAY_P3_TO_XYZ_D65, mapVec(c, srgbToLinear)),
        alpha,
      );
    }
    case "a98-rgb": {
      return fromXyzD65(
        multiply(A98_TO_XYZ_D65, mapVec(c, a98ToLinear)),
        alpha,
      );
    }
    case "prophoto-rgb": {
      return fromXyzD50(
        multiply(PROPHOTO_TO_XYZ_D50, mapVec(c, prophotoToLinear)),
        alpha,
      );
    }
    case "rec2020": {
      return fromXyzD65(
        multiply(REC2020_TO_XYZ_D65, mapVec(c, rec2020ToLinear)),
        alpha,
      );
    }
    case "xyz":
    case "xyz-d65": {
      return fromXyzD65(c, alpha);
    }
    case "xyz-d50": {
      return fromXyzD50(c, alpha);
    }
    default: {
      return null;
    }
  }
}

function toRGB(srgb: Vec3, alpha: number): RGB {
  const [r, g, b] = srgb.map((c) => Math.round(clamp(c) * 255));
  return { r, g, b, a: alpha };
}

function fromLinearSrgb(linear: Vec3, alpha: number): RGB {
  return toRGB(mapVec(linear, linearToSrgb), alpha);
}

function fromXyzD65(xyz: Vec3, alpha: number): RGB {
  return fromLinearSrgb(multiply(XYZ_D65_TO_LINEAR_SRGB, xyz), alpha);
}

function fromXyzD50(xyz: Vec3, alpha: number): RGB {
  return fromXyzD65(multiply(D50_TO_D65, xyz), alpha);
}

const canvasCache = new Map<string, RGB | null>();
let canvasContext: CanvasRenderingContext2D | null | undefined;

// The canvas is never attached, so parsing here cannot invalidate layout.
function parseWithCanvas(value: string): RGB | null {
  if (canvasCache.has(value)) {
    const cached = canvasCache.get(value);
    return cached ? { ...cached } : null;
  }
  if (canvasContext === undefined) {
    canvasContext =
      typeof document === "undefined"
        ? null
        : document
            .createElement("canvas")
            .getContext("2d", { willReadFrequently: true });
  }
  const ctx = canvasContext;
  if (!ctx) return null;

  ctx.fillStyle = "#000000";
  ctx.fillStyle = value;
  const first = ctx.fillStyle;
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = value;
  let result: RGB | null = null;
  if (first === ctx.fillStyle) {
    result = parseColorSyntax(String(first).toLowerCase());
    if (!result) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      result = { r, g, b, a: a / 255 };
    }
  }
  if (canvasCache.size >= 1000) canvasCache.clear();
  canvasCache.set(value, result);
  return result ? { ...result } : null;
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number, round = true): RGB {
  h = h / 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  if (!round) return { r, g, b };
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Flatten a color with alpha over a background color
 */
export function flattenColor(foreground: RGB, background: RGB): RGB {
  const alpha = foreground.a ?? 1;

  if (alpha === 1) {
    return { r: foreground.r, g: foreground.g, b: foreground.b, a: 1 };
  }

  const bgAlpha = background.a ?? 1;

  return {
    r: Math.round(foreground.r * alpha + background.r * bgAlpha * (1 - alpha)),
    g: Math.round(foreground.g * alpha + background.g * bgAlpha * (1 - alpha)),
    b: Math.round(foreground.b * alpha + background.b * bgAlpha * (1 - alpha)),
    a: 1,
  };
}

/**
 * Calculate relative luminance of a color per WCAG definition
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getRelativeLuminance(color: RGB): number {
  const rsRGB = color.r / 255;
  const gsRGB = color.g / 255;
  const bsRGB = color.b / 255;

  const r =
    rsRGB <= 0.039_28 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g =
    gsRGB <= 0.039_28 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b =
    bsRGB <= 0.039_28 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(foreground: RGB, background: RGB): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface EffectiveBackground {
  color: RGB;
  /** Element whose background-color was used, or null for the canvas. */
  source: Element | null;
  /** True when the element or an ancestor paints a background-image. */
  hasImage: boolean;
}

// Approximation of the dark canvas browsers paint for `color-scheme: dark`
// (Chromium uses #121212, Firefox #1c1b22, WebKit #1e1e1e).
const DARK_CANVAS: RGB = { r: 18, g: 18, b: 18, a: 1 };
const LIGHT_CANVAS: RGB = { r: 255, g: 255, b: 255, a: 1 };

function getCanvasColor(document: Document): RGB {
  const root = document.documentElement;
  const view = document.defaultView;
  if (!root || !view) return LIGHT_CANVAS;
  const scheme = view.getComputedStyle(root).colorScheme?.split(/\s+/) ?? [];
  const supportsDark = scheme.includes("dark");
  const supportsLight = scheme.includes("light");
  if (!supportsDark) return LIGHT_CANVAS;
  if (!supportsLight) return DARK_CANVAS;
  return view.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_CANVAS
    : LIGHT_CANVAS;
}

function parentOrHost(element: Element): Element | null {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

/**
 * Get the effective background by walking up the DOM (and out of shadow
 * roots) until an opaque background-color is found, flattening any
 * translucent layers on the way. Falls back to the canvas colour, which
 * depends on the root element's color-scheme.
 */
export function getEffectiveBackground(element: Element): EffectiveBackground {
  const translucentLayers: RGB[] = [];
  let hasImage = false;
  let current: Element | null = element;

  while (current) {
    const computed = globalThis.getComputedStyle(current as HTMLElement);
    const bgImage = computed.backgroundImage;
    if (bgImage && bgImage !== "none") hasImage = true;

    const parsed = parseColor(computed.backgroundColor);
    const alpha = parsed?.a ?? 1;
    if (parsed && alpha > 0) {
      if (alpha >= 1) {
        return {
          color: flattenLayers(translucentLayers, parsed),
          source: current,
          hasImage,
        };
      }
      translucentLayers.push(parsed);
    }

    current = parentOrHost(current);
  }

  const canvas = getCanvasColor(element.ownerDocument);
  return {
    color: flattenLayers(translucentLayers, canvas),
    source: null,
    hasImage,
  };
}

function flattenLayers(layers: RGB[], base: RGB): RGB {
  let result = base;
  for (let i = layers.length - 1; i >= 0; i--) {
    result = flattenColor(layers[i], result);
  }
  return result;
}

/**
 * Get the effective background color by traversing up the DOM tree
 */
export function getEffectiveBackgroundColor(element: Element): RGB {
  return getEffectiveBackground(element).color;
}

/**
 * Determine if text is considered "large" per WCAG definition
 * Large text is >= 18pt (24px) or >= 14pt (18.66px) and bold (font-weight >= 700)
 */
export function isLargeText(element: Element): boolean {
  const computed = globalThis.getComputedStyle(element as HTMLElement);
  const fontSize = parseFloat(computed.fontSize);
  const fontWeight = computed.fontWeight;

  // >= 18pt (24px)
  if (fontSize >= 24) {
    return true;
  }

  // >= 14pt (18.66px) and bold
  if (
    fontSize >= 18.66 &&
    (fontWeight === "bold" || parseInt(fontWeight) >= 700)
  ) {
    return true;
  }

  return false;
}

/**
 * Format RGB color to string
 */
export function formatColor(color: RGB): string {
  if (color.a !== undefined && color.a < 1) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a.toFixed(2)})`;
  }
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
