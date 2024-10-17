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

const fontSpecsLibrary: Record<TAvailableFontFamily, TFontSpec> = {
	// TODO deprecate Inter simple, as we are not really loading it
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
	'Inter-28pt-Thin': {
		fontFamily: 'Inter-28pt-Thin',
		filePath: `/fonts/Inter/Inter_28pt-Thin.ttf`,
		fontMetrics: getFontMetrics('Inter-28pt-Thin'),
	},
	'Inter-28pt-Black': {
		fontFamily: 'Inter-28pt-Black',
		filePath: `/fonts/Inter/Inter_28pt-Black.ttf`,
		fontMetrics: getFontMetrics('Inter-28pt-Black'),
	},
};

export function getFontSpec(fontFamily: TAvailableFontFamily): TFontSpec {
	const fontSpec = fontSpecsLibrary[fontFamily];

	if (fontSpec) {
		return fontSpec;
	}

	throw Error(
		`fontFamily ${fontFamily} has not yet an entry in fontSpecsLibrary object. please add one!`
	);
}
