// Function to get the domain (min, max) for a given measure
export function getDomain<T>(
	data: Array<T>,
	measure: keyof T
): [number, number] {
	const numericValues = data
		.map((item) => item[measure])
		.filter((value) => typeof value === 'number') as number[];

	const minValue = Math.min(...numericValues);
	const maxValue = Math.max(...numericValues);

	return [minValue, maxValue];
}
