// import {ScaleLinear} from 'd3-scale';
// import {line} from 'd3-shape';

import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	interpolate,
	Sequence,
} from 'remotion';

import {TPeriodsScale} from '../periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';

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

export const HighlightPeriods: React.FC<{
	area: TGridLayoutArea;
	periodsScale: TPeriodsScale;
	domainIndices: [number, number];
	currentFrame: number;
	durationInFrames: number;
	fadeInDurationInFrames: number;
}> = ({
	area,
	periodsScale,
	domainIndices,
	currentFrame,
	durationInFrames,
	fadeInDurationInFrames,
}) => {
	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const x1 = periodsScale.getBandFromIndex(domainIndices[0]).x1;
	const x2 = periodsScale.getBandFromIndex(domainIndices[1]).x2;
	const width = x2 - x1;
	const height = area.height;

	const pulsingFactor = calculatePulsingFactor(
		currentFrame,
		durationInFrames,
		30
	);

	const animatedOpacityRect =
		interpolate(
			currentFrame,
			[0, durationInFrames - fadeInDurationInFrames, durationInFrames],
			[0, 0, 0.13],
			{
				easing: EASING_FUNCTION,
				// in this case should not be necessary
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		) * pulsingFactor;

	const animatedOpacityLines = animatedOpacityRect * 2;

	return (
		<svg overflow="visible" width={area.width} height={area.height}>
			<line
				x1={x1}
				x2={x1}
				y1={0}
				y2={height}
				stroke={'#ff0000'}
				strokeWidth={2}
				opacity={animatedOpacityLines}
			/>
			<line
				x1={x2}
				x2={x2}
				y1={0}
				y2={height}
				stroke={'#ff0000'}
				strokeWidth={2}
				opacity={animatedOpacityLines}
			/>
			<rect
				x={x1}
				y={0}
				width={width}
				height={height}
				fill="#ff0000"
				opacity={animatedOpacityRect}
			/>
		</svg>
	);
};
