import {Position} from '../../../../acetti-ts-base/Position';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
// TODO use only this "NEW" Animated_XAxis down the line
import {Animated_XAxis} from './Animated_XAxis';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
// import {TLineChartAnimationContext} from '../../../../acetti-ts-base/LineChartAnimationContainer';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

type TYDomainType = 'FULL' | 'VISIBLE' | 'ZERO_FULL' | 'ZERO_VISIBLE';

// TODO rename to LineChart_YAxisShowcase
export const LineChart_XAxisShowcase: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	yDomainType: TYDomainType;
	theme: ThemeType;
}> = ({layoutAreas, timeSeries, theme, periodScaleAnimationContext}) => {
	// ***************************

	// const Y_RANGE_FIXED = yScale.range();

	// const yDomainFrom =
	// 	currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
	// 		timeSeries
	// 	);

	// const yDomainTo =
	// 	currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(timeSeries);

	// const yScaleFrom: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomainFrom)
	// 	.range([Y_RANGE_FIXED[0], 0]);

	// const yScaleTo: ScaleLinear<number, number> = scaleLinear()
	// 	.domain(yDomainTo)
	// 	.range([Y_RANGE_FIXED[0], 0]);

	// const yAxisSpecFrom = getYAxisSpec(yScaleFrom, 5, currencyFormatter);
	// const yAxisSpecTo = getYAxisSpec(yScaleTo, 5, currencyFormatter);

	const xAxisDebugColors = {
		debugEnterColor: 'lime',
		debugUpdateColor: 'blue',
		debugExitColor: 'red',
	};

	return (
		<>
			<Position
				position={{left: layoutAreas.xAxis.x1, top: layoutAreas.xAxis.y1}}
			>
				<Animated_XAxis
					periodsScaleAnimationContext={periodScaleAnimationContext}
					area={layoutAreas.xAxis}
					{...xAxisDebugColors}
				/>
			</Position>
		</>
	);
};
