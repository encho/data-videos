import {useEffect} from 'react';

import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {AnimatedLine} from '../../../../acetti-ts-components/AnimatedLine';
import {Animated_XAxis} from './Animated_XAxis';
import {Animated_YAxis} from './Animated_YAxis';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {TYScaleAnimationContext} from './YScaleAnimationContainer';
import {DisplayGridLayout} from '../../../../acetti-layout';

export const LineChart_YAxisShowcase: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	yScaleAnimationContext: TYScaleAnimationContext;
	timeSeries: TimeSeries;
	timeSeries2: TimeSeries;
	timeSeries3: TimeSeries;
	layoutAreas: {
		// chart: TGridLayoutArea;
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

	useEffect(() => {
		periodScaleAnimationContext.setPeriodScalesWidth(layoutAreas.plot.width);
		yScaleAnimationContext.setYScalesHeight(layoutAreas.plot.height);
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
					yAxisSpecFrom={yScaleAnimationContext.yAxisSpecFrom}
					yAxisSpecTo={yScaleAnimationContext.yAxisSpecTo}
					area={layoutAreas.yAxis}
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
		</div>
	);
};
