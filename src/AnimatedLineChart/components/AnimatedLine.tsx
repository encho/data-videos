import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	Sequence,
} from 'remotion';
import {max, min} from 'd3-array';
import {scaleLinear, scaleTime, ScaleTime, ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

import {TGridLayoutArea} from '../../acetti-viz';
import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';
// import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';
// ****************************************************************
const SHOW_ZERO = false;

type TDomainIndices = {
	start: number;
	end: number;
};

export const AnimatedLine: React.FC<{
	lineColor: string;
	area: TGridLayoutArea;
	// layoutAreas: {
	// 	plot: TGridLayoutArea;
	// 	xAxis: TGridLayoutArea;
	// 	yAxis: TGridLayoutArea;
	// };
	timeSeries: TimeSeries;
	fromDomainIndices: TDomainIndices;
	toDomainIndices: TDomainIndices;
	xScaleCurrent: ScaleTime<Date, number>;
	yScaleCurrent: ScaleLinear<number, number>;
}> = ({
	lineColor,
	area,
	timeSeries,
	xScaleCurrent,
	yScaleCurrent,
	// fromDomainIndices,
	// toDomainIndices,
}) => {
	const linePath = line<{date: Date; value: number}>()
		.x((d) => xScaleCurrent(d.date))
		.y((d) => yScaleCurrent(d.value));

	const d = linePath(timeSeries) || '';

	// console.log(xScaleCurrent.range());
	// console.log(xScaleCurrent.domain());

	return (
		<svg
			overflow="visible"
			width={area.width}
			height={area.height}
			// style={{backgroundColor: lineColor}}
		>
			<defs>
				<clipPath id="myClip">
					{/* <rect x="50" y="50" width="200" height="200" /> */}
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{/* <rect
				x={0}
				y={0}
				width={area.width}
				height={area.height}
				fill="#f05122"
				opacity={0.05}
			/> */}

			{/* the animated line */}
			{d ? (
				<g>
					<path
						// clipPath="url(#myClip)"
						d={d}
						// strokeDasharray={evolvedPath.strokeDasharray}
						// strokeDashoffset={evolvedPath.strokeDashoffset}
						// stroke={styling.lineColor}
						// strokeWidth={styling.lineStrokeWidth}
						// fill="transparent"
						stroke={lineColor}
						strokeWidth={1}
						fill="transparent"
						// opacity={0.35}
						opacity={0}
					/>

					<path
						clipPath="url(#myClip)"
						d={d}
						// strokeDasharray={evolvedPath.strokeDasharray}
						// strokeDashoffset={evolvedPath.strokeDashoffset}
						// stroke={styling.lineColor}
						// strokeWidth={styling.lineStrokeWidth}
						// fill="transparent"
						stroke={lineColor}
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
	);
};
