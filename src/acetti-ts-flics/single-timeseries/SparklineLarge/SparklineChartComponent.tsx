import {ScaleLinear} from 'd3-scale';
import {useVideoConfig, useCurrentFrame, interpolate, Sequence} from 'remotion';

import {Position} from '../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../../acetti-ts-periodsScale/periodsScale';
import {BuildingAnimatedLine} from '../../../acetti-ts-components/BuildingAnimatedLine';
import {getXY} from '../../../acetti-ts-periodsScale/getXY';
import {getJustFirstAndLastAxisSpec} from '../../../acetti-ts-axis/utils/axisSpecs_xAxis';
import {XAxis_SpecBased} from '../../../acetti-ts-axis/XAxis_SpecBased';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TLineChartAnimationContext} from '../../../acetti-ts-base/LineChartAnimationContainer';
import {XAxis_SparklineLarge} from '../../../acetti-ts-axis/XAxis_SparklineLarge';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

export const SparklineChartComponent: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	yDomainType: TYDomainType;
	theme: ThemeType;
	yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
	fromPeriodScale: TPeriodsScale;
	toPeriodScale: TPeriodsScale;
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
}) => {
	// const {
	// 	// durationInFrames,
	// 	// fps,
	// } = useVideoConfig();
	// const frame = useCurrentFrame();

	// const entryDurationInFrames = fps * 2;

	// const percAnimation = interpolate(
	// 	frame,
	// 	[0, entryDurationInFrames, durationInFrames],
	// 	[0, 1, 1]
	// );

	const axisSpec = getJustFirstAndLastAxisSpec(currentPeriodsScale);

	return (
		<>
			{/* xAxis */}
			<Sequence from={90 * 0}>
				<Position
					position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
				>
					<XAxis_SparklineLarge
						periodsScale={currentPeriodsScale}
						theme={theme.xAxis}
						area={layoutAreas.xAxis}
						axisSpec={axisSpec}
						clip={false}
						fadeInDurationInFrames={Math.floor(90 * 1.5)}
					/>
				</Position>
			</Sequence>

			{/* sparkline */}
			<Sequence from={90 * 1.6}>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<BuildingAnimatedLine
						lineColor={'cyan'}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
					/>
				</Position>
			</Sequence>
		</>
	);
};
