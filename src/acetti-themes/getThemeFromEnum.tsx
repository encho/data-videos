import {z} from 'zod';

import {lorenzobertoliniTheme} from './lorenzobertolini';
import {nerdyTheme} from './nerdy';
import {lorenzobertolinibrightTheme} from './lorenzobertolinibright';

export const zThemeEnum = z.enum([
	'NERDY',
	'LORENZOBERTOLINI',
	'LORENZOBERTOLINI_BRIGHT',
]);

export type ThemeEnum = typeof zThemeEnum;

export const getThemeFromEnum = (themeEnum: ThemeEnum) => {
	const theme =
		themeEnum === ('NERDY' as any as ThemeEnum)
			? nerdyTheme
			: themeEnum === ('LORENZOBERTOLINI' as any as ThemeEnum)
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	return theme;
};
