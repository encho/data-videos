import {ScaleLinear} from 'd3-scale';

import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../periodsScale/periodsScale';
import {XAxis_SpecBased} from './components/XAxis_SpecBased';
import {AnimatedYAxis} from '../../components/AnimatedYAxis';
import {AnimatedLine} from '../../components/AnimatedLine';
import {AnimatedValueDot} from '../../components/AnimatedValueDot';
import {
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from './components/axisSpecs';

import {TTheme} from '../../theme';
import {XAxis_Transition} from './components/XAxis_Transition';

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
	easingPercentage: number;
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
	fromPeriodScale,
	toPeriodScale,
	easingPercentage,
}) => {
	const dates = timeSeries.map((it) => it.date);

	const AXIS_SPEC_FUNCTIONS = {
		monthStarts: getMonthStartsAxisSpec,
		quarterStarts: getQuarterStartsAxisSpec,
	};

	// TODO the appropriate SPEC type should be inferred given the:
	// - visible date range
	// - width of the area
	// - font size
	// - etc...

	// currentAxisSpec (for no transition)
	const numberOfVisibleDays =
		currentPeriodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE = numberOfVisibleDays < 200 ? 'monthStarts' : 'quarterStarts';

	// TODO evtl. we will receive 2 axis specs from the container component (from, to)
	const axisSpec = AXIS_SPEC_FUNCTIONS[SPEC_TYPE](currentPeriodsScale, dates);

	// axisSpecFrom (for start transition state)
	const numberOfVisibleDaysFrom =
		fromPeriodScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE_FROM =
		numberOfVisibleDaysFrom < 200 ? 'monthStarts' : 'quarterStarts';

	// TODO evtl. we will receive 2 axis specs from the container component (from, to)
	const axisSpecFrom = AXIS_SPEC_FUNCTIONS[SPEC_TYPE_FROM](
		fromPeriodScale,
		dates
	);

	// axisSpecTo (for start transition state)
	const numberOfVisibleDaysTo = toPeriodScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE_TO =
		numberOfVisibleDaysTo < 200 ? 'monthStarts' : 'quarterStarts';

	// TODO evtl. we will receive 2 axis specs from the container component (from, to)
	const axisSpecTo = AXIS_SPEC_FUNCTIONS[SPEC_TYPE_TO](toPeriodScale, dates);

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
				<XAxis_SpecBased
					axisSpec={axisSpec}
					theme={theme.xAxis}
					// theme={{...theme.xAxis, tickColor: 'red', color: 'red'}}
					area={layoutAreas.xAxis}
				/>
			</Position>

			<Position position={{left: layoutAreas.xAxis.x1, top: 50}}>
				<XAxis_SpecBased
					axisSpec={axisSpecFrom}
					theme={{...theme.xAxis, tickColor: 'red', color: 'red'}}
					area={layoutAreas.xAxis}
				/>
			</Position>

			<Position position={{left: layoutAreas.xAxis.x1, top: 100}}>
				<XAxis_SpecBased
					axisSpec={axisSpecTo}
					theme={{...theme.xAxis, tickColor: 'green', color: 'green'}}
					area={layoutAreas.xAxis}
				/>
			</Position>

			<Position position={{left: layoutAreas.xAxis.x1, top: 150}}>
				<h1 style={{fontSize: 30, marginBottom: 5}}>XAxis Transition:</h1>
				<XAxis_Transition
					fromAxisSpec={axisSpecFrom}
					toAxisSpec={axisSpecTo}
					theme={{...theme.xAxis, tickColor: 'magenta', color: 'magenta'}}
					area={layoutAreas.xAxis}
					easingPercentage={easingPercentage}
					// easingPercentage={easingPercentage}
					periodsScale={currentPeriodsScale}
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
		</>
	);
};
