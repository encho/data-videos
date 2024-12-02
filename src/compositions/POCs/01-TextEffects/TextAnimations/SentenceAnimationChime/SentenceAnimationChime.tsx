import React, {useMemo, Fragment} from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import invariant from 'tiny-invariant';

import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
	TKeyFrameSpec,
} from '../../../Keyframes/Keyframes/keyframes';
import {KeyFramesInspector} from '../../../Keyframes/Keyframes/KeyframesInspector';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {usePage} from '../../../../../acetti-components/PageContext';

export const SentenceAnimationChime: React.FC<{
	children: string;
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

	const words = children.split(' ');

	const {keyframes: keyFramesGroup} = useKeyframes({
		innerDelayInSeconds,
		words,
	});

	// TODO useMemo
	// const wordInterpolators = words.map((word, i) => {
	const wordInterpolators = words.map((word, i) => {
		const getTranslateY = getKeyFramesInterpolator(
			keyFramesGroup,
			[`WORD_${i}_ENTER_START`, `WORD_${i}_ENTER_END`],
			[animateEnter ? translateY : 0, 0],
			[Easing.ease]
			// [animateEnter ? translateY : 0, 0, 0, 0],
			// ['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
			// [animateEnter ? translateY : 0, 0, 0, 0],
			// [Easing.ease, Easing.ease, Easing.ease]
		);

		const getOpacity = getKeyFramesInterpolator(
			keyFramesGroup,
			[`WORD_${i}_ENTER_START`, `WORD_${i}_ENTER_END`],
			[animateEnter ? 0 : 1, 1],
			[Easing.ease]
			// [animateEnter ? translateY : 0, 0, 0, 0],
			// ['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
			// [animateEnter ? translateY : 0, 0, 0, 0],
			// [Easing.ease, Easing.ease, Easing.ease]
		);

		const getFilterPixels = getKeyFramesInterpolator(
			keyFramesGroup,
			[`WORD_${i}_ENTER_START`, `WORD_${i}_ENTER_END`],
			[animateEnter ? 10 : 0, 0],
			[Easing.ease]
		);

		// const interpolateTextFilterPixels = getKeyFramesInterpolator(
		// 	keyFramesGroup,
		// 	['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
		// 	[animateEnter ? 10 : 0, 0, 0, animateExit ? 10 : 0],
		// 	[Easing.ease, Easing.ease, Easing.ease]
		// );

		return {getTranslateY, getOpacity, getFilterPixels};
	});

	return (
		<div
			style={{
				backgroundColor: 'gray',
			}}
		>
			{words.map((word, i) => {
				return (
					<Fragment key={`word-${word}-${i}`}>
						<span
							style={{
								display: 'inline-block',
								transform: `translateY(${wordInterpolators[i].getTranslateY(
									frame
								)}px)`,
								opacity: wordInterpolators[i].getOpacity(frame),
								filter: `blur(${wordInterpolators[i].getFilterPixels(
									frame
								)}px)`,
							}}
						>
							{word}
						</span>
						{i < words.length - 1 ? (
							<span key={`whitespace-${i}`}> </span>
						) : null}
					</Fragment>
				);
			})}
		</div>
	);

	// const interpolateTextOpacity = getKeyFramesInterpolator(
	// 	keyFramesGroup,
	// 	['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
	// 	[animateEnter ? 0 : 1, 1, 1, animateExit ? 0 : 1],
	// 	[Easing.ease, Easing.ease, Easing.ease]
	// );

	// const interpolateTextFilterPixels = getKeyFramesInterpolator(
	// 	keyFramesGroup,
	// 	['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
	// 	[animateEnter ? 10 : 0, 0, 0, animateExit ? 10 : 0],
	// 	[Easing.ease, Easing.ease, Easing.ease]
	// );

	// const interpolateTextTranslateY = getKeyFramesInterpolator(
	// 	keyFramesGroup,
	// 	['TEXT_ENTER_START', 'TEXT_ENTER_END', 'TEXT_EXIT_START', 'TEXT_EXIT_END'],
	// 	[animateEnter ? translateY : 0, 0, 0, 0],
	// 	[Easing.ease, Easing.ease, Easing.ease]
	// );

	// const titleOpacity = interpolateTextOpacity(frame);
	// const titleFilterPixels = interpolateTextFilterPixels(frame);
	// const titleTranslateY = interpolateTextTranslateY(frame);

	// return (
	// 	<div
	// 		style={{
	// 			opacity: titleOpacity,
	// 			filter: `blur(${titleFilterPixels}px)`,
	// 			transform: `translateY(${titleTranslateY}px)`,
	// 		}}
	// 	>
	// 		{children}
	// 	</div>
	// );
};

function useKeyframes({
	innerDelayInSeconds = 0,
	words,
}: {
	innerDelayInSeconds?: number;
	words: string[];
}) {
	invariant(
		words.length > 0,
		'SentenceAnimationChime.useKeyframes: words array has to be longer than 0'
	);
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = useMemo(() => {
		const keyframeSpecs = words
			.map<TKeyFrameSpec[]>((_word, i) => {
				if (i === 0) {
					return [
						{
							type: 'SECOND',
							value: innerDelayInSeconds,
							id: 'WORD_0_ENTER_START',
						},
						{
							type: 'R_SECOND',
							value: 0.6, // TODO variable wordEnterDurationInSeconds
							id: 'WORD_0_ENTER_END',
							relativeId: 'WORD_0_ENTER_START',
						},
					];
				}

				return [
					{
						type: 'R_SECOND',
						value: 0.4, // TODO variable wordDelayInSeconds
						id: `WORD_${i}_ENTER_START`,
						relativeId: `WORD_${i - 1}_ENTER_START`,
					},
					{
						type: 'R_SECOND',
						value: 0.6, // TODO variable wordEnterDurationInSeconds
						id: `WORD_${i}_ENTER_END`,
						relativeId: `WORD_${i}_ENTER_START`,
					},
				];
			})
			.flat();

		return buildKeyFramesGroup(durationInFrames, fps, keyframeSpecs);
	}, [durationInFrames, fps, innerDelayInSeconds, words]);

	return {keyframes};
}

export const SentenceAnimationChimeKeyframes: React.FC<{
	theme: ThemeType;
	innerDelayInSeconds?: number;
	sentence: string;
}> = ({innerDelayInSeconds = 0, theme, sentence}) => {
	const frame = useCurrentFrame();

	const words = sentence.split(' ');

	const {keyframes: keyFramesGroup} = useKeyframes({
		innerDelayInSeconds,
		words,
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
