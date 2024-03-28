import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

import {DisplayGridLayout} from '../acetti-viz';
import {useMinimapLayout} from './useMinimapLayout';
import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
// import {periodsScale} from './periodsScale';
// import {AnimatedXAxis} from './components/AnimatedXAxis';
// import {AnimatedYAxis} from './components/AnimatedYAxis';
// import {AnimatedLine} from './components/AnimatedLine';
// import {AnimatedValueDot} from './components/AnimatedValueDot';

// TODO: pass in EASING function, s.t. it is shared between minimap and line animation
export const MinimapContainer: React.FC<{
	lineColor: string;
	textColor: string;
	timeSeries: TimeSeries;
	area: TGridLayoutArea;
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
}> = ({
	lineColor,
	textColor,
	area,
	timeSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
}) => {
	const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();

	const minimapLayout = useMinimapLayout({
		width: area.width,
		height: area.height,
	});

	// const plotArea = minimapLayout.areas.plot;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<DisplayGridLayout
					stroke={textColor}
					fill="transparent"
					hide={false}
					areas={minimapLayout.areas}
					width={area.width}
					height={area.height}
				/>
			</div>
		</AbsoluteFill>
	);
};
