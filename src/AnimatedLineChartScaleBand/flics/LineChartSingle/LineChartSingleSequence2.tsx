// import {ReactNode} from 'react';
import {
	// Sequence,
	// AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

// import {AnimatedCandlesticks} from '../../components/AnimatedCandlesticks';
import {Position} from '../../components/Position';
import {TGridLayoutArea} from '../../../acetti-viz';
import {TimeSeries} from '../../utils/timeSeries/generateBrownianMotionTimeSeries';
import {periodsScale, TPeriodsScale} from '../../periodsScale/periodsScale';
import {AnimatedXAxis_MonthStarts} from '../../components/AnimatedXAxis_MonthStarts';
import {AnimatedYAxis} from '../../components/AnimatedYAxis';
import {AnimatedLine} from '../../components/AnimatedLine';
import {AnimatedValueDot} from '../../components/AnimatedValueDot';
import {getYDomain} from '../../utils/timeSeries/timeSeries';

import {TTheme} from '../../theme';

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

export const LineChartSingleSequence2: React.FC<{
	timeSeries: TimeSeries;
	layoutAreas: {
		plot: TGridLayoutArea;
		xAxis: TGridLayoutArea;
		yAxis: TGridLayoutArea;
	};
	// fromVisibleDomainIndices: [number, number];
	// toVisibleDomainIndices: [number, number];
	yDomainType: TYDomainType;
	theme: TTheme;
	//
	// easingPercentage: number;
	yScale: ScaleLinear<number, number>;
	periodScale: TPeriodsScale;
}> = ({
	layoutAreas,
	timeSeries,
	// fromVisibleDomainIndices,
	// toVisibleDomainIndices,
	// yDomainType,
	theme,
	//
	// easingPercentage,
	yScale,
	periodScale: currentPeriodsScale,
}) => {
	const dates = timeSeries.map((it) => it.date);

	return (
		<div>
			<Position
				zIndex={100}
				position={{left: layoutAreas.plot.x1, top: layoutAreas.plot.y1}}
			>
				<AnimatedLine
					// lineColor={theme.dataColors[0].BASE}
					lineColor={'yellow'}
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
				{/* <AnimatedXAxis_PeriodsScale */}
				<AnimatedXAxis_MonthStarts
					theme={theme.xAxis}
					dates={dates}
					periodsScale={currentPeriodsScale}
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
		</div>
	);
};
