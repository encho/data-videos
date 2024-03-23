import {AbsoluteFill} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TGridLayoutArea} from '../acetti-viz';
import {TimeSeries} from './generateBrownianMotionTimeSeries';
import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';
// ****************************************************************
const SHOW_ZERO = false;

export const LineChart: React.FC<{
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
}> = ({area, timeSeries}) => {
	const data = timeSeries;

	const xAxisSpec = getXAxisSpec(
		timeSeries.map((it) => it.date),
		area
	);

	const yDomainMin = min(data, (it) => it.value) as number;
	const yDomainMax = max(data, (it) => it.value) as number;
	const yDomainDiff = yDomainMax - yDomainMin;
	// TODO padding conditional on input flag
	const yPadding = yDomainDiff * 0.1;
	const yDomainBounded = [yDomainMax + yPadding, yDomainMin - yPadding];

	const yDomainZero = [yDomainMax, 0];

	const showZero = SHOW_ZERO;
	const yDomain = showZero ? yDomainZero : yDomainBounded;

	const yScale = scaleLinear()
		.domain(yDomain)
		// .domain([max(data.map((it) => it.value)) as number, 0])
		.range([0, area.height]);
	// .nice();
	const linePath = line<{date: Date; value: number}>()
		.x((d) => xAxisSpec.scale(d.date))
		.y((d) => yScale(d.value));

	const d = linePath(timeSeries) || '';

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: area.y1,
					left: area.x1,
				}}
			>
				<svg
					overflow="visible"
					width={area.width}
					height={area.height}
					style={{backgroundColor: '#222'}}
				>
					{/* the animated line */}
					{d ? (
						<g>
							<path
								d={d}
								// strokeDasharray={evolvedPath.strokeDasharray}
								// strokeDashoffset={evolvedPath.strokeDashoffset}
								// stroke={styling.lineColor}
								// strokeWidth={styling.lineStrokeWidth}
								// fill="transparent"
								stroke={'#f05122'}
								strokeWidth={2}
								fill="transparent"
							/>
							{/* <circle
								cx={pointAtLength.x}
								cy={pointAtLength.y}
								fill={styling.lineColor}
								r={styling.lineCircleRadius}
							/> */}
						</g>
					) : null}
				</svg>
			</div>
		</AbsoluteFill>
	);
};
