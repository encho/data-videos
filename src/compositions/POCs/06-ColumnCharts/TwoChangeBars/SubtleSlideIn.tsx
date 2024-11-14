import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// export const transitionDuration = 15;

export const SubtleSlideIn: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const {
		fps,
		// width,
		height,
	} = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = spring({
		fps,
		frame,
		config: {damping: 200},
		durationInFrames: 50,
	});

	const currentOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// TODO we need typography info here evtl.
	const currentFilterPixels = interpolate(frame, [0, 20], [10, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `translateY(${interpolate(
					spr,
					[0, 1],
					// TODO we need typography info here evtl.
					[height * 0.035, 0]
				)}px)`,
				opacity: currentOpacity,
				filter: `blur(${currentFilterPixels}px)`,
			}}
		>
			{children}
		</div>
	);
};

export const SubtleSlideOut: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const {durationInFrames, height} = useVideoConfig();
	const frame = useCurrentFrame();

	const currentOpacity = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const currentFilterPixels = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[0, 10],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const currentTranslateY = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[0, -height * 0.035],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div
			style={{
				transform: `translateY(${currentTranslateY}px)`,
				opacity: currentOpacity,
				filter: `blur(${currentFilterPixels}px)`,
			}}
		>
			{children}
		</div>
	);
};
