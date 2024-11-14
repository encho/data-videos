import React from 'react';
import {
	Easing,
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const transitionDuration = 15;

export const SlideIn: React.FC<{children: React.ReactNode}> = ({children}) => {
	const {fps, width} = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = spring({
		fps,
		frame,
		config: {damping: 200},
		durationInFrames: transitionDuration,
	});

	// return (
	// 	<AbsoluteFill
	// 		style={{
	// 			transform: `translateX(${interpolate(spr, [0, 1], [width, 0])}px)`,
	// 		}}
	// 	>
	// 		{children}
	// 	</AbsoluteFill>
	// );

	return (
		<div
			style={{
				transform: `translateX(${interpolate(spr, [0, 1], [width, 0])}px)`,
			}}
		>
			{children}
		</div>
	);
};

export const SlideOut: React.FC<{children: React.ReactNode}> = ({children}) => {
	const {fps, width, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = spring({
		fps,
		frame: frame - (durationInFrames - transitionDuration),
		config: {damping: 200},
		durationInFrames: transitionDuration,
	});

	return (
		<AbsoluteFill
			style={{
				transform: `translateX(${interpolate(spr, [0, 1], [0, -width])}px)`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const OpacifyInAndOut: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const nrEntryFrames = fps * 0.4;
	const nrExitFrames = fps * 0.6;

	const opacity = interpolate(
		frame,
		[
			0,
			nrEntryFrames - 1,
			durationInFrames - nrExitFrames,
			durationInFrames - 1,
		],
		[0, 1, 1, 0],
		{easing: Easing.ease}
	);

	return (
		<div
			style={{
				opacity,
			}}
		>
			{children}
		</div>
	);
};
