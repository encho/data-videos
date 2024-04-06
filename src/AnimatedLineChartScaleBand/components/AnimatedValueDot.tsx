import {ScaleLinear} from 'd3-scale';
import {useCurrentFrame, useVideoConfig, Easing, interpolate} from 'remotion';

import {getXY} from '../periodsScale/getXY';
import {
	getXYLeft,
	getXYRight,
	getXYRightClamped,
} from '../periodsScale/getXYLeft';
import {TPeriodsScale} from '../periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';

export const AnimatedValueDot: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	timeSeries: {value: number; date: Date}[];
	radius?: number;
}> = ({dotColor, area, yScale, periodsScale, timeSeries, radius = 20}) => {
	// const {x, y} = getXY({periodsScale, timeSeries, yScale});

	const {x: xLeft, y: yLeft} = getXYLeft({periodsScale, timeSeries, yScale});
	// const {x: xRight, y: yRight} = getXYRight({periodsScale, timeSeries, yScale});
	const {x: xRight, y: yRight} = getXYRightClamped({
		periodsScale,
		timeSeries,
		yScale,
	});

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			{/* <g>
				<Dot cx={x} cy={y} r={radius} fill={dotColor} />
			</g> */}
			<g>
				<Dot cx={xLeft} cy={yLeft} r={radius} fill={'#ffff00'} />
			</g>
			<g>
				<Dot cx={xRight} cy={yRight} r={radius} fill={'#ffff00'} />
			</g>
		</svg>
	);
};

function calculatePulsingFactor(
	value: number,
	max: number,
	frequency: number
): number {
	// Ensure value is within the range 0 to max
	value = Math.max(0, Math.min(value, max));

	// Calculate pulsing Factor using a sine function with frequency to create pulsating effect
	const pulsingFactor =
		Math.sin((value / max) * frequency * Math.PI) * 0.5 + 0.5;

	return pulsingFactor;
}

export const Dot: React.FC<{
	cx: number;
	cy: number;
	r: number;
	fill: string;
}> = ({cx, cy, r, fill}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const pulsingFactor = calculatePulsingFactor(frame, durationInFrames, 10);

	const animatedOpacity = interpolate(pulsingFactor, [0, 1], [0.5, 0.1], {
		easing: EASING_FUNCTION,
		// in this case should not be necessary
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const animatedBigRadius = interpolate(
		pulsingFactor,
		[0, 1],
		[r * 1.5, r * 3],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<g>
			<circle
				opacity={animatedOpacity}
				cx={cx}
				cy={cy}
				r={animatedBigRadius}
				fill={fill}
			/>
			<circle cx={cx} cy={cy} r={r} fill={fill} />
		</g>
	);
};
