import invariant from 'tiny-invariant';
import {z} from 'zod';

const ALL_AVAILABLE_FONT_FAMILIES = [
	'Inter',
	'Inter-Regular',
	'Inter-Bold',
	'Inter-28pt-Thin',
	'Inter-28pt-Black',
] as const;

export const zAvailableFontFamiliesEnum = z.enum(ALL_AVAILABLE_FONT_FAMILIES);

export type TAvailableFontFamily = z.infer<typeof zAvailableFontFamiliesEnum>;

export type TFontMetrics = {
	familyName: string;
	fullName: string;
	postscriptName: string;
	capHeight: number;
	ascent: number;
	descent: number;
	lineGap: number;
	unitsPerEm: number;
	xHeight: number;
	xWidthAvg: number;
	subsets: {
		latin: {
			xWidthAvg: number;
		};
		thai: {
			xWidthAvg: number;
		};
	};
};

export type TFontMetricsMap = Record<TAvailableFontFamily, TFontMetrics>;

const INTER_CAPSIZE_MEASURES = {
	familyName: 'Inter',
	fullName: 'Inter Regular',
	postscriptName: 'Inter-Regular',
	capHeight: 1490,
	ascent: 1984,
	descent: -494,
	lineGap: 0,
	unitsPerEm: 2048,
	xHeight: 1118,
	xWidthAvg: 978,
	subsets: {
		latin: {
			xWidthAvg: 978,
		},
		thai: {
			xWidthAvg: 1344,
		},
	},
};

const Inter_28pt_Black = {
	familyName: 'Inter 28pt Black',
	fullName: 'Inter 28pt Black',
	postscriptName: 'Inter28pt-Black',
	capHeight: 1490,
	ascent: 1984,
	descent: -494,
	lineGap: 0,
	unitsPerEm: 2048,
	xHeight: 1070,
	xWidthAvg: 1004,
	subsets: {
		latin: {
			xWidthAvg: 1004,
		},
		thai: {
			xWidthAvg: 1344,
		},
	},
};

const Inter_28pt_Thin = {
	familyName: 'Inter 28pt Thin',
	fullName: 'Inter 28pt Thin',
	postscriptName: 'Inter28pt-Thin',
	capHeight: 1490,
	ascent: 1984,
	descent: -494,
	lineGap: 0,
	unitsPerEm: 2048,
	xHeight: 1070,
	xWidthAvg: 839,
	subsets: {
		latin: {
			xWidthAvg: 839,
		},
		thai: {
			xWidthAvg: 1344,
		},
	},
};

export const getFontMetrics = (
	fontFamily: TAvailableFontFamily
): TFontMetrics => {
	const fontMetricsMapping: TFontMetricsMap = {
		Inter: INTER_CAPSIZE_MEASURES,
		'Inter-Regular': INTER_CAPSIZE_MEASURES,
		'Inter-Bold': INTER_CAPSIZE_MEASURES,
		'Inter-28pt-Thin': Inter_28pt_Thin,
		'Inter-28pt-Black': Inter_28pt_Black,
	};

	const fontMetrics = fontMetricsMapping[fontFamily];
	invariant(fontMetrics);

	return fontMetrics;
};
