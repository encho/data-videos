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
			[
				`WORD_${i}_ENTER_START`,
				`WORD_${i}_ENTER_END`,
				`WORD_${i}_EXIT_START`,
				`WORD_${i}_EXIT_END`,
			],
			[animateEnter ? translateY : 0, 0, 0, 0],
			[Easing.ease, Easing.ease, Easing.ease]
		);

		const getOpacity = getKeyFramesInterpolator(
			keyFramesGroup,
			[
				`WORD_${i}_ENTER_START`,
				`WORD_${i}_ENTER_END`,
				`WORD_${i}_EXIT_START`,
				`WORD_${i}_EXIT_END`,
			],
			[animateEnter ? 0 : 1, 1, 1, animateExit ? 0 : 1],
			[Easing.ease, Easing.ease, Easing.ease]
		);

		const getFilterPixels = getKeyFramesInterpolator(
			keyFramesGroup,
			[
				`WORD_${i}_ENTER_START`,
				`WORD_${i}_ENTER_END`,
				`WORD_${i}_EXIT_START`,
				`WORD_${i}_EXIT_END`,
			],
			[animateEnter ? 10 : 0, 0, 0, animateExit ? 10 : 0],
			[Easing.ease, Easing.ease, Easing.ease]
		);

		return {getTranslateY, getOpacity, getFilterPixels};
	});

	return (
		<div>
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

	const WORD_APPEAR_DURATION_IN_SECONDS = 0.4;
	const WORD_APPEAR_DELAY_IN_SECONDS = 0.2;
	const WORD_DISAPPEAR_DURATION_IN_SECONDS = 0.4;
	const WORD_DISAPPEAR_DELAY_IN_SECONDS = 0.2;

	const keyframes = useMemo(() => {
		const enterKeyframeSpecs = words
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
							value: WORD_APPEAR_DURATION_IN_SECONDS,
							id: 'WORD_0_ENTER_END',
							relativeId: 'WORD_0_ENTER_START',
						},
					];
				}

				return [
					{
						type: 'R_SECOND',
						value: WORD_APPEAR_DELAY_IN_SECONDS,
						id: `WORD_${i}_ENTER_START`,
						relativeId: `WORD_${i - 1}_ENTER_START`,
					},
					{
						type: 'R_SECOND',
						value: WORD_APPEAR_DURATION_IN_SECONDS,
						id: `WORD_${i}_ENTER_END`,
						relativeId: `WORD_${i}_ENTER_START`,
					},
				];
			})
			.flat();

		const exitKeyframeSpecs = [...words]
			.reverse()
			.map<TKeyFrameSpec[]>((word, i) => {
				const indexInOriginalSorting = words.length - 1 - i;

				if (i === 0) {
					return [
						{
							type: 'SECOND',
							value: -0,
							id: `WORD_${indexInOriginalSorting}_EXIT_END`,
						},
						{
							type: 'R_SECOND',
							value: -WORD_DISAPPEAR_DURATION_IN_SECONDS,
							id: `WORD_${indexInOriginalSorting}_EXIT_START`,
							relativeId: `WORD_${indexInOriginalSorting}_EXIT_END`,
						},
					];
				}

				return [
					{
						type: 'R_SECOND',
						value: -WORD_DISAPPEAR_DELAY_IN_SECONDS,
						id: `WORD_${indexInOriginalSorting}_EXIT_END`,
						relativeId: `WORD_${indexInOriginalSorting + 1}_EXIT_END`,
					},
					{
						type: 'R_SECOND',
						value: -WORD_DISAPPEAR_DELAY_IN_SECONDS,
						id: `WORD_${indexInOriginalSorting}_EXIT_START`,
						relativeId: `WORD_${indexInOriginalSorting + 1}_EXIT_START`,
					},
				];
			})
			.flat();

		return buildKeyFramesGroup(durationInFrames, fps, [
			...enterKeyframeSpecs,
			...exitKeyframeSpecs,
		]);
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
