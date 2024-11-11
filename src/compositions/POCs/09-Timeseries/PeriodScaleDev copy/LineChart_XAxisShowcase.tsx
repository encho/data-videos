import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';
import {
	getIndicesAxisSpec,
	getDaysAxisSpec,
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_xAxis';
// TODO use only this "NEW" XAxis_Transition down the line
import {XAxis_Transition} from '../XAxisSpecsDev/XAxis_TransitionNEW';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
// import {TLineChartAnimationContext} from '../../../../acetti-ts-base/LineChartAnimationContainer';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

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

export const LineChart_XAxisShowcase: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		// plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		xAxis_days: TGridLayoutArea;
		xAxis_monthStarts: TGridLayoutArea;
		xAxis_quarterStarts: TGridLayoutArea;
		// yAxis: TGridLayoutArea;
	};
	yDomainType: TYDomainType;
	theme: ThemeType;
	// yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
	fromPeriodScale: TPeriodsScale;
	toPeriodScale: TPeriodsScale;
	//
	currentSliceInfo: TPeriodScaleAnimationContext['currentSliceInfo'];
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	// yScale,
	periodScale: currentPeriodsScale,
	fromPeriodScale,
	toPeriodScale,
	//
	currentSliceInfo,
}) => {
	const fromSpecType = getAxisSpecType(fromPeriodScale);
	const toSpecType = getAxisSpecType(toPeriodScale);

	// const axisSpecFrom = getAxisSpec(currentPeriodsScale, fromSpecType);
	// const axisSpecTo = getAxisSpec(currentPeriodsScale, toSpecType);
	const axisSpecFrom = getAxisSpec(fromPeriodScale, fromSpecType);
	const axisSpecTo = getAxisSpec(toPeriodScale, toSpecType);

	// ***************************
	// the different x-axis specs:
	// ***************************

	// 1. days
	// const xAxisSpec_days_from = getDaysAxisSpec(currentPeriodsScale);
	// const xAxisSpec_days_to = getDaysAxisSpec(currentPeriodsScale);
	const xAxisSpec_days_from = getDaysAxisSpec(fromPeriodScale);
	const xAxisSpec_days_to = getDaysAxisSpec(toPeriodScale);

	// 2. month starts
	// const xAxisSpec_monthStarts_from =
	// 	getMonthStartsAxisSpec(currentPeriodsScale);
	// const xAxisSpec_monthStarts_to = getMonthStartsAxisSpec(currentPeriodsScale);
	const xAxisSpec_monthStarts_from = getMonthStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_monthStarts_to = getMonthStartsAxisSpec(toPeriodScale);

	// 3. quarter starts
	// const xAxisSpec_quarterStarts_from =
	// 	getQuarterStartsAxisSpec(currentPeriodsScale);
	// const xAxisSpec_quarterStarts_to =
	// 	getQuarterStartsAxisSpec(currentPeriodsScale);
	const xAxisSpec_quarterStarts_from =
		getQuarterStartsAxisSpec(fromPeriodScale);
	const xAxisSpec_quarterStarts_to = getQuarterStartsAxisSpec(toPeriodScale);

	// ***************************

	// const Y_RANGE_FIXED = yScale.range();

	// const yDomainFrom =
	// 	currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
	// 		timeSeries
	// 	);

	// const yDomainTo =
	// 	currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(timeSeries);

	// const yScaleFrom: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomainFrom)
	// 	.range([Y_RANGE_FIXED[0], 0]);

	// const yScaleTo: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomainTo)
	// 	.range([Y_RANGE_FIXED[0], 0]);

	// const yAxisSpecFrom = getYAxisSpec(yScaleFrom, 5, currencyFormatter);
	// const yAxisSpecTo = getYAxisSpec(yScaleTo, 5, currencyFormatter);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<>
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
					{...xAxisDebugColors}
				/>
			</Position>

			{/* days x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_days.x1,
					top: layoutAreas.xAxis_days.y1,
				}}
			>
				<XAxis_Transition
					fromAxisSpec={xAxisSpec_days_from}
					toAxisSpec={xAxisSpec_days_to}
					theme={theme.xAxis}
					area={layoutAreas.xAxis_days}
					periodsScale={currentPeriodsScale}
					currentSliceInfo={currentSliceInfo}
				/>
			</Position>

			{/* month starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_monthStarts.x1,
					top: layoutAreas.xAxis_monthStarts.y1,
				}}
			>
				<XAxis_Transition
					fromAxisSpec={xAxisSpec_monthStarts_from}
					toAxisSpec={xAxisSpec_monthStarts_to}
					theme={theme.xAxis}
					area={layoutAreas.xAxis_monthStarts}
					periodsScale={currentPeriodsScale}
					currentSliceInfo={currentSliceInfo}
				/>
			</Position>

			{/* quarter starts x axis */}
			<Position
				position={{
					left: layoutAreas.xAxis_quarterStarts.x1,
					top: layoutAreas.xAxis_quarterStarts.y1,
				}}
			>
				<XAxis_Transition
					fromAxisSpec={xAxisSpec_quarterStarts_from}
					toAxisSpec={xAxisSpec_quarterStarts_to}
					theme={theme.xAxis}
					area={layoutAreas.xAxis_quarterStarts}
					periodsScale={currentPeriodsScale}
					currentSliceInfo={currentSliceInfo}
				/>
			</Position>
		</>
	);
};
