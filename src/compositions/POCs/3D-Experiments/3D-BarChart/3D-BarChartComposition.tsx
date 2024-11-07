import {z} from 'zod';
import React from 'react';
// import {staticFile} from 'remotion';
// import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
// import {Position} from '../../../../acetti-ts-base/Position';
// import {ObliquePlatte} from '../../../../acetti-components/ObliquePlatte';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
// import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import TallBox from './TallBox';
// import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
// import {buildKeyFramesGroup, getKeyFramesInterpolator} from './keyframes';

export const threeD_BarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ThreeD_BarChartComposition: React.FC<
	z.infer<typeof threeD_BarChartCompositionSchema>
> = ({themeEnum}) => {
	// const {durationInFrames, fps} = useVideoConfig();
	// const frame = useCurrentFrame();
	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(theme);

	// const fontFilePath = staticFile('/fonts/Inter/Inter-Bold.ttf');

	// const width = 600;
	// const height = 600;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			{/* <TallBox fontFilePath={fontFilePath} /> */}
			<TallBox
				width={1000}
				height={1000}
				// fontFilePath={fontFilePath}
			/>
			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
