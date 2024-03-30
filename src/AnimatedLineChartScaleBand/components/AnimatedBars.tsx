import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TPeriodsScale} from '../periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';
import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';

export const AnimatedBars: React.FC<{
	barsColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
}> = ({barsColor, area, timeSeries, periodsScale, yScale}) => {
	// const make padding part of scale ?
	const BARS_PADDING_PERC = 0.25;

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<defs>
				<clipPath id="plotAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			<g clipPath="url(#plotAreaClipPath)">
				{timeSeries.map((timeSeriesItem) => {
					const band = periodsScale.getBandFromDate(timeSeriesItem.date);
					const yValue = yScale(timeSeriesItem.value);
					const height = area.height - yValue;

					// const make padding part of scale ?
					const barTotalPadding = band.width * BARS_PADDING_PERC;
					const x1Adjusted = band.x1 + barTotalPadding / 2;
					const widthAdjusted = band.width - barTotalPadding;

					return (
						<g>
							<rect
								x={x1Adjusted}
								y={yValue}
								height={height}
								width={widthAdjusted}
								fill={barsColor}
							/>
							{/* // <circle cx={cx} cy={cy} r={5} fill="darkorange" /> */}
						</g>
					);
				})}
			</g>
			{/* <path
				d={d}
				stroke={'cyan'}
				strokeWidth={1}
				fill="transparent"
				opacity={0.3}
			/> */}

			{/* <g clipPath="url(#plotAreaClipPath)">
				<path
					d={d}
					// stroke={lineColor}
					stroke={'cyan'}
					strokeWidth={5}
					fill="none"
				/>

				{displayDots
					? timeSeries.map((timeSeriesItem) => {
							const band = periodsScale.getBandFromDate(timeSeriesItem.date);
							const cx = band.centroid;
							const cy = yScale(timeSeriesItem.value);
							return (
								<g>
									<circle cx={cx} cy={cy} r={5} fill="darkorange" />
								</g>
							);
					  })
					: null}
			</g> */}
		</svg>
	);
};
