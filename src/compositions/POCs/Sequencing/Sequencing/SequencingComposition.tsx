import {z} from 'zod';
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {scaleLinear} from 'd3-scale';

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
		{type: 'GLOBAL_FRAME', value: 0, id: 'TITLE_ENTER_START'},
		{type: 'GLOBAL_FRAME', value: 90, id: 'TITLE_ENTER_END'},
		{type: 'GLOBAL_FRAME', value: 400, id: 'TITLE_EXIT_START'},
		{type: 'GLOBAL_FRAME', value: 899, id: 'TITLE_EXIT_END'},
	]);

	const width = 600;
	const height = 600;

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
					}}
				>
					<div
						style={{color: '#f05122', fontFamily: 'Inter-Bold', fontSize: 80}}
					>
						Let's start!
					</div>
				</div>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
				<KeyFramesGroupViz
					keyFramesGroup={keyFramesGroup}
					width={800}
					baseFontSize={20}
					frame={frame}
				/>
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const KeyFramesGroupViz: React.FC<{
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

	return (
		<div style={{width, height, position: 'relative'}}>
			<div style={{marginBottom: 5}}>
				<div style={{fontSize: 20, color: 'gray'}}>{`frame ${frame}`}</div>
				<div style={{fontSize: 20, color: 'gray'}}>
					{`(fps ${fps}, durationInFrames ${durationInFrames})`}
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
				{/* TODO evtl. use layout engine */}
				{keyFrames.map((keyFrame, i) => {
					return (
						<g transform={`translate(${0}, ${i * HEIGHT_PER_FRAME})`}>
							<rect
								x={0}
								y={0}
								height={HEIGHT_PER_FRAME}
								width={width}
								stroke="rgba(255,255,255,0.2)"
								fill="rgba(255,255,255,0.1)"
							/>

							<circle
								cx={frameToPixel(keyFrame.frame)}
								cy={HEIGHT_PER_FRAME / 2}
								fill={'#777'}
								r={HEIGHT_PER_FRAME * 0.25}
							/>

							<circle
								cx={frameToPixel(keyFrame.frame)}
								cy={HEIGHT_PER_FRAME / 2}
								fill={'#ddd'}
								r={HEIGHT_PER_FRAME * 0.125}
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

				{/* the line for current position */}
				<g>
					<line
						x1={frameToPixel(frame)}
						x2={frameToPixel(frame)}
						y1={0}
						y2={height}
						// stroke={'#aaa'}
						stroke={'#f05122'}
						opacity={0.5}
						strokeWidth={2}
					/>
				</g>
			</svg>
		</div>
	);
};

// ************************************************************************
// Key Frame Spec
// ************************************************************************
type TSeqKeyFrameSpec_GLOBAL_SECOND = {
	type: 'GLOBAL_SECOND';
	value: number;
	id: string;
};
type TSeqKeyFrameSpec_GLOBAL_FRAME = {
	type: 'GLOBAL_FRAME';
	value: number;
	id: string;
};

type TSeqKeyFrameSpec =
	| TSeqKeyFrameSpec_GLOBAL_SECOND
	| TSeqKeyFrameSpec_GLOBAL_FRAME;

// ************************************************************************
// KeyFrames
// ************************************************************************

type TKeyFrame = {
	id: string;
	frame: number;
	spec: TSeqKeyFrameSpec; // TODO rename to TKeyFrameSpec
};

type TKeyFramesGroup = {
	durationInFrames: number;
	fps: number;
	keyFrames: TKeyFrame[];
};

function buildKeyFramesGroup(
	durationInFrames: number,
	fps: number,
	keyFrameSpecs: TSeqKeyFrameSpec[]
): TKeyFramesGroup {
	// TODO check id uniqueness, if not unique raise error!

	const keyFrames = keyFrameSpecs.reduce<TKeyFrame[]>((acc, keyFrameSpec) => {
		let keyFrame: number;
		if (keyFrameSpec.type === 'GLOBAL_SECOND') {
			keyFrame = Math.floor(keyFrameSpec.value * fps); // Convert seconds to frames
		} else if (keyFrameSpec.type === 'GLOBAL_FRAME') {
			keyFrame = keyFrameSpec.value;
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
