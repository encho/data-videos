import {TGridLayoutArea} from './types2';

export function averageAreas(
	area1: TGridLayoutArea,
	area2: TGridLayoutArea,
	area1Perc: number
): TGridLayoutArea {
	const area2Perc = 1 - area1Perc;

	const x1 = area1.x1 * area1Perc + area2.x1 * area2Perc;
	const x2 = area1.x2 * area1Perc + area2.x2 * area2Perc;
	const y1 = area1.y1 * area1Perc + area2.y1 * area2Perc;
	const y2 = area1.y2 * area1Perc + area2.y2 * area2Perc;
	const width = area1.width * area1Perc + area2.width * area2Perc;
	const height = area1.height * area1Perc + area2.height * area2Perc;

	return {
		x1,
		x2,
		y1,
		y2,
		width,
		height,
	};
}
