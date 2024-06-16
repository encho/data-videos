import {ScaleLinear} from 'd3-scale';

import {Position} from '../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {TPeriodsScale} from '../../../acetti-ts-periodsScale/periodsScale';
import {XAxis_SpecBased} from './components/XAxis_SpecBased';
import {AnimatedYAxis} from '../../components/AnimatedYAxis';
import {AnimatedLine} from '../../../acetti-ts-components/AnimatedLine';
import {AnimatedValueDot} from '../../../acetti-ts-components/AnimatedValueDot';
import {
	getMonthStartsAxisSpec,
	getQuarterStartsAxisSpec,
} from './components/axisSpecs';
import {ThemeType} from '../../../acetti-themes/themeTypes';

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
	theme: ThemeType;
	yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
}> = ({
	layoutAreas,
	timeSeries,
	theme,
	yScale,
	periodScale: currentPeriodsScale,
}) => {
	const dates = timeSeries.map((it) => it.date);

	// TODO the appropriate SPEC type should be inferred given the:
	// - visible date range
	// - width of the area
	// - font size
	// - etc...
	const numberOfVisibleDays =
		currentPeriodsScale.getVisibleDomain_NumberOfDays();
	const SPEC_TYPE = numberOfVisibleDays < 200 ? 'monthStarts' : 'quarterStarts';

	const axisSpecFunctions = {
		monthStarts: getMonthStartsAxisSpec,
		quarterStarts: getQuarterStartsAxisSpec,
	};

	// TODO evtl. we will receive 2 axis specs from the container component (from, to)
	const axisSpec = axisSpecFunctions[SPEC_TYPE](currentPeriodsScale, dates);

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
					area={layoutAreas.xAxis}
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
