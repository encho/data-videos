import {useEffect} from 'react';

import {Position} from '../../../acetti-layout/atoms/Position';
import {TGridLayoutArea} from '../../../acetti-layout';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {AnimatedLine} from '../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from '../../POCs/09-Timeseries/utils/Animated_XAxis';
import {Animated_YAxis} from '../../POCs/09-Timeseries/utils/Animated_YAxis';
import {Animated_ValueDot} from '../../POCs/09-Timeseries/utils/Animated_ValueDot';
import {TYScaleAnimationContext} from '../../POCs/09-Timeseries/utils/useYScaleAnimation';
import {TPeriodScaleAnimationContext} from '../../POCs/09-Timeseries/utils/usePeriodScaleAnimation';

export const PerformanceCompareChart: React.FC<{
	periodScaleAnimation: TPeriodScaleAnimationContext;
	yScaleAnimation: TYScaleAnimationContext;
	timeSeries1: TimeSeries;
	timeSeries2: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
}> = ({
	layoutAreas,
	timeSeries1,
	timeSeries2,
	periodScaleAnimation,
	yScaleAnimation,
}) => {
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
					timeSeries={timeSeries1}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<Animated_ValueDot
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimation}
					area={layoutAreas.plot}
					timeSeries={timeSeries1}
					dotColor="#f05122"
					radius={8}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				{/* TODO port to Animated_Line */}
				<AnimatedLine
					lineColor="#00aadd"
					periodsScale={periodScaleAnimation.periodsScale}
					yScale={yScaleAnimation.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries2}
				/>
			</Position>

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<Animated_ValueDot
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimation}
					area={layoutAreas.plot}
					timeSeries={timeSeries2}
					dotColor="#00aadd"
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
