import {useEffect} from 'react';

import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLine} from '../../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from '../utils/Animated_XAxis';
import {Animated_YAxis} from '../utils/Animated_YAxis';
import {TYScaleAnimationContext} from '../utils/useYScaleAnimation';
import {TPeriodScaleAnimationContext} from '../utils/usePeriodScaleAnimation';

export const LineChart_YAxisShowcase: React.FC<{
	periodScaleAnimation: TPeriodScaleAnimationContext;
	yScaleAnimation: TYScaleAnimationContext;
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
	periodScaleAnimation,
	yScaleAnimation,
}) => {
	const axisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};
	// const axisDebugColors = {};

	useEffect(() => {
		periodScaleAnimation.setPeriodScalesWidth(layoutAreas.plot.width);
		yScaleAnimation.setYScalesHeight(layoutAreas.plot.height);
	}, [layoutAreas.plot.width]);

	return (
		<div
			style={{
				position: 'relative',
				// width: layoutAreas.chart.width,
				// height: layoutAreas.chart.height,
			}}
		>
			{/* <div style={{position: 'absolute'}}>
				<DisplayGridLayout
					stroke={'rgba(255,0,255,0.5)'}
					fill="transparent"
					// hide={true}
					areas={layoutAreas}
					width={layoutAreas.chart.width}
					height={layoutAreas.chart.height}
				/>
			</div> */}

			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor="black"
					periodsScale={periodScaleAnimation.periodsScale}
					yScale={yScaleAnimation.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					lineColor="orange"
					periodsScale={periodScaleAnimation.periodsScale}
					yScale={yScaleAnimation.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries2}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					// TODO
					// periodScaleAnimation={periodScaleAnimation}
					// yScaleAnimation={yScaleAnimation}
					lineColor="#00aadd"
					periodsScale={periodScaleAnimation.periodsScale}
					yScale={yScaleAnimation.yScale}
					area={layoutAreas.plot}
					timeSeries={timeSeries3}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.yAxis.x1, top: layoutAreas.yAxis.y1}}
			>
				<Animated_YAxis
					periodScaleAnimation={periodScaleAnimation}
					yScaleAnimation={yScaleAnimation}
					area={layoutAreas.yAxis}
					{...axisDebugColors}
				/>
			</Position>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimation={periodScaleAnimation}
					area={layoutAreas.xAxis}
					{...axisDebugColors}
				/>
			</Position>
		</div>
	);
};
