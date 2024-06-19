import {useFontFamiliesLoader} from '../acetti-typography/useFontFamiliesLoader';
import {ThemeType} from './themeTypes';

export const useThemeFontsLoader = (theme: ThemeType) => {
	return useFontFamiliesLoader([
		theme.typography.title.fontFamily,
		theme.typography.subTitle.fontFamily,
	]);
};
