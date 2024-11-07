import {useCurrentFrame, useVideoConfig} from 'remotion';

import {KeyFramesInspector} from '../../../compositions/POCs/Keyframes/Keyframes/KeyframesInspector';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {getLargeSparklineKeyFrames} from './getKeyframes';

type TSparklineLargeKeyframesProps = {
	width: number;
	theme: ThemeType;
	baseFontSize: number;
};

export const SparklineLargeKeyframes: React.FC<
	TSparklineLargeKeyframesProps
> = ({width, baseFontSize, theme}) => {
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const keyframes = getLargeSparklineKeyFrames({fps, durationInFrames});

	return (
		<KeyFramesInspector
			keyFramesGroup={keyframes}
			width={width}
			baseFontSize={baseFontSize}
			frame={frame}
			theme={theme}
		/>
	);
};
