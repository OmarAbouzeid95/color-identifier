import nearestColor from 'nearest-color';
import { type Color } from '@/types/colors';

function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

export function convertRGBToHex(r: number, g: number, b: number): string {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function capitalizeFirstLetter(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getNearsetColors(baseColors: Color[]) {
	const colors = baseColors.reduce(
		(o, { name, hex }) => Object.assign(o, { [name]: hex }),
		{},
	);
	return nearestColor.from(colors);
}
