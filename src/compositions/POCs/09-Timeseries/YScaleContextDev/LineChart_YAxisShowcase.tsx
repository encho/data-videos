// import {ScaleLinear} from 'd3-scale';

import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLine} from '../../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from './Animated_XAxis';
import {Animated_YAxis} from './Animated_YAxis';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {TYScaleAnimationContext} from './YScaleAnimationContainer';

// type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO rename to LineChart_YAxisShowcase
export const LineChart_YAxisShowcase: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	yScaleAnimationContext: TYScaleAnimationContext;
	timeSeries: TimeSeries;
	timeSeries2: TimeSeries;
	timeSeries3: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
}> = ({
	layoutAreas,
	timeSeries,
	timeSeries2,
	timeSeries3,
	periodScaleAnimationContext,
	yScaleAnimationContext,
}) => {
	const axisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};
	// const axisDebugColors = {};

	return (
		<>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={'black'}
					periodsScale={periodScaleAnimationContext.periodsScale}
					yScale={yScaleAnimationContext.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={'orange'}
					periodsScale={periodScaleAnimationContext.periodsScale}
					yScale={yScaleAnimationContext.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries2}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={'#00aadd'}
					periodsScale={periodScaleAnimationContext.periodsScale}
					yScale={yScaleAnimationContext.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries3}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<Animated_YAxis
					periodScaleAnimationContext={periodScaleAnimationContext}
					yScale={yScaleAnimationContext.yScale}
					yScaleFrom={yScaleAnimationContext.yScaleFrom}
					yScaleTo={yScaleAnimationContext.yScaleTo}
					area={layoutAreas.yAxis}
					nrTicks={6}
					tickFormatter={currencyFormatter}
					{...axisDebugColors}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimationContext={periodScaleAnimationContext}
					area={layoutAreas.xAxis}
					{...axisDebugColors}
				/>
			</Position>
		</>
	);
};

// TODO: export use because of passed parametrization
// e.g. formatter: {type: "currency", currency: "USD", digits: 0, locale: "en-GB"}
const currencyFormatter = (x: number) => {
	const formatter = new Intl.NumberFormat('en-GB', {
		maximumFractionDigits: 0, // Ensures no decimal places
		minimumFractionDigits: 0, // Ensures no decimal places
	});
	return '$ ' + formatter.format(x);
};