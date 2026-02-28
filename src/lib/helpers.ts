import { type Color } from '@/types/colors';

function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

export function convertRGBToHex(r: number, g: number, b: number): string {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function convertRGBToHSL(r: number, g: number, b: number): string {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	const hDeg = Math.round(h * 360);
	const sPerc = Math.round(s * 100);
	const lPerc = Math.round(l * 100);
	return `hsl(${hDeg}, ${sPerc}%, ${lPerc}%)`;
}

export function convertRGBToHSV(r: number, g: number, b: number): string {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;
	let h = 0;
	const s = max === 0 ? 0 : d / max;
	const v = max;

	if (max !== min) {
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	const hDeg = Math.round(h * 360);
	const sPerc = Math.round(s * 100);
	const vPerc = Math.round(v * 100);
	return `hsv(${hDeg}, ${sPerc}%, ${vPerc}%)`;
}

export function convertRGBToCMYK(r: number, g: number, b: number): string {
	r /= 255;
	g /= 255;
	b /= 255;

	const k = 1 - Math.max(r, g, b);
	if (k === 1) {
		return 'cmyk(0%, 0%, 0%, 100%)';
	}

	const c = Math.round(((1 - r - k) / (1 - k)) * 100);
	const m = Math.round(((1 - g - k) / (1 - k)) * 100);
	const y = Math.round(((1 - b - k) / (1 - k)) * 100);
	const kPerc = Math.round(k * 100);
	return `cmyk(${c}%, ${m}%, ${y}%, ${kPerc}%)`;
}

export function convertRGBToOKLCH(r: number, g: number, b: number): string {
	// sRGB to linear RGB
	const toLinear = (v: number) => {
		v /= 255;
		return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	};
	const lr = toLinear(r);
	const lg = toLinear(g);
	const lb = toLinear(b);

	// Linear RGB to OKLab via LMS
	const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l_c = Math.cbrt(l_);
	const m_c = Math.cbrt(m_);
	const s_c = Math.cbrt(s_);

	const L = 0.2104542553 * l_c + 0.793617785 * m_c - 0.0040720468 * s_c;
	const a = 1.9779984951 * l_c - 2.428592205 * m_c + 0.4505937099 * s_c;
	const bOk = 0.0259040371 * l_c + 0.7827717662 * m_c - 0.808675766 * s_c;

	const C = Math.sqrt(a * a + bOk * bOk);
	let H = (Math.atan2(bOk, a) * 180) / Math.PI;
	if (H < 0) H += 360;

	const lRound = parseFloat((L * 100).toFixed(2));
	const cRound = parseFloat(C.toFixed(4));
	const hRound = parseFloat(H.toFixed(2));
	return `oklch(${lRound}% ${cRound} ${hRound})`;
}

export function capitalizeFirstLetter(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getNearsetColors(baseColors: Color[]) {
	return baseColors.reduce(
		(o, { name, hex }) => Object.assign(o, { [name]: hex }),
		{},
	);
}
