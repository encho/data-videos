import {
	AbsoluteFill,
	interpolate,
	Easing,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {MinimapLine} from './components/MinimapLine';
import {DisplayGridLayout} from '../acetti-layout';
import {useMinimapLayout} from './useMinimapLayout';
import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from './utils/timeSeries/generateBrownianMotionTimeSeries';
import {Position} from './components/Position';
import {periodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {MinimapActiveArea} from './components/MinimapActiveArea';
// import {times} from 'lodash';
// import {periodsScale} from './periodsScale';
// import {AnimatedXAxis} from './components/AnimatedXAxis';
// import {AnimatedYAxis} from './components/AnimatedYAxis';
// import {AnimatedLine} from './components/AnimatedLine';
// import {AnimatedValueDot} from './components/AnimatedValueDot';

export type TTheme_Minimap = {
	lineColor: string;
	areaColor: string;
	areaOpacity: number;
};

const minimapDefaultTheme = {
	lineColor: 'yellow',
	areaColor: 'orange',
	areaOpacity: 0.2,
};

// TODO: pass in EASING function, s.t. it is shared between minimap and line animation
export const MinimapContainer: React.FC<{
	timeSeries: TimeSeries;
	area: TGridLayoutArea;
	fromVisibleDomainIndices: [number, number];
	toVisibleDomainIndices: [number, number];
	theme?: TTheme_Minimap;
}> = ({
	area,
	timeSeries,
	fromVisibleDomainIndices,
	toVisibleDomainIndices,
	theme = minimapDefaultTheme,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = (frame + 1) / durationInFrames;

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const dates = timeSeries.map((it) => it.date);

	// TODO used also in line chart, pull out of here!
	const animatedVisibleDomainIndexStart = interpolate(
		animationPercentage,
		[0, 1],
		[fromVisibleDomainIndices[0], toVisibleDomainIndices[0]],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// TODO used also in line chart, pull out of here!
	const animatedVisibleDomainIndexEnd = interpolate(
		animationPercentage,
		[0, 1],
		[fromVisibleDomainIndices[1], toVisibleDomainIndices[1]],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const activeDomainIndices = [
		animatedVisibleDomainIndexStart,
		animatedVisibleDomainIndexEnd,
	] as [number, number];

	const minimapLayout = useMinimapLayout({
		width: area.width,
		height: area.height,
	});

	const plotArea = minimapLayout.areas.plot;

	// const dates = timeSeries.map((it) => it.date);

	const fullPeriodsScale = periodsScale({
		dates,
		visibleDomainIndices: [0, timeSeries.length - 1],
		visibleRange: [0, plotArea.width],
	});

	const yDomainMin = min(timeSeries.map((it) => it.value));
	const yDomainMax = max(timeSeries.map((it) => it.value));

	const yDomain = [yDomainMin, yDomainMax] as [number, number];

	const yScale: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomain)
		.range([plotArea.height, 0]);

	return (
		<AbsoluteFill>
			<Position position={{left: area.x1, top: area.y1}}>
				<DisplayGridLayout
					stroke={'cyan'}
					fill="transparent"
					hide={true}
					areas={minimapLayout.areas}
					width={area.width}
					height={area.height}
				/>

				<Position position={{left: plotArea.x1, top: plotArea.y1}}>
					<MinimapLine
						periodsScale={fullPeriodsScale}
						yScale={yScale}
						timeSeries={timeSeries}
						lineColor={theme.lineColor}
						area={plotArea}
					/>
				</Position>
				<Position position={{left: plotArea.x1, top: plotArea.y1}}>
					<MinimapActiveArea
						activeDomainIndices={activeDomainIndices}
						periodsScale={fullPeriodsScale}
						yScale={yScale}
						areaColor={theme.areaColor}
						areaOpacity={theme.areaOpacity}
						area={plotArea}
					/>
				</Position>
			</Position>
		</AbsoluteFill>
	);
};
