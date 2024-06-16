export type TFontSpecStandard = {
	font: string;
	variant: string;
	weight?: number;
	name: string;
};

// export type TFontSpecVariable = {
// 	font: string;
// 	variant: string;
// 	name: string;
// 	fileName: string;
// };

// export type TFontSpec = TFontSpecStandard | TFontSpecVariable;
export type TFontSpec = TFontSpecStandard;

type AvailableFontSpecs = {
	'Inter-Bold': TFontSpecStandard;
	'Inter-Medium': TFontSpecStandard;
	'Inter-Regular': TFontSpecStandard;
	'SourceSerifPro-Light': TFontSpecStandard;
	'SourceSerifPro-Regular': TFontSpecStandard;
	'SourceSerifPro-SemiBold': TFontSpecStandard;
	'SourceSerifPro-Bold': TFontSpecStandard;
};

const fontFamiliesArray = [
	'Inter-Bold',
	'Inter-Regular',
	'Inter-Medium',
	'SourceSerifPro-Light',
	'SourceSerifPro-Regular',
	'SourceSerifPro-SemiBold',
	'SourceSerifPro-Bold',
];

export const fontFamilies: readonly [string, ...string[]] = [
	fontFamiliesArray[0],
	...fontFamiliesArray.slice(1),
];

export type FontFamiliesUnionType = (typeof fontFamilies)[number];

const availableFontSpecs: AvailableFontSpecs = {
	'Inter-Bold': {
		font: 'Inter',
		variant: 'Bold',
		weight: 700,
		name: 'Inter-Bold',
	},
	'Inter-Medium': {
		font: 'Inter',
		variant: 'Medium',
		weight: 500,
		name: 'Inter-Medium',
	},
	'Inter-Regular': {
		font: 'Inter',
		variant: 'Regular',
		weight: 400,
		name: 'Inter-Regular',
	},
	'SourceSerifPro-Light': {
		font: 'SourceSerifPro',
		variant: 'Light',
		weight: 300,
		name: 'SourceSerifPro-Light',
	},
	'SourceSerifPro-Regular': {
		font: 'SourceSerifPro',
		variant: 'Regular',
		weight: 400,
		name: 'SourceSerifPro-Regular',
	},
	'SourceSerifPro-SemiBold': {
		font: 'SourceSerifPro',
		variant: 'SemiBold',
		weight: 600,
		name: 'SourceSerifPro-SemiBold',
	},
	'SourceSerifPro-Bold': {
		font: 'SourceSerifPro',
		variant: 'Bold',
		weight: 700,
		name: 'SourceSerifPro-Bold',
	},
};

export default availableFontSpecs;
