import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TPeriodsScale} from '../periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';
import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';

export const AnimatedLine: React.FC<{
	lineColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	displayDots?: boolean;
}> = ({
	lineColor,
	area,
	timeSeries,
	periodsScale,
	yScale,
	displayDots = true,
}) => {
	const linePath = line<{date: Date; value: number}>()
		.x((d) => periodsScale.getBandFromDate(d.date).centroid)
		.y((d) => yScale(d.value));

	const d = linePath(timeSeries) || '';

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<defs>
				<clipPath id="plotAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{/* <path
				d={d}
				stroke={lineColor}
				strokeWidth={1}
				fill="transparent"
				opacity={0.3}
			/> */}

			<g clipPath="url(#plotAreaClipPath)">
				<path d={d} stroke={lineColor} strokeWidth={4} fill="none" />
				{/* dots */}

				{displayDots
					? timeSeries.map((timeSeriesItem) => {
							const band = periodsScale.getBandFromDate(timeSeriesItem.date);
							const cx = band.centroid;
							const cy = yScale(timeSeriesItem.value);
							return (
								<g>
									<circle
										cx={cx}
										cy={cy}
										r={6}
										fill="darkorange"
										opacity={0.3}
									/>
									{/* <circle cx={cx} cy={cy} r={3} fill="darkorange" /> */}
								</g>
							);
					  })
					: null}
			</g>
		</svg>
	);
};
