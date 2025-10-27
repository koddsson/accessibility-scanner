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
 * Parse a CSS color string to RGB values
 * Supports: hex, rgb(), rgba(), hsl(), hsla(), and named colors
 */
export function parseColor(color: string): RGB | null {
  if (!color || color === "transparent") {
    return { r: 255, g: 255, b: 255, a: 0 };
  }

  // Handle hex colors
  const hexMatch = color.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
      a: 1,
    };
  }

  // Handle short hex colors
  const shortHexMatch = color.match(/^#?([\da-f])([\da-f])([\da-f])$/i);
  if (shortHexMatch) {
    return {
      r: parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
      g: parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
      b: parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
      a: 1,
    };
  }

  // Handle rgb() and rgba()
  const rgbMatch = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Handle hsl() and hsla()
  const hslMatch = color.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)/,
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
    return { ...hslToRgb(h, s, l), a };
  }

  // Fallback: create a temporary element to get computed color
  if (typeof document !== "undefined") {
    const temp = document.createElement("div");
    temp.style.color = color;
    document.body.append(temp);
    const computed = globalThis.getComputedStyle(temp).color;
    temp.remove();

    if (computed && computed !== color) {
      return parseColor(computed);
    }
  }

  return null;
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): RGB {
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

/**
 * Get the effective background color by traversing up the DOM tree
 */
export function getEffectiveBackgroundColor(element: Element): RGB {
  let current: Element | null = element;

  while (current) {
    const computed = globalThis.getComputedStyle(current as HTMLElement);
    const bgColor = computed.backgroundColor;

    if (
      bgColor &&
      bgColor !== "rgba(0, 0, 0, 0)" &&
      bgColor !== "transparent"
    ) {
      const parsed = parseColor(bgColor);
      if (parsed && (parsed.a === undefined || parsed.a > 0)) {
        // If alpha is not fully opaque, we need to flatten against parent
        if (parsed.a && parsed.a < 1 && current.parentElement) {
          const parentBg = getEffectiveBackgroundColor(current.parentElement);
          return flattenColor(parsed, parentBg);
        }
        return parsed;
      }
    }

    current = current.parentElement;
  }

  // Default to white if no background is found
  return { r: 255, g: 255, b: 255, a: 1 };
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
