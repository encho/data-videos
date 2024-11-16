import React, {useState, ReactNode} from 'react';
import {
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	random,
} from 'remotion';

// CREDIT:
// "Mikhail Bespalov"
// "https://codepen.io/Mikhail-Bespalov/pen/yLmpxOG"

/**
 * Calculate the opacity of the image based on eased progress
 * @param easedProgress - Eased progress value between 0 and 1
 * @returns The calculated opacity value (between 0 and 1)
 */
const calculateOpacity = (easedProgress: number): number => {
	if (easedProgress < 0.5) {
		return 1; // Fully visible in the first half
	}

	// Fade out during the second half
	const fadeOutProgress = (easedProgress - 0.5) / 0.5; // Normalize to 0-1 range
	return 1 - fadeOutProgress;
};

type TDissolveFilterContainerProps = {
	seedString: string;
	children: ({filterUrl}: {filterUrl: string}) => ReactNode;
};

export const DissolveExitFilter: React.FC<TDissolveFilterContainerProps> = ({
	seedString,
	children,
}) => {
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const filterId = `dissolve-filter-${seedString}`;
	const filterUrl = `url(#${filterId})`;

	const [randomSeed] = useState(() => Math.floor(random(seedString) * 1000));

	const maxDisplacementScale = 2000;

	const easedProgress = interpolate(
		frame,
		[durationInFrames - fps * 0.8, durationInFrames - 1],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const displacementScale = easedProgress * maxDisplacementScale;
	const opacity = calculateOpacity(easedProgress);

	return (
		<>
			<DissolveFilter
				scale={displacementScale}
				randomSeed={randomSeed}
				filterId={filterId}
			/>
			<div style={{opacity}}>{children({filterUrl})}</div>
		</>
	);
};

const DissolveFilter: React.FC<{
	filterId: string;
	scale: number;
	randomSeed: number;
}> = ({scale, randomSeed, filterId}) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
			<defs>
				<filter
					id={filterId}
					x="-200%"
					y="-200%"
					width="500%"
					height="500%"
					colorInterpolationFilters="sRGB"
					overflow="visible"
				>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.004"
						numOctaves="1"
						result="bigNoise"
						seed={randomSeed}
					/>
					<feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
						<feFuncR type="linear" slope="3" intercept="-1" />
						<feFuncG type="linear" slope="3" intercept="-1" />
					</feComponentTransfer>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="1"
						numOctaves="1"
						result="fineNoise"
					/>
					<feMerge result="mergedNoise">
						<feMergeNode in="bigNoiseAdjusted" />
						<feMergeNode in="fineNoise" />
					</feMerge>
					<feDisplacementMap
						in="SourceGraphic"
						in2="mergedNoise"
						scale={scale} // here
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>
		</svg>
	);
};

// const maxDisplacementScale = 2000; // Maximum displacement scale for the effect

/**
 * Easing function: Ease Out Cubic
 * @param t - Progress value between 0 and 1
 * @returns Eased progress value
 */
const easeOutCubic = (t: number): number => {
	return 1 - (1 - t ** 3);
};

/**
 * Calculate the displacement scale based on animation progress
 * @param animationProgress - Progress value between 0 and 1
 * @param maxDisplacementScale - Maximum scale value for displacement
 * @returns The scaled displacement value
 */
const calculateDisplacementScale = (
	animationProgress: number,
	maxDisplacementScale: number
): number => {
	const easedProgress = easeOutCubic(animationProgress);
	return easedProgress * maxDisplacementScale;
};

// Example usage:
const animationProgress = 0.5; // Midpoint of animation
const maxDisplacementScale = 2000;

const displacementScale = calculateDisplacementScale(
	animationProgress,
	maxDisplacementScale
);
console.log(displacementScale); // Eased displacement scale value
