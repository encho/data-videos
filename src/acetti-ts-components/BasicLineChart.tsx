import {scaleLinear, ScaleLinear} from 'd3-scale';

import {Position} from '../AnimatedLineChartScaleBand/components/Position';
import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from '../AnimatedLineChartScaleBand/utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../AnimatedLineChartScaleBand/periodsScale/periodsScale';
import {AnimatedLine} from '../AnimatedLineChartScaleBand/components/AnimatedLine';
import {AnimatedValueDot} from './AnimatedValueDot';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from '../acetti-ts-axis/utils/axisSpecs_xAxis';
import {getYAxisSpec} from '../acetti-ts-axis/utils/axisSpecs_yAxis';
import {YAxis_Transition} from '../acetti-ts-axis/YAxis_Transition';
import {XAxis_Transition} from '../acetti-ts-axis/XAxis_Transition';
// TODO deprecate TTheme
// import {TTheme} from '../AnimatedLineChartScaleBand/theme';
import {ThemeType} from '../acetti-themes/themeTypes';
import {TLineChartAnimationContext} from '../acetti-ts-base/LineChartAnimationContainer';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO: export use because of passed parametrization
// e.g. formatter: {type: "currency", currency: "USD", digits: 0, locale: "en-GB"}
const currencyFormatter = (x: number) => {
	const formatter = new Intl.NumberFormat('en-GB', {
		maximumFractionDigits: 0, // Ensures no decimal places
		minimumFractionDigits: 0, // Ensures no decimal places
	});
	return '$ ' + formatter.format(x);
};

const AXIS_SPEC_FUNCTIONS = {
	indices: getIndicesAxisSpec,
	days: getDaysAxisSpec,
	monthStarts: getMonthStartsAxisSpec,
	quarterStarts: getQuarterStartsAxisSpec,
} as const;

type TSpecType = keyof typeof AXIS_SPEC_FUNCTIONS;

const getAxisSpecType = (periodsScale: TPeriodsScale): TSpecType => {
	const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE =
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: 'quarterStarts';

	return SPEC_TYPE;
};

const getAxisSpec = (periodsScale: TPeriodsScale, specType: TSpecType) => {
	const axisSpec = AXIS_SPEC_FUNCTIONS[specType](periodsScale);
	return axisSpec;
};

export const BasicLineChart: React.FC<{
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
	//
	currentSliceInfo: TLineChartAnimationContext['currentSliceInfo'];
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
	fromPeriodScale,
	toPeriodScale,
	//
	currentSliceInfo,
}) => {
	const fromSpecType = getAxisSpecType(fromPeriodScale);
	const toSpecType = getAxisSpecType(toPeriodScale);

	const axisSpecFrom = getAxisSpec(currentPeriodsScale, fromSpecType);
	const axisSpecTo = getAxisSpec(currentPeriodsScale, toSpecType);

	const Y_RANGE_FIXED = yScale.range();

	const yDomainFrom =
		currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
			timeSeries
		);

	const yDomainTo =
		currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(timeSeries);

	const yScaleFrom: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomainFrom)
		.range([Y_RANGE_FIXED[0], 0]);

	const yScaleTo: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomainTo)
		.range([Y_RANGE_FIXED[0], 0]);

	const yAxisSpecFrom = getYAxisSpec(yScaleFrom, 5, currencyFormatter);
	const yAxisSpecTo = getYAxisSpec(yScaleTo, 5, currencyFormatter);

	return (
		<>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={theme.dataColors[0].BASE}
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					// TODO theme
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedValueDot
					periodsScale={currentPeriodsScale}
					yScale={yScale}
					timeSeries={timeSeries}
					dotColor={theme.dataColors[0].BASE}
					area={layoutAreas.plot}
					radius={8}
					// TODO theme
				/>
			</Position>

			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<XAxis_Transition
					fromAxisSpec={axisSpecFrom}
					toAxisSpec={axisSpecTo}
					theme={theme.xAxis}
					area={layoutAreas.xAxis}
					periodsScale={currentPeriodsScale}
					currentSliceInfo={currentSliceInfo}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<YAxis_Transition
					fromAxisSpec={yAxisSpecFrom}
					toAxisSpec={yAxisSpecTo}
					area={layoutAreas.yAxis}
					yScale={yScale}
					theme={theme.yAxis}
					currentSliceInfo={currentSliceInfo}
				/>
			</Position>
		</>
	);
};
