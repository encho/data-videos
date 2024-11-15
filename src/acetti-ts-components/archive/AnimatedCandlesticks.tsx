import {ScaleLinear} from 'd3-scale';

import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-layout';

type TTheme_Candlesticks_Candle = {
	bodyColor: string;
	bodyStrokeColor: string;
	lineColor: string;
	strokeWidth: number;
};

export type TTheme_Candlesticks = {
	up: TTheme_Candlesticks_Candle;
	down: TTheme_Candlesticks_Candle;
};

export const candlesticksDefaultTheme: TTheme_Candlesticks = {
	up: {
		bodyColor: 'blue',
		bodyStrokeColor: '#555',
		lineColor: '#555',
		strokeWidth: 2,
	},
	down: {
		bodyColor: 'red',
		bodyStrokeColor: '#555',
		lineColor: '#555',
		strokeWidth: 2,
	},
};

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
	theme?: TTheme_Candlesticks;
}> = ({
	area,
	ohlcSeries,
	periodsScale,
	yScale,
	theme = candlesticksDefaultTheme,
}) => {
	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<defs>
				<clipPath id="plotAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			<g clipPath="url(#plotAreaClipPath)">
				{ohlcSeries.map((ohlcItem) => {
					// const band = periodsScale.getBandFromIndex(i);
					const band = periodsScale.getBandFromDate(ohlcItem.date);
					const {x1} = band;
					const {width} = band;

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

					const candleTheme = yOpen > yClose ? theme.up : theme.down;

					// const rectFill = candleTheme.bodyColor;
					const {bodyColor, bodyStrokeColor, lineColor, strokeWidth} =
						candleTheme;

					return (
						<g>
							{/* high line */}
							<line
								x1={band.centroid}
								x2={band.centroid}
								y1={yHigh}
								y2={rectTopY}
								stroke={lineColor}
								strokeWidth={strokeWidth}
							/>
							{/* low line */}
							<line
								x1={band.centroid}
								x2={band.centroid}
								y1={yLow}
								y2={rectBottomY}
								stroke={lineColor}
								strokeWidth={strokeWidth}
							/>
							<rect
								x={paddedX1}
								width={paddedWidth}
								y={rectTopY}
								height={rectHeight}
								fill={bodyColor}
								stroke={bodyStrokeColor}
								strokeWidth={strokeWidth}
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
