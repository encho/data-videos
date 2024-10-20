import {TAvailableFontFamily} from '../acetti-typography/fontMetricsLibrary';
import {ThemeType} from './themeTypes';

export function getUniqueThemeFontFamilies(theme: ThemeType) {
	const fontFamilies = Object.values(theme.typography.textStyles).map(
		(item) => item.fontFamily
	);

	const uniqueFontFamiliesSet = new Set(fontFamilies);

	const uniqueFontFamilies = Array.from(
		uniqueFontFamiliesSet
	) as TAvailableFontFamily[];

	return uniqueFontFamilies;
}
// TODO add unit tests
