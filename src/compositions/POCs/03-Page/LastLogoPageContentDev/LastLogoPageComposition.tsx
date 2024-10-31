import {z} from 'zod';
import React from 'react';

import {LastLogoPage} from './LastLogoPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const lastLogoPageCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const LastLogoPageComposition: React.FC<
	z.infer<typeof lastLogoPageCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);

	return <LastLogoPage theme={theme} />;
};
