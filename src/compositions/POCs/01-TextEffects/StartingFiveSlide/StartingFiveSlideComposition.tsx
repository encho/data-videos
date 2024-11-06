import {z} from 'zod';
import React from 'react';

import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {zSquareVideoSrcEnum} from './StartingFiveSlide';
import {StartingFiveSlide} from './StartingFiveSlide';

export const startingFiveSlideCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	fontSizeInBaselines: z.number(),
	lineHeightInBaselines: z.number(),
	numberOfWordRows: z.number(),
	word: z.string(),
	video: zSquareVideoSrcEnum,
});

export const StartingFiveSlideComposition: React.FC<
	z.infer<typeof startingFiveSlideCompositionSchema>
> = ({
	themeEnum,
	fontSizeInBaselines,
	lineHeightInBaselines,
	numberOfWordRows,
	word,
	video,
}) => {
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<StartingFiveSlide
			theme={theme}
			fontSizeInBaselines={fontSizeInBaselines}
			lineHeightInBaselines={lineHeightInBaselines}
			numberOfWordRows={numberOfWordRows}
			word={word}
			video={video}
		/>
	);
};
