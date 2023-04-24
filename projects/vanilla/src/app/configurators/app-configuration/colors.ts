/**
 * It takes an array of 4 numbers (red, green, blue, alpha) and returns a string in
 * the format of #RRGGBBAA
 * @param  - red - The red value of the color (0-255)
 * @returns A string.
 */
function RGBAToHexA([red, green, blue, alpha = 1]): string {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);
  let a = Math.round(alpha * 255).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  if (a.length == 1) a = '0' + a;

  return '#' + r + g + b + a;
}

/**
 * It takes a hex string, converts it to an RGB array, then converts that array to
 * an HSL array
 * @param {string} h - hex color string
 * @returns An array of strings with [ r, g, b ] values.
 */
function hexToHSL(h: string): [number, number, number] {
  const [r, g, b] = hexToRGBA(h);
  return RGBToHSL(r, g, b);
}

/**
 * It takes a hex string, and returns an array of 4 numbers, representing the RGBA
 * values of the hex string
 * @param {string} h - string - The hex color string.
 * @returns An array of 4 numbers with [ r, g, b, alpha ] values..
 */
function hexToRGBA(h: string): [number, number, number, number] {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (h.length === 4) {
    h += 'f';
  }
  if (h.length === 7) {
    h += 'ff';
  }

  if (h.length === 5) {
    r = parseInt('0x' + h[1] + h[1]);
    g = parseInt('0x' + h[2] + h[2]);
    b = parseInt('0x' + h[3] + h[3]);
    a = parseInt('0x' + h[4] + h[4]);
  } else {
    r = parseInt('0x' + h[1] + h[2]);
    g = parseInt('0x' + h[3] + h[4]);
    b = parseInt('0x' + h[5] + h[6]);
    a = parseInt('0x' + h[7] + h[8]);
  }

  a = Number((a / 255).toFixed(3));
  return [r, g, b, a];
}

/**
 * Convert RGB values to HSL values, and return the HSL values as an array of
 * strings.
 * @param {number} r - red value
 * @param {number} g - number - green channel value
 * @param {number} b - number - blue channel value
 * @returns An array of strings with [ r, g, b ] values.
 */
function RGBToHSL(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  // find channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // hue
  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // lightness
  l = (cmax + cmin) / 2;

  // saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(0);
  l = +(l * 100).toFixed(0);

  return [h, s, l];
}

function HSLToHex([h, s, l]): string {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  let red = Math.round((r + m) * 255).toString(16);
  let green = Math.round((g + m) * 255).toString(16);
  let blue = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (red.length == 1)
    red = "0" + red;
  if (green.length == 1)
    green = "0" + g;
  if (blue.length == 1)
    blue = "0" + b;

  return "#" + r + g + b;
}

/**
 * "Given a color and a weight, return a tinted version of that color."
 *
 * The first line of the function is a type annotation. It tells TypeScript that
 * the function will return an array of four numbers
 * @param {string} color - The color you want to tint.
 * @param {number} weight - The weight of the tint. 0 is no tint, 1 is full tint.
 * @returns An array of 4 numbers with [ r, g, b, alpha ] values.
 */
function tintColor(
  color: string,
  weight: number
): [number, number, number, number] {
  return mix('#fff', color, weight);
}

/**
 * It takes a color and a weight, and returns a new color that is a mix of the
 * original color and black
 * @param {string} color - The color to be shaded.
 * @param {number} weight - 0.0 - 1.0
 * @returns An array of 4 numbers with [ r, g, b, alpha ] values.
 */
function shadeColor(
  color: string,
  weight: number
): [number, number, number, number] {
  return mix('#000', color, weight);
}

/**
 * It takes two colors and a weight and returns a new color.
 * @param {string} color1 - The first color to mix.
 * @param {string} color2 - The color you want to mix with color1
 * @param {number} weight - The weight of the first color.
 * @returns An array of 4 numbers with [ r, g, b, alpha ] values.
 */
function mix(
  color1: string,
  color2: string,
  weight: number
): [number, number, number, number] {
  const c1 = hexToRGBA(color1);
  const c2 = hexToRGBA(color2);

  const p = weight / 100;
  const w = 2 * p - 1;
  const a = c1[3] - c2[3];

  const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
  const w2 = 1 - w1;

  const r = Math.ceil(w1 * c1[0] + w2 * c2[0]);
  const g = Math.ceil(w1 * c1[1] + w2 * c2[1]);
  const b = Math.ceil(w1 * c1[2] + w2 * c2[2]);
  const alpha = c1[3] * p + c2[3] * (1 - p);
  return [r, g, b, alpha];
}

function darken(color: string, amount: number) {
  let [h, s, l] = hexToHSL(color);
  l += (l * amount / 100);
  return HSLToHex([h, s, l]);
}

function lighten(color: string, amount: number) {
  let [h, s, l] = hexToHSL(color);
  l -= (l * amount / 100);
  return HSLToHex([h, s, l]);
}

export { RGBAToHexA, RGBToHSL, hexToHSL, hexToRGBA };
export { tintColor, shadeColor, mix, darken, lighten };
