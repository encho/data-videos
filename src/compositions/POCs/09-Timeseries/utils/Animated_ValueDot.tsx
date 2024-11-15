import {Easing, interpolate} from 'remotion';

import {
	getXYRightClamped,
	getXYLeftClamped,
} from '../../../../acetti-ts-periodsScale/getXY';
import {TGridLayoutArea} from '../../../../acetti-layout';
import {useGlobalVideoContext} from '../../../../acetti-components/GlobalVideoContext';
import {TPeriodScaleAnimationContext} from './usePeriodScaleAnimation';
import {TYScaleAnimationContext} from './useYScaleAnimation';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';

export const Animated_ValueDot: React.FC<{
	area: TGridLayoutArea;
	dotColor: string;
	periodScaleAnimation: TPeriodScaleAnimationContext;
	yScaleAnimation: TYScaleAnimationContext;
	timeSeries: TimeSeries;
	radius?: number;
	showLeftDot?: boolean;
}> = ({
	dotColor,
	area,
	periodScaleAnimation,
	yScaleAnimation,
	timeSeries,
	radius = 20,
	showLeftDot = false,
}) => {
	const {periodsScale} = periodScaleAnimation;
	const {yScale} = yScaleAnimation;

	const {x: xLeft, y: yLeft} = getXYLeftClamped({
		periodsScale,
		timeSeries,
		yScale,
	});
	const {x: xRight, y: yRight} = getXYRightClamped({
		periodsScale,
		timeSeries,
		yScale,
	});

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			{/* <defs>
				<clipPath id="plotAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs> */}
			<g>
				{/* ensures that the dot is not displayed, if out of bounds vertically */}
				{showLeftDot && yLeft && yLeft >= 0 && yLeft <= area.height ? (
					<g>
						<Dot cx={xLeft} cy={yLeft} r={radius} fill={dotColor} />
					</g>
				) : null}
				{/* ensures that the dot is not displayed, if out of bounds vertically */}
				<g>
					<Dot
						cx={xRight}
						// QUICK-FIX, (yRight || 0) as the original condition was not displaying the Dot for the last timeseries value,
						// i.e. when the timeseries was fully visible
						// original condition was:
						// {yRight && yRight >= 0 && yRight <= area.height ? (<g><Dot...) : null}
						cy={yRight || 0}
						r={radius}
						fill={dotColor}
					/>
				</g>
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
	const globalVideoContext = useGlobalVideoContext();

	const frame = globalVideoContext.globalCurrentFrame;
	const durationInFrames = globalVideoContext.globalDurationInFrames;

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
