import {ScaleLinear} from 'd3-scale';

import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../periodsScale/periodsScale';
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
		// numberOfVisibleDaysFrom < 60
		numberOfVisibleDaysFrom < 20
			? 'days'
			: numberOfVisibleDaysFrom < 200
			? 'monthStarts'
			: 'quarterStarts';

	return SPEC_TYPE;
};

const getAxisSpec = (periodsScale: TPeriodsScale, specType: TSpecType) => {
	const AXIS_SPEC_FUNCTIONS = {
		days: getDaysAxisSpec,
		monthStarts: getMonthStartsAxisSpec,
		quarterStarts: getQuarterStartsAxisSpec,
	};
	// TODO the appropriate SPEC type should be inferred given the:
	// - visible date range
	// - width of the area
	// - font size
	// - etc...

	// const numberOfVisibleDaysFrom = periodsScale.getVisibleDomain_NumberOfDays();
	// const SPEC_TYPE_FROM =
	// 	numberOfVisibleDaysFrom < 60
	// 		? 'days'
	// 		: numberOfVisibleDaysFrom < 200
	// 		? 'monthStarts'
	// 		: 'quarterStarts';
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
					//
					currentSliceInfo={currentSliceInfo}
				/>
				{/* <XAxis_Transition
					fromAxisSpec={axisSpecCurrentTest}
					toAxisSpec={axisSpecCurrentTest}
					theme={theme.xAxis}
					area={layoutAreas.xAxis}
					periodsScale={currentPeriodsScale}
					//
					currentSliceInfo={currentSliceInfo}
				/> */}
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
		</>
	);
};
