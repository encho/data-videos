import React, {ReactNode} from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
} from '../../../Keyframes/Keyframes/keyframes';
import {KeyFramesInspector} from '../../../Keyframes/Keyframes/KeyframesInspector';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {usePage} from '../../../../../acetti-components/PageContext';

export const TextAnimationSubtle: React.FC<{
	children: ReactNode;
	translateY?: number;
	innerDelayInSeconds?: number;
	animateExit?: boolean;
	animateEnter?: boolean;
}> = ({
	children,
	translateY: translateYProp,
	innerDelayInSeconds = 0,
	animateExit = true,
	animateEnter = true,
}) => {
	const frame = useCurrentFrame();
	const {baseline: pageBaseline} = usePage();

	const translateY = translateYProp || pageBaseline * 0.5;

	const {keyframes: keyFramesGroup} = useTextAnimationSubtleKeyframes({
		innerDelayInSeconds,
	});

	const interpolateTextOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[animateEnter ? 0 : 1, 1, 1, animateExit ? 0 : 1],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTextFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[animateEnter ? 10 : 0, 0, 0, animateExit ? 10 : 0],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTextTranslateY = getKeyFramesInterpolator(
		keyFramesGroup,
		['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		[animateEnter ? translateY : 0, 0, 0, 0],
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
	theme: ThemeType;
	innerDelayInSeconds?: number;
}> = ({innerDelayInSeconds = 0, theme}) => {
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
			theme={theme}
		/>
	);
};
