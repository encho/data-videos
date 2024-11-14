import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {theme as lorenzobertoliniTheme} from './lorenzobertolini';
import {theme as nerdyTheme} from './nerdy';
import {theme as lorenzobertolinibrightTheme} from './lorenzobertolinibright';
import {useFontFamiliesLoader} from '../acetti-typography/useFontFamiliesLoader';

export const zThemeEnum = z.enum([
	'NERDY',
	'LORENZOBERTOLINI',
	'LORENZOBERTOLINI_BRIGHT',
]);

export type ThemeEnum = z.infer<typeof zThemeEnum>;

export const getThemeFromEnum = (themeEnum: ThemeEnum) => {
	const theme =
		themeEnum === ('NERDY' as any as ThemeEnum)
			? nerdyTheme
			: themeEnum === ('LORENZOBERTOLINI' as any as ThemeEnum)
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	return theme();
};

export const useThemeFromEnum = (themeEnum: ThemeEnum) => {
	const createTheme =
		themeEnum === ('NERDY' as any as ThemeEnum)
			? nerdyTheme
			: themeEnum === ('LORENZOBERTOLINI' as any as ThemeEnum)
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	// return theme;
	const theme = createTheme();

	// load fonts
	// TODO: eventually wait for docoment.fonts.ready// and/or introduce Timeout instead of in useElementDimensions
	// ********************************************************
	useFontFamiliesLoader(theme);

	return theme;
};
