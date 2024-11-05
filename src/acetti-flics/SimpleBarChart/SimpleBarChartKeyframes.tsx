import {useCurrentFrame, useVideoConfig} from 'remotion';

import {ThemeType} from '../../acetti-themes/themeTypes';
// TODO into e.g. acetti-keyframes
import {KeyFramesInspector} from '../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {useBarChartKeyframes} from './useBarChartKeyframes';
import {TSimpleBarChartData} from './SimpleBarChart';

type TSparklineLargeKeyframesProps = {
	width: number;
	theme: ThemeType;
	baseline: number;
	data: TSimpleBarChartData;
};

export const SimpleBarChartKeyframes: React.FC<
	TSparklineLargeKeyframesProps
> = ({width, baseline, data, theme}) => {
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const barChartKeyframes = useBarChartKeyframes({fps, durationInFrames, data});

	return (
		<KeyFramesInspector
			keyFramesGroup={barChartKeyframes}
			width={width}
			baseFontSize={baseline}
			frame={frame}
			theme={theme}
		/>
	);
};
