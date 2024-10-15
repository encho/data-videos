import {z} from 'zod';
import React from 'react';
import {
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	AbsoluteFill,
	EasingFunction,
} from 'remotion';
import {scaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';
import chroma from 'chroma-js';

import {Position} from '../../../../acetti-ts-base/Position';
import {ObliquePlatte} from '../../../../acetti-components/ObliquePlatte';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';

export const keyframesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

// TODO test TestPath feature for example in this lib (try paper.js first)
// https://svgjs.dev/docs/3.1/shape-elements/

export const KeyframesComposition: React.FC<
	z.infer<typeof keyframesCompositionSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader([
		'Inter-Regular',
		'Inter-Bold',
		'SourceSerifPro-Light',
	]);

	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const theme = getThemeFromEnum(themeEnum as any);

	const keyFramesGroup = buildKeyFramesGroup(durationInFrames, fps, [
		{type: 'SECOND', value: 1, id: 'TITLE_ENTER_START'},
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'TITLE_ENTER_END',
			relativeId: 'TITLE_ENTER_START',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'TITLE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: 'TITLE_EXIT_START',
			relativeId: 'TITLE_EXIT_END',
		},
	]);

	const width = 600;
	const height = 600;

	const interpolateTitleOpacity = getInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[0, 1, 1, 0],
		[Easing.bounce, Easing.bounce, Easing.bounce]
	);

	const interpolateZoom = getInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[10, 1, 1, 20],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const titleOpacity = interpolateTitleOpacity(frame);
	const zoom = interpolateZoom(frame);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Keyframe-Transitions</SlideTitle>

			{/* <div>
				<div style={{fontSize: 30, color: 'white'}}>
					titleOpacity: {titleOpacity}
				</div>
				<div style={{fontSize: 30, color: 'white'}}>zoom: {zoom}</div>
			</div> */}

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 0,
					marginBottom: 70,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width,
						height,
						backgroundColor: '#222',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							transform: `scale(${zoom})`,
							color: '#f05122',
							fontFamily: 'Inter-Bold',
							fontSize: 80,
							opacity: titleOpacity,
						}}
					>
						Halloween
					</div>
				</div>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
				<KeyFramesInspector
					keyFramesGroup={keyFramesGroup}
					width={700}
					baseFontSize={18}
					frame={frame}
				/>
			</div>

			{/* <AbsoluteFill>
				<Position position={{left: 150, top: 900}}>
					<ObliquePlatte width={800} height={400} theme={theme.platte}>
						<div
							style={{display: 'flex', justifyContent: 'center', marginTop: 40}}
						>
							<KeyFramesInspector
								keyFramesGroup={keyFramesGroup}
								width={500}
								baseFontSize={16}
								frame={frame}
							/>
						</div>
					</ObliquePlatte>
				</Position>
			</AbsoluteFill> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const KeyFramesInspector: React.FC<{
	keyFramesGroup: TKeyFramesGroup;
	frame: number;
	width: number;
	baseFontSize: number;
}> = ({keyFramesGroup, width, baseFontSize, frame}) => {
	const {durationInFrames, fps, keyFrames} = keyFramesGroup;

	const HEIGHT_PER_FRAME = baseFontSize * 1.5;
	const X_AXIS_HEIGHT = 50;

	const height = keyFrames.length * HEIGHT_PER_FRAME + X_AXIS_HEIGHT;

	const frameToPixel = scaleLinear()
		.domain([0, durationInFrames - 1])
		.range([0, width]);

	const ticks = frameToPixel.ticks();

	const secondToPixel = scaleLinear()
		.domain([0, durationInFrames / fps])
		.range([0, width]);

	const secondsTicks = secondToPixel.ticks();

	return (
		<div style={{width, height, position: 'relative'}}>
			<div style={{marginBottom: 10}}>
				<div style={{fontSize: 26, color: '#555', fontFamily: 'Inter-Bold'}}>
					Key-Frames Inspector
				</div>
			</div>
			<svg
				width={width}
				height={height}
				style={{
					overflow: 'visible',
					display: 'inline-block',
				}}
			>
				{/* The x axis */}
				<g
					transform={`translate(${0}, ${
						keyFrames.length * HEIGHT_PER_FRAME + 10
					})`}
				>
					{/* <rect
						x={0}
						y={0}
						height={X_AXIS_HEIGHT}
						width={width}
						stroke="rgba(255,0,0,1)"
						fill="rgba(255,0,0,0.2)"
					/> */}

					<line
						x1={frameToPixel(0)}
						x2={frameToPixel(durationInFrames - 1)}
						y1={0}
						y2={0}
						stroke={'#999'}
						strokeWidth={2}
					/>
					{ticks.map((tick, i) => {
						return (
							<g>
								<line
									x1={frameToPixel(tick)}
									x2={frameToPixel(tick)}
									y1={0}
									y2={20}
									stroke={'#999'}
									strokeWidth={2}
								/>

								<text
									fill={'#999'}
									fontSize={baseFontSize}
									y={20 + 5}
									x={frameToPixel(tick)}
									textAnchor="middle"
									dominantBaseline="hanging"
									fontFamily="Inter-Regular"
									dy=".1em"
								>
									{tick}
								</text>
							</g>
						);
					})}
				</g>

				{/* The seconds axis */}
				<g
					transform={`translate(${0}, ${
						keyFrames.length * HEIGHT_PER_FRAME + 10 + 80
					})`}
				>
					{/* <rect
						x={0}
						y={0}
						height={X_AXIS_HEIGHT}
						width={width}
						stroke="rgba(255,0,0,1)"
						fill="rgba(255,0,0,0.2)"
					/> */}

					<line
						x1={secondToPixel(0)}
						x2={secondToPixel(durationInFrames / fps)}
						y1={0}
						y2={0}
						stroke={'#999'}
						strokeWidth={2}
					/>
					{secondsTicks.map((tick, i) => {
						return (
							<g>
								<line
									x1={secondToPixel(tick)}
									x2={secondToPixel(tick)}
									y1={0}
									y2={20}
									stroke={'#999'}
									strokeWidth={2}
								/>

								<text
									fill={'#999'}
									fontSize={baseFontSize}
									y={20 + 5}
									x={secondToPixel(tick)}
									textAnchor="middle"
									dominantBaseline="hanging"
									fontFamily="Inter-Regular"
									dy=".1em"
								>
									{tick}
								</text>
							</g>
						);
					})}
				</g>

				<g>
					{/* the line for current position */}
					<g>
						<line
							x1={frameToPixel(frame)}
							x2={frameToPixel(frame)}
							y1={0}
							y2={height + 100}
							stroke={'#f05122'}
							strokeWidth={2}
						/>
						<circle
							cx={frameToPixel(frame)}
							cy={height + 100}
							fill={'#f05122'}
							r={4}
						/>
						<circle cx={frameToPixel(frame)} cy={0} fill={'#f05122'} r={4} />
					</g>

					{/* The x axis current frame flag */}
					<g
						transform={`translate(${0}, ${
							keyFrames.length * HEIGHT_PER_FRAME + 10
						})`}
					>
						<rect
							x={secondToPixel(frame / fps) - 35}
							y={20}
							height={baseFontSize + 10}
							width={35 * 2}
							fill="#f05122"
							rx={3}
							ry={3}
						/>
						<text
							fill={'#000'}
							fontSize={baseFontSize}
							// y={height + 5}
							y={20 + 5}
							x={frameToPixel(frame)}
							textAnchor="middle"
							dominantBaseline="hanging"
							fontFamily="Inter-Bold"
							dy=".1em"
						>
							{frame}
						</text>
					</g>

					{/* The seconds axis current frame flag*/}
					<g
						transform={`translate(${0}, ${
							keyFrames.length * HEIGHT_PER_FRAME + 10 + 80
						})`}
					>
						<rect
							x={secondToPixel(frame / fps) - 35}
							y={20}
							height={baseFontSize + 10}
							width={35 * 2}
							fill="#f05122"
							rx={3}
							ry={3}
						/>

						<text
							fill={'#000'}
							fontSize={baseFontSize}
							y={20 + 5}
							x={secondToPixel(frame / fps)}
							textAnchor="middle"
							dominantBaseline="hanging"
							fontFamily="Inter-Bold"
							dy=".1em"
						>
							{formatNumberToSeconds(frame / fps)}
						</text>
					</g>
				</g>

				{/* TODO evtl. use layout engine */}
				{keyFrames.map((keyFrame, i) => {
					const rgbaColor1 = chroma('#f05122').brighten(0.5).alpha(0.3).css();
					const rgbaColor2 = chroma('#f05122').brighten(0.5).alpha(1).css();

					const bigCircleFill =
						keyFrame.frame === frame ? rgbaColor1 : 'rgba(255,255,255,0.25)';
					const smallCircleFill =
						keyFrame.frame === frame ? rgbaColor2 : 'rgba(255,255,255,1)';

					const bigCircleRadius = keyFrame.frame === frame ? 0.35 : 0.25;
					const smallCircleRadius = keyFrame.frame === frame ? 0.2 : 0.125;

					let anchorFrame;
					if (
						keyFrame.spec.type === 'FRAME' &&
						getSign(keyFrame.spec.value) === 1
					) {
						anchorFrame = 0;
					} else if (
						keyFrame.spec.type === 'FRAME' &&
						getSign(keyFrame.spec.value) === -1
					) {
						anchorFrame = durationInFrames - 1;
					} else if (
						keyFrame.spec.type === 'SECOND' &&
						getSign(keyFrame.spec.value) === 1
					) {
						anchorFrame = 0;
					} else if (
						keyFrame.spec.type === 'SECOND' &&
						getSign(keyFrame.spec.value) === -1
					) {
						anchorFrame = durationInFrames - 1;
					} else if (
						keyFrame.spec.type === 'R_FRAME' ||
						keyFrame.spec.type === 'R_SECOND'
					) {
						anchorFrame = getKeyFrame(
							keyFramesGroup,
							keyFrame.spec.relativeId
						).frame;
					} else {
						throw Error('error determining anchorFrame!');
					}

					return (
						<g transform={`translate(${0}, ${i * HEIGHT_PER_FRAME})`}>
							<rect
								x={0}
								y={0}
								height={HEIGHT_PER_FRAME}
								width={width}
								stroke="rgba(255,255,255,0.2)"
								fill="transparent"
							/>

							{/* display frame anchor point */}
							<g>
								<line
									x1={frameToPixel(anchorFrame)}
									x2={frameToPixel(keyFrame.frame)}
									y1={HEIGHT_PER_FRAME / 2}
									y2={HEIGHT_PER_FRAME / 2}
									stroke={'cyan'}
									opacity={0.75}
									strokeWidth={1}
								/>
								<line
									x1={frameToPixel(anchorFrame)}
									x2={frameToPixel(anchorFrame)}
									y1={20}
									y2={HEIGHT_PER_FRAME - 20}
									// y1={0}
									// y2={HEIGHT_PER_FRAME}
									stroke={'cyan'}
									opacity={0.75}
									strokeWidth={1}
								/>
							</g>

							<circle
								cx={frameToPixel(keyFrame.frame)}
								cy={HEIGHT_PER_FRAME / 2}
								r={HEIGHT_PER_FRAME * bigCircleRadius}
								fill={bigCircleFill}
							/>

							<circle
								cx={frameToPixel(keyFrame.frame)}
								cy={HEIGHT_PER_FRAME / 2}
								fill={smallCircleFill}
								r={HEIGHT_PER_FRAME * smallCircleRadius}
							/>

							<text
								fill={'#bbb'}
								fontSize={baseFontSize}
								y={HEIGHT_PER_FRAME / 2}
								x={frameToPixel(keyFrame.frame) + 15}
								dominantBaseline="middle"
								fontFamily="Inter-Regular"
								dy=".1em"
							>
								{keyFrame.id}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
};

function formatNumberToSeconds(value: number): string {
	// Round the number to one decimal place
	const roundedValue = value.toFixed(1);
	// Append "s" to the rounded value
	return `${roundedValue}s`;
}
// Example usage
// const formatted = formatNumberToSeconds(3.774432);
// console.log(formatted); // Output: "3.7s"

// ************************************************************************
// Key Frame Spec
// ************************************************************************
type TKeyFrameSpec_SECOND = {
	type: 'SECOND';
	value: number;
	id: string;
};
type TKeyFrameSpec_FRAME = {
	type: 'FRAME';
	value: number;
	id: string;
};

type TKeyFrameSpec_R_SECOND = {
	type: 'R_SECOND';
	value: number;
	id: string;
	relativeId: string;
};

type TKeyFrameSpec_R_FRAME = {
	type: 'R_FRAME';
	value: number;
	id: string;
	relativeId: string;
};

type TKeyFrameSpec =
	| TKeyFrameSpec_SECOND
	| TKeyFrameSpec_R_SECOND
	| TKeyFrameSpec_FRAME
	| TKeyFrameSpec_R_FRAME;

// ************************************************************************
// KeyFrames
// ************************************************************************

type TKeyFrame = {
	id: string;
	frame: number;
	spec: TKeyFrameSpec;
};

type TKeyFramesGroup = {
	durationInFrames: number;
	fps: number;
	keyFrames: TKeyFrame[];
};

function getSign(value: number): number {
	if (Object.is(value, -0)) {
		return -1; // Return -1 for -0
	} else if (Object.is(value, 0)) {
		return 1; // Return +1 for +0
	} else {
		return Math.sign(value); // Use Math.sign for other numbers
	}
}
// Examples
// console.log(getSign(-0));   // Output: -1
// console.log(getSign(0));    // Output: 1
// console.log(getSign(-5));   // Output: -1
// console.log(getSign(5));    // Output: 1

function buildKeyFramesGroup(
	durationInFrames: number,
	fps: number,
	keyFrameSpecs: TKeyFrameSpec[]
): TKeyFramesGroup {
	// TODO check id uniqueness, if not unique raise error!

	const keyFrames = keyFrameSpecs.reduce<TKeyFrame[]>((acc, keyFrameSpec) => {
		let keyFrame: number;
		if (keyFrameSpec.type === 'SECOND') {
			if (getSign(keyFrameSpec.value) === 1) {
				keyFrame = Math.floor(keyFrameSpec.value * (fps - 1)); // Convert seconds to frames
			} else {
				keyFrame = durationInFrames - 1 + keyFrameSpec.value * fps;
			}
		} else if (keyFrameSpec.type === 'FRAME') {
			if (getSign(keyFrameSpec.value) === 1) {
				keyFrame = keyFrameSpec.value;
			} else {
				// if the value is negative -0 --> last frame, -1 --> vorletzte frame, etc....
				keyFrame = durationInFrames - 1 + keyFrameSpec.value;
			}
		} else if (keyFrameSpec.type === 'R_FRAME') {
			const relativeKeyFrameObject = acc.find(
				(currentKeyFrame) => currentKeyFrame.id === keyFrameSpec.relativeId
			);
			if (!relativeKeyFrameObject) {
				throw new Error(
					`Unknown relative keyframe id ${keyFrameSpec.relativeId}`
				);
			}
			keyFrame = relativeKeyFrameObject.frame + keyFrameSpec.value;
		} else if (keyFrameSpec.type === 'R_SECOND') {
			const relativeKeyFrameObject = acc.find(
				(currentKeyFrame) => currentKeyFrame.id === keyFrameSpec.relativeId
			);
			if (!relativeKeyFrameObject) {
				throw new Error(
					`Unknown relative keyframe id ${keyFrameSpec.relativeId}`
				);
			}
			keyFrame = relativeKeyFrameObject.frame + keyFrameSpec.value * fps;
		} else {
			throw new Error(`Unknown keyFrame type`);
		}

		// Add the new TSeq to the accumulator
		acc.push({
			id: keyFrameSpec.id,
			frame: keyFrame,
			spec: keyFrameSpec,
		});

		return acc;
	}, []);

	return {durationInFrames, fps, keyFrames};
}

function getKeyFrame(
	keyFramesGroup: TKeyFramesGroup,
	keyFrameId: string
): TKeyFrame {
	const foundKeyFrame = keyFramesGroup.keyFrames.find(
		(it) => it.id === keyFrameId
	);
	if (!foundKeyFrame) {
		throw Error(`Could not find keyFrame with id: ${keyFrameId}`);
	}

	return foundKeyFrame;
}

function getInterpolator(
	keyFramesGroup: TKeyFramesGroup,
	keyFrameIds: string[],
	values: number[],
	easings: EasingFunction[] = [Easing.ease, Easing.ease, Easing.bounce]
): (frame: number) => number {
	invariant(keyFrameIds.length === values.length);
	invariant(
		keyFrameIds.length === easings.length + 1,
		`easings are not of supported length. please pass an array of easings with one easing per transition (in this specific case ${
			keyFrameIds.length - 1
		}, while you passed ${easings.length})`
	);

	const keyFrames = keyFrameIds.map((id) => getKeyFrame(keyFramesGroup, id));
	const frames = keyFrames.map((it) => it.frame);

	return (frame) => {
		const currentTransitionIndex = getActiveTransitionIndex(frames, frame);

		const currentStartFrame = frames[currentTransitionIndex];
		const currentEndFrame = frames[currentTransitionIndex + 1];

		const currentStartValue = values[currentTransitionIndex];
		const currentEndValue = values[currentTransitionIndex + 1];

		const currentEasing = easings[currentTransitionIndex];

		return interpolate(
			frame,
			[currentStartFrame, currentEndFrame],
			[currentStartValue, currentEndValue],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
				easing: currentEasing,
			}
		);
	};
}
// e.g.
// const interpolator = getInterpolator(keyFramesGroup, ["START_TITLE", "END_TITLE", "START_EXIT", "END_EXIT"], [0,1,1,0])
function getActiveTransitionIndex(
	keyframes: number[],
	currentFrame: number
): number {
	// If the current frame is smaller than the first keyframe, return 0
	if (currentFrame < keyframes[0]) {
		return 0;
	}

	// If the current frame is larger than the last keyframe, return the last index
	if (currentFrame >= keyframes[keyframes.length - 1]) {
		return keyframes.length - 2; // Last transition's index is length - 2
	}

	// Iterate through the keyframes array
	for (let i = 0; i < keyframes.length - 1; i++) {
		// Check if the current frame is within the range of two consecutive keyframes
		if (currentFrame >= keyframes[i] && currentFrame < keyframes[i + 1]) {
			return i;
		}
	}

	return 0; // Default case, though this should never be reached
}
// // Example usage:
// const keyframes = [0, 100, 200, 500];
// // Test cases
// console.log(getActiveTransitionIndex(keyframes, 220));  // Output: 2
// console.log(getActiveTransitionIndex(keyframes, 100));  // Output: 1
// console.log(getActiveTransitionIndex(keyframes, 50));   // Output: 0 (smaller than first keyframe)
// console.log(getActiveTransitionIndex(keyframes, 600));  // Output: 2 (larger than last keyframe)
