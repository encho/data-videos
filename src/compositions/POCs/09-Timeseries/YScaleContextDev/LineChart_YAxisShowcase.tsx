import {ScaleLinear} from 'd3-scale';

import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
// TODO use only this "NEW" Animated_XAxis down the line
import {AnimatedLine} from '../../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from './Animated_XAxis';
import {Animated_YAxis} from './Animated_YAxis';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {times} from 'lodash';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO rename to LineChart_YAxisShowcase
export const LineChart_YAxisShowcase: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	yDomainType: TYDomainType;
	theme: ThemeType;
	yScale: ScaleLinear<number, number>;
}> = ({
	layoutAreas,
	timeSeries,
	yScale, // or yScaleAnimationContext??
	theme,
	periodScaleAnimationContext,
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
					yScale={yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					// TODO theme
				/>
			</Position>
			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<Animated_YAxis
					yScale={yScale}
					periodScaleAnimationContext={periodScaleAnimationContext}
					area={layoutAreas.yAxis}
					timeSeries={timeSeries}
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
