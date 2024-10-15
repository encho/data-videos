import {z} from 'zod';
import React from 'react';
import {
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	AbsoluteFill,
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

export const sequencingCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

// TODO test TestPath feature for example in this lib (try paper.js first)
// https://svgjs.dev/docs/3.1/shape-elements/

export const SequencingComposition: React.FC<
	z.infer<typeof sequencingCompositionSchema>
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
			value: 1,
			id: 'TITLE_ENTER_END',
			relativeId: 'TITLE_ENTER_START',
		},
		{
			type: 'SECOND',
			value: -0,
			id: 'TITLE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -1,
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
		[0, 1, 1, 0]
	);

	const interpolateZoom = getInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[10, 1, 1, 20]
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
			<SlideTitle theme={theme}>Key-Framing</SlideTitle>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 40,
					marginBottom: 60,
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
						Let's start!
					</div>
				</div>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
				<KeyFramesInspector
					keyFramesGroup={keyFramesGroup}
					width={600}
					baseFontSize={20}
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
								width={600}
								baseFontSize={20}
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
							// stroke={'#aaa'}
							stroke={'#f05122'}
							// opacity={0.5}
							strokeWidth={2}
						/>
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

// function getInterpolator<T>(
function getInterpolator(
	keyFramesGroup: TKeyFramesGroup,
	keyFrameIds: string[],
	values: number[]
): (frame: number) => number {
	invariant(keyFrameIds.length === values.length);

	const keyFrames = keyFrameIds.map((id) => getKeyFrame(keyFramesGroup, id));
	const frames = keyFrames.map((it) => it.frame);

	const interpolator = (currentFrame: number) => {
		// TODO add extrapolate... and address varying easings
		return interpolate(currentFrame, frames, values);
	};

	return interpolator;
}

// e.g.
// const interpolator = getInterpolator(keyFramesGroup, ["START_TITLE", "END_TITLE", "START_EXIT", "END_EXIT"], [0,1,1,0])
