import {scaleLinear, ScaleLinear} from 'd3-scale';

import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	TPeriodsScale,
	// periodsScale
} from '../../periodsScale/periodsScale';
// TODO evtl deprecate?
// import {XAxis_SpecBased} from './components/XAxis_SpecBased';
import {AnimatedYAxis} from '../../components/AnimatedYAxis';
import {AnimatedLine} from '../../components/AnimatedLine';
import {AnimatedValueDot} from '../../components/AnimatedValueDot';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from './components/axisSpecs';
import {YAxis_SpecBased} from './components/YAxis_SpecBased';
import {getYAxisSpecFromScale} from '../../../acetti-axis/getYAxisSpecFromScale';
import {getYAxisSpec} from './components/axisSpecs_yAxis';
import {YAxis_Transition} from './components/YAxis_Transition';
// import {periodsScale} from '../../periodsScale/periodsScale';

import {TTheme} from '../../theme';
import {XAxis_Transition} from './components/XAxis_Transition';
// import {XAxis_SpecBased} from './components/XAxis_SpecBased';
import {TLineChartAnimationContext} from './LineChartAnimationContainer';

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
	theme: TTheme;
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

	///// ***************************************************

	// const yScale: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomain)
	// 	.range([AREA_SHOULD_BE_ANIMATED.height, 0]);
	// ********
	// ********
	// ********
	// const yScale: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomain)
	// 	.range([AREA_SHOULD_BE_ANIMATED.height, 0]);
	// ********
	// ********
	// ********

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
	// .range([0, Y_RANGE_FIXED[1]]);

	const yScaleTo: ScaleLinear<number, number> = scaleLinear()
		.domain(yDomainTo)
		.range([Y_RANGE_FIXED[0], 0]);

	// const yAxisSpec = getYAxisSpec(yScale, 3, currencyFormatter);
	const yAxisSpecFrom = getYAxisSpec(yScaleFrom, 5, currencyFormatter);
	const yAxisSpecTo = getYAxisSpec(yScaleTo, 5, currencyFormatter);

	// console.log({yDomainFrom, yDomainTo, yAxisSpecFrom, yAxisSpecTo, yAxisSpec});

	// const yAxisDomainRangeFrom = periodsScaleFrom.getTimeSeriesExtent(timeSeries);

	// const {x: xLeft, y: yLeft} = getXYLeftClamped({
	// 	periodsScale,
	// 	timeSeries,
	// 	yScale,
	// });
	// const {x: xRight, y: yRight} = getXYRightClamped({
	// 	periodsScale,
	// 	timeSeries,
	// 	yScale,
	// });

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

			{/* <Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1 - 100}}
			>
				<XAxis_SpecBased
					axisSpec={axisSpecFrom}
					theme={theme.xAxis}
					area={layoutAreas.xAxis}
					periodsScale={currentPeriodsScale}
				/>
			</Position> */}

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
				<AnimatedYAxis
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					theme={theme.yAxis}
					formatter={currencyFormatter}
				/>
			</Position>
			{/* <Position
				position={{left: layoutAreas.yAxis.x1 - 300, top: layoutAreas.yAxis.y1}}
			>
				<YAxis_SpecBased
					yAxisSpec={yAxisSpec}
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					theme={theme.yAxis}
				/>
			</Position> */}

			<Position
				position={{left: layoutAreas.yAxis.x1 - 300, top: layoutAreas.yAxis.y1}}
			>
				<YAxis_SpecBased
					yAxisSpec={yAxisSpecTo}
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					theme={theme.yAxis}
					// formatter={currencyFormatter}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.yAxis.x1 - 450, top: layoutAreas.yAxis.y1}}
			>
				<YAxis_SpecBased
					yAxisSpec={yAxisSpecFrom}
					area={layoutAreas.yAxis}
					yScaleCurrent={yScale}
					theme={theme.yAxis}
					// formatter={currencyFormatter}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.yAxis.x1 - 100, top: layoutAreas.yAxis.y1}}
			>
				<YAxis_Transition
					fromAxisSpec={yAxisSpecFrom}
					toAxisSpec={yAxisSpecTo}
					area={layoutAreas.yAxis}
					yScale={yScale}
					theme={theme.yAxis}
					currentSliceInfo={currentSliceInfo}
					// formatter={currencyFormatter}
				/>
			</Position>
		</>
	);
};
