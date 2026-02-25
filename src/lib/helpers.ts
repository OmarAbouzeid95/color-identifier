function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

export function convertRGBToHex(r: number, g: number, b: number): string {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
