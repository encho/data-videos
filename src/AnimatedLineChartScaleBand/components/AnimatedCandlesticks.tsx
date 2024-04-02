import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TPeriodsScale} from '../periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';
// import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';

export const AnimatedCandlesticks: React.FC<{
	area: TGridLayoutArea;
	ohlcSeries: {
		date: Date;
		open: number;
		high: number;
		low: number;
		close: number;
	}[];
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	displayDots?: boolean;
}> = ({area, ohlcSeries, periodsScale, yScale, displayDots = false}) => {
	// const linePath = line<{date: Date; value: number}>()
	// 	.x((d) => periodsScale.getBandFromDate(d.date).centroid)
	// 	.y((d) => yScale(d.value));

	// const d = linePath(timeSeries) || '';

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<defs>
				<clipPath id="plotAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			<g clipPath="url(#plotAreaClipPath)">
				{ohlcSeries.map((ohlcItem) => {
					const band = periodsScale.getBandFromDate(ohlcItem.date);
					const x1 = band.x1;
					const width = band.width;

					// TODO add padding funcitonality to scale!
					const paddedWidth = width * 0.8;
					const paddedX1 = x1 + (width * 0.2) / 2;

					const yOpen = yScale(ohlcItem.open);
					const yClose = yScale(ohlcItem.close);
					const yHigh = yScale(ohlcItem.high);
					const yLow = yScale(ohlcItem.low);

					// TODO use min/max
					const rectTopY = yOpen > yClose ? yClose : yOpen;
					const rectBottomY = yOpen < yClose ? yOpen : yClose;

					const rectHeight = yOpen > yClose ? yOpen - yClose : yClose - yOpen;
					const rectFill = yOpen > yClose ? 'green' : 'red';

					return (
						<g>
							{/* high line */}
							<line
								x1={band.centroid}
								x2={band.centroid}
								y1={yHigh}
								y2={rectTopY}
								stroke={'#222'}
								strokeWidth={2}
							/>
							{/* low line */}
							<line
								x1={band.centroid}
								x2={band.centroid}
								y1={yLow}
								y2={rectBottomY}
								stroke={'#222'}
								strokeWidth={2}
							/>
							<rect
								x={paddedX1}
								width={paddedWidth}
								y={rectTopY}
								height={rectHeight}
								fill={rectFill}
							/>
							{/* <circle cx={cx} cy={cy} r={6} fill="darkorange" opacity={0.3} /> */}
							{/* <circle cx={cx} cy={cy} r={3} fill="darkorange" /> */}
						</g>
					);
				})}
			</g>
		</svg>
	);
};
