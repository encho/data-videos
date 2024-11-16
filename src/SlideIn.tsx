import React from 'react';
import {
	Easing,
	// AbsoluteFill,
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
		<div
			style={{
				transform: `translateX(${interpolate(spr, [0, 1], [0, -width])}px)`,
			}}
		>
			{children}
		</div>
	);
};

export const OpacifyInAndOut: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const nrEntryFrames = fps * 0.8;
	const nrExitFrames = fps * 0.4;

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

	const translateX = interpolate(
		frame,
		[durationInFrames - nrExitFrames, durationInFrames - 1],
		[0, -500],
		{easing: Easing.ease}
	);

	return (
		<div
			style={{
				opacity,
				transform: `translateX(${translateX}px)`,
			}}
		>
			{children}
		</div>
	);
};

export const OpacifyIn: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const nrEntryFrames = fps * 0.8;

	const opacity = interpolate(frame, [0, nrEntryFrames - 1], [0, 1], {
		easing: Easing.ease,
	});

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
