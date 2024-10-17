// import invariant from 'tiny-invariant';

import {
	TFontMetrics,
	getFontMetrics,
	TAvailableFontFamily,
} from './fontMetricsLibrary';

export type TFontSpec = {
	fontFamily: TAvailableFontFamily;
	filePath: string;
	fontMetrics: TFontMetrics;
};

export const fontSpecsLibrary: Record<TAvailableFontFamily, TFontSpec> = {
	Inter: {
		fontFamily: 'Inter',
		filePath: `/fonts/Inter/Inter-Regular.ttf`,
		fontMetrics: getFontMetrics('Inter'),
	},
	'Inter-Regular': {
		fontFamily: 'Inter-Regular',
		filePath: `/fonts/Inter/Inter-Regular.ttf`,
		fontMetrics: getFontMetrics('Inter-Regular'),
	},
	'Inter-Bold': {
		fontFamily: 'Inter-Bold',
		filePath: `/fonts/Inter/Inter-Bold.ttf`,
		fontMetrics: getFontMetrics('Inter-Bold'),
	},
};
