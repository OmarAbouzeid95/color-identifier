import { type NamedColor } from '@/types/colors';

function componentToHex(c: number) {
	const hex = c.toString(16);
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

export function convertRGBToOklab(
	r: number,
	g: number,
	b: number,
): [number, number, number] {
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

	return [
		0.2104542553 * l_c + 0.793617785 * m_c - 0.0040720468 * s_c,
		1.9779984951 * l_c - 2.428592205 * m_c + 0.4505937099 * s_c,
		0.0259040371 * l_c + 0.7827717662 * m_c - 0.808675766 * s_c,
	];
}

export function convertRGBToOKLCH(r: number, g: number, b: number): string {
	const [L, a, bOk] = convertRGBToOklab(r, g, b);

	const C = Math.sqrt(a * a + bOk * bOk);
	let H = (Math.atan2(bOk, a) * 180) / Math.PI;
	if (H < 0) H += 360;

	const lRound = parseFloat((L * 100).toFixed(2));
	const cRound = parseFloat(C.toFixed(4));
	const hRound = parseFloat(H.toFixed(2));
	return `oklch(${lRound}% ${cRound} ${hRound})`;
}

export function convertHexToRGB(hex: string): [number, number, number] {
	let h = hex.replace('#', '');
	if (h.length === 3) {
		h = h
			.split('')
			.map((c) => c + c)
			.join('');
	}
	const n = parseInt(h, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function capitalizeFirstLetter(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export type ColorMatch = NamedColor & { distance: number };

// Converts the list to OKLab once; each lookup is then a linear scan using
// Euclidean distance, which in OKLab tracks perceived color difference.
export function createColorMatcher(colors: NamedColor[]) {
	const lab = new Float32Array(colors.length * 3);
	colors.forEach(({ hex }, i) => {
		lab.set(convertRGBToOklab(...convertHexToRGB(hex)), i * 3);
	});

	return (r: number, g: number, b: number): ColorMatch | null => {
		if (colors.length === 0) return null;

		const [L, A, B] = convertRGBToOklab(r, g, b);
		let best = 0;
		let bestDist = Infinity;
		for (let i = 0; i < colors.length; i++) {
			const dL = lab[i * 3] - L;
			const dA = lab[i * 3 + 1] - A;
			const dB = lab[i * 3 + 2] - B;
			const dist = dL * dL + dA * dA + dB * dB;
			if (dist < bestDist) {
				bestDist = dist;
				best = i;
			}
		}

		const { name, hex } = colors[best];
		return { name, hex, distance: Math.sqrt(bestDist) };
	};
}
