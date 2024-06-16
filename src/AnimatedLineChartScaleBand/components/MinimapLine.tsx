import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TPeriodsScale} from '../../acetti-ts-periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-layout';
import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';

export const MinimapLine: React.FC<{
	lineColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
}> = ({lineColor, area, timeSeries, periodsScale, yScale}) => {
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

			<g clipPath="url(#plotAreaClipPath)">
				<path
					d={d}
					stroke={lineColor}
					strokeWidth={2}
					fill="none"
					opacity={1}
				/>
			</g>
		</svg>
	);
};
