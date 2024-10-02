import {ScaleLinear} from 'd3-scale';
import {useVideoConfig, useCurrentFrame, interpolate} from 'remotion';

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
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const entryDurationInFrames = fps * 2;

	const percAnimation = interpolate(
		frame,
		[0, entryDurationInFrames, durationInFrames],
		[0, 1, 1]
	);

	const axisSpec = getJustFirstAndLastAxisSpec(currentPeriodsScale);

	const visibleDomainIndices = currentPeriodsScale.getVisibleDomainIndices();
	const currentRightVisibleDomainIndex =
		percAnimation * visibleDomainIndices[1];

	const {x, y} = getXY({
		periodsScale: currentPeriodsScale,
		yScale: yScale,
		timeSeries,
		domainIndex: currentRightVisibleDomainIndex,
	});

	return (
		<>
			<div style={{opacity: percAnimation}}>
				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<BuildingAnimatedLine
						lineColor={'cyan'}
						periodsScale={currentPeriodsScale}
						yScale={yScale}
						area={layoutAreas.plot}
						timeSeries={timeSeries}
						visibleAreaWidth={x}
					/>
				</Position>

				<Position
					position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
				>
					<svg
						style={{
							width: layoutAreas.plot.width,
							height: layoutAreas.plot.height,
							overflow: 'visible',
						}}
					>
						{x && y ? <circle cx={x} cy={y} r={8} fill="cyan" /> : null}
					</svg>
				</Position>
			</div>

			<div style={{opacity: percAnimation}}>
				<Position
					position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
				>
					{/* TODO XAxis_SlideIn ??? axisSpec={toAxisSpec?} theme={theme.xAxis} periodsScale={currentPeriodsScale} /> */}
					<XAxis_SpecBased
						periodsScale={currentPeriodsScale}
						theme={theme.xAxis}
						area={layoutAreas.xAxis}
						axisSpec={axisSpec}
						clip={false}
					/>
				</Position>
			</div>
		</>
	);
};
