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
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
}> = ({
	layoutAreas,
	timeSeries,
	periodScaleAnimationContext,
	yScaleAnimationContext,
}) => {
	const axisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor={'magenta'}
					periodsScale={periodScaleAnimationContext.periodsScale}
					yScale={yScaleAnimationContext.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					// TODO theme
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
