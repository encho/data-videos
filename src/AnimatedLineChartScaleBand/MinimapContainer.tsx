import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

import {DisplayGridLayout} from '../acetti-viz';
import {useMinimapLayout} from './useMinimapLayout';
import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {Position} from './components/Position';
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
	// lineColor,
	textColor,
	area,
	// timeSeries,
	// fromVisibleDomainIndices,
	// toVisibleDomainIndices,
}) => {
	const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();

	const minimapLayout = useMinimapLayout({
		width: area.width,
		height: area.height,
	});

	return (
		<AbsoluteFill>
			<Position position={{left: area.x1, top: area.y1}}>
				<DisplayGridLayout
					stroke={textColor}
					fill="transparent"
					hide={false}
					areas={minimapLayout.areas}
					width={area.width}
					height={area.height}
				/>
			</Position>
		</AbsoluteFill>
	);
};
