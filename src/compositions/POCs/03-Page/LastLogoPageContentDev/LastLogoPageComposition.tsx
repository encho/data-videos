import {z} from 'zod';
import React from 'react';
import {useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';
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
	const {width, height} = useVideoConfig();

	return (
		<PageContext
			margin={50}
			nrBaselines={40}
			width={width}
			height={height}
			theme={theme}
		>
			<LastLogoPage theme={theme} />
		</PageContext>
	);
};
