import React from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
} from '../../../Keyframes/Keyframes/keyframes';
import {KeyFramesInspector} from '../../../Keyframes/Keyframes/KeyframesInspector';

export const TextAnimationSubtle: React.FC<{
	children: string;
	translateY: number;
	innerDelayInSeconds?: number;
}> = ({children, translateY, innerDelayInSeconds = 0}) => {
	// const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const {keyframes: keyFramesGroup} = useTextAnimationSubtleKeyframes({
		innerDelayInSeconds,
	});

	const interpolateTextOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[0, 1, 1, 0],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTextFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[10, 0, 0, 10],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTextTranslateY = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[translateY, 0, 0, 0],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const titleOpacity = interpolateTextOpacity(frame);
	const titleFilterPixels = interpolateTextFilterPixels(frame);
	const titleTranslateY = interpolateTextTranslateY(frame);

	return (
		<div
			style={{
				opacity: titleOpacity,
				filter: `blur(${titleFilterPixels}px)`,
				transform: `translateY(${titleTranslateY}px)`,
			}}
		>
			{children}
		</div>
	);
};

export function useTextAnimationSubtleKeyframes({
	innerDelayInSeconds = 0,
}: {
	innerDelayInSeconds?: number;
}) {
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		// the title...
		{type: 'SECOND', value: innerDelayInSeconds, id: 'TEXT_ENTER_START'},
		{
			type: 'R_SECOND',
			value: 0.6,
			id: 'TEXT_ENTER_END',
			relativeId: 'TEXT_ENTER_START',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'TEXT_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -0.6,
			id: 'TEXT_EXIT_START',
			relativeId: 'TEXT_EXIT_END',
		},
	]);

	// TODO perhaps also return interpolators..
	return {keyframes};
}

export const TextAnimationSubtleKeyframes: React.FC<{
	// theme: ThemeType;
	innerDelayInSeconds?: number;
}> = ({innerDelayInSeconds = 0}) => {
	const frame = useCurrentFrame();
	const {keyframes: keyFramesGroup} = useTextAnimationSubtleKeyframes({
		innerDelayInSeconds,
	});

	return (
		<KeyFramesInspector
			keyFramesGroup={keyFramesGroup}
			width={700}
			baseFontSize={18}
			frame={frame}
		/>
	);
};
