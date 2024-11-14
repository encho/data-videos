import {z} from 'zod';
import React from 'react';

import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import TallBox from './TallBox';

export const threeD_BarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ThreeD_BarChartComposition: React.FC<
	z.infer<typeof threeD_BarChartCompositionSchema>
> = ({themeEnum}) => {
	// const {durationInFrames, fps} = useVideoConfig();
	// const frame = useCurrentFrame();
	const theme = useThemeFromEnum(themeEnum);

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
