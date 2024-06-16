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

import {TGridLayoutArea} from '../../acetti-layout';
import {TimeSeries} from '../utils/timeSeries/generateBrownianMotionTimeSeries';
// import {getXAxisSpec} from '../acetti-axis/getXAxisSpec';
// ****************************************************************
const SHOW_ZERO = false;

type TDomainIndices = {
	start: number;
	end: number;
};

export const AnimatedValueDot: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	xScaleCurrent: ScaleTime<Date, number>;
	yScaleCurrent: ScaleLinear<number, number>;
	interpolatedCurrentDotData: {date: Date; value: number};
}> = ({
	dotColor,
	area,
	xScaleCurrent,
	yScaleCurrent,
	interpolatedCurrentDotData,
}) => {
	const x = xScaleCurrent(interpolatedCurrentDotData.date);
	const y = yScaleCurrent(interpolatedCurrentDotData.value);

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			{/* <defs>
				<clipPath id="myClip">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs> */}

			<circle cx={x} cy={y} r={10} fill={dotColor} />
			<circle cx={x} cy={y} r={18} fill={dotColor} opacity={0.2} />
		</svg>
	);
};
