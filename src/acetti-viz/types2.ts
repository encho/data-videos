// @flow

type TGridRailElementPixelSpec = {
	type: 'pixel';
	value: number;
	name: string;
};

type TGridRailElementFrSpec = {
	type: 'fr';
	value: number;
	name: string;
};

export type TGridRailElementSpec =
	| TGridRailElementPixelSpec
	| TGridRailElementFrSpec;

export type TGridRailSpec = Array<TGridRailElementSpec>;

type TElementMatcherName = {name: string};
type TElementMatcherPosition = {position: number};

type TRailElementMatcher = TElementMatcherName | TElementMatcherPosition;

export type TGridLayoutAreaSpec = [
	TRailElementMatcher, // first row (start)
	TRailElementMatcher, // first column (start)
	TRailElementMatcher, // last row (end)
	TRailElementMatcher // last column (end)
];

// export type TGridAreasSpec = {
//   [k: string]: TGridLayoutAreaSpec;
// };

export interface TGridAreasSpec {
	[k: string]: TGridLayoutAreaSpec;
}

export type TGridSize = {
	width: number;
	height: number;
};

export type TGridLayoutSpec = {
	rows: TGridRailSpec;
	columns: TGridRailSpec;
	areas: TGridAreasSpec;
	columnGap: number;
	rowGap: number;
	padding: number;
};

export type TGridRailElement = TGridRailElementSpec & {
	start: number;
	end: number;
	position: number;
};

export type TGridRail = Array<TGridRailElement>;

export type TGridLayoutArea = {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	width: number;
	height: number;
};

export type TGridLayout = {
	width: number;
	height: number;
	rows: TGridRail;
	columns: TGridRail;
	areas: {[key: string]: TGridLayoutArea};
};
