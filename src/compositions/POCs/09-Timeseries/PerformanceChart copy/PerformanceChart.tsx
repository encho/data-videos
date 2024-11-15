import {useEffect} from 'react';

import {Position} from '../../../../acetti-layout/atoms/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLine} from '../../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from '../utils/Animated_XAxis';
import {Animated_YAxis} from '../utils/Animated_YAxis';
import {Animated_ValueDot} from '../utils/Animated_ValueDot';
import {TYScaleAnimationContext} from '../utils/useYScaleAnimation';
import {TPeriodScaleAnimationContext} from '../utils/usePeriodScaleAnimation';

export const PerformanceChart: React.FC<{
	periodScaleAnimation: TPeriodScaleAnimationContext;
	yScaleAnimation: TYScaleAnimationContext;
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
}> = ({layoutAreas, timeSeries, periodScaleAnimation, yScaleAnimation}) => {
	useEffect(() => {
		periodScaleAnimation.setPeriodScalesWidth(layoutAreas.plot.width);
		yScaleAnimation.setYScalesHeight(layoutAreas.plot.height);
	}, [layoutAreas.plot.width]);

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				{/* TODO port to Animated_Line */}
				<AnimatedLine
					lineColor="#f05122"
					periodsScale={periodScaleAnimation.periodsScale}
					yScale={yScaleAnimation.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<Animated_ValueDot
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimation}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
					dotColor="#f05122"
					radius={8}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<Animated_YAxis
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimation}
					area={layoutAreas.yAxis}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					area={layoutAreas.xAxis}
				/>
			</Position>
		</div>
	);
};
