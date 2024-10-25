import {useCurrentFrame, useVideoConfig} from 'remotion';

import {ThemeType} from '../../acetti-themes/themeTypes';
// TODO into e.g. acetti-keyframes
import {KeyFramesInspector} from '../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {getSimpleBarChartKeyframes} from './getKeyframes';
import {TSimpleBarChartData} from './SimpleBarChart';

type TSparklineLargeKeyframesProps = {
	width: number;
	theme: ThemeType;
	baseFontSize: number;
	data: TSimpleBarChartData;
};

export const SimpleBarChartKeyframes: React.FC<
	TSparklineLargeKeyframesProps
> = ({
	width,
	baseFontSize, // TODO rename to baseline
	data,
	theme, // TODO utilize Theme
	// TODO pass text props // Inter-Bold e.g.
}) => {
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const keyframes = getSimpleBarChartKeyframes({fps, durationInFrames, data});

	return (
		<KeyFramesInspector
			keyFramesGroup={keyframes}
			width={width}
			baseFontSize={baseFontSize}
			frame={frame}
		/>
	);
};
