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
import {LoDashExplicitNumberArrayWrapper} from 'lodash';

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

	const seqMachine = buildSeqMachine({
		fps,
		durationInFrames,
		seqs: [
			{
				id: 'TITLE_ENTER',
				keyFrame: {type: 'GLOBAL_FRAME', value: 0, id: 'hehehe'},
				duration: {type: 'FRAMES', value: 180},
			},
			{
				id: 'TITLE_EXIT',
				keyFrame: {type: 'GLOBAL_FRAME', value: 800, id: 'hohoho'},
				duration: {type: 'FRAMES', value: 100},
			},
			{
				id: 'ZOOM_ENTER',
				keyFrame: {type: 'GLOBAL_SECOND', value: 1, id: 'heheheheheeheh'},
				duration: {type: 'SECONDS', value: 8},
			},
		],
	});

	const liveSeqMachine = buildLiveSeqMachine(seqMachine, frame);

	const keyFramesGroup = buildKeyFramesGroup(durationInFrames, fps, [
		{type: 'GLOBAL_FRAME', value: 0, id: '001'},
		{type: 'GLOBAL_FRAME', value: 90, id: '002'},
		{type: 'GLOBAL_FRAME', value: 400, id: '003'},
	]);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Sequencing</SlideTitle>
			<div style={{fontSize: 30, color: 'gray'}}>
				{`frame ${frame}, fps ${fps}, durationInFrames ${durationInFrames}`}
			</div>

			{/* here, we set the size in pixels (width, height) */}
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<SeqMachineViz
					liveSeqMachine={liveSeqMachine}
					width={800}
					baseFontSize={20}
				/>
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

export const SeqMachineViz: React.FC<{
	liveSeqMachine: TLiveSeqMachine;
	// frame: number;
	width: number;
	baseFontSize: number;
}> = ({liveSeqMachine, width, baseFontSize}) => {
	const {durationInFrames, fps, liveSeqs, frame} = liveSeqMachine;

	const HEIGHT_PER_SEQ = 50;
	const X_AXIS_HEIGHT = 50;

	const height = liveSeqs.length * HEIGHT_PER_SEQ + X_AXIS_HEIGHT;

	const frameToPixel = scaleLinear()
		.domain([0, durationInFrames - 1]) // Domain: [0, durationInFrames - 1]
		.range([0, width]); // Range: [0, width]

	return (
		<div style={{width, height, position: 'relative'}}>
			<svg
				width={width}
				height={height}
				style={{
					overflow: 'visible',
					display: 'inline-block',
				}}
			>
				{/* TODO evtl. use layout engine */}
				{liveSeqs.map((seq, i) => {
					// TODO has to be used by TLiveSeq creation function..., s.t. it can be used also by interpolators, not just ui component!
					const isActive = frame >= seq.startFrame && frame <= seq.endFrame;
					const relativeFrame = frame - seq.startFrame;
					const currentPercentage = interpolate(
						frame,
						[seq.startFrame, seq.endFrame],
						[0, 1],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
					);

					return (
						<g>
							<rect
								x={0}
								y={i * HEIGHT_PER_SEQ}
								height={HEIGHT_PER_SEQ}
								width={width}
								stroke="rgba(255,255,255,0.3)"
								fill="rgba(255,255,255,0.12)"
							/>
							<rect
								x={frameToPixel(seq.startFrame)}
								y={i * HEIGHT_PER_SEQ}
								height={HEIGHT_PER_SEQ}
								width={frameToPixel(seq.durationInFrames)}
								stroke="rgba(255,255,0,1)"
								fill={isActive ? 'rgba(255,255,0,0.4)' : 'rgba(255,255,0,0.1)'}
							/>
							<text
								fill={'orange'}
								fontSize={baseFontSize}
								y={i * HEIGHT_PER_SEQ + baseFontSize}
							>
								{seq.id} {relativeFrame}/{seq.durationInFrames} (
								{formatToPercentage(currentPercentage)})
							</text>
						</g>
					);
				})}

				{/* The x axis */}
				<g transform={`translate(${0}, ${liveSeqs.length * HEIGHT_PER_SEQ})`}>
					<rect
						x={0}
						y={0}
						height={X_AXIS_HEIGHT}
						width={width}
						stroke="rgba(255,0,0,1)"
						fill="rgba(255,0,0,0.2)"
					/>
				</g>

				{/* the line for current position */}
				<g>
					<line
						x1={frameToPixel(frame)}
						x2={frameToPixel(frame)}
						y1={0}
						y2={height}
						stroke={'#ddd'}
						strokeWidth={2}
					/>
				</g>
			</svg>
		</div>
	);
};

function formatToPercentage(value: number): string {
	// Convert the number to percentage and format to 2 decimal places
	return (value * 100).toFixed(2) + '%';
}

export const KeyFramesGroupViz: React.FC<{
	// liveSeqMachine: TLiveSeqMachine;
	keyFramesGroup: TKeyFramesGroup;
	frame: number;
	width: number;
	baseFontSize: number;
}> = ({keyFramesGroup, width, baseFontSize, frame}) => {
	const {durationInFrames, fps, keyFrames} = keyFramesGroup;

	// const HEIGHT_PER_SEQ = 50;
	const X_AXIS_HEIGHT = 50;

	// const height = liveSeqs.length * HEIGHT_PER_SEQ + X_AXIS_HEIGHT;
	const height = X_AXIS_HEIGHT;

	const frameToPixel = scaleLinear()
		.domain([0, durationInFrames - 1]) // Domain: [0, durationInFrames - 1]
		.range([0, width]); // Range: [0, width]

	return (
		<div style={{width, height, position: 'relative'}}>
			<svg
				width={width}
				height={height}
				style={{
					overflow: 'visible',
					display: 'inline-block',
					backgroundColor: '#444',
				}}
			>
				{/* TODO evtl. use layout engine */}
				{keyFrames.map((keyFrame, i) => {
					return (
						<g>
							<circle
								cx={frameToPixel(keyFrame.frame)}
								cy={10}
								fill={'yellow'}
								r={5}
							/>
						</g>
					);
				})}

				{/* The x axis */}
				{/* <g transform={`translate(${0}, ${liveSeqs.length * HEIGHT_PER_SEQ})`}> */}
				{/* <g transform={`translate(${0}, ${50})`}>
					<rect
						x={0}
						y={0}
						height={X_AXIS_HEIGHT}
						width={width}
						stroke="rgba(255,0,0,1)"
						fill="rgba(255,0,0,0.2)"
					/>
				</g> */}

				{/* the line for current position */}
				<g>
					<line
						x1={frameToPixel(frame)}
						x2={frameToPixel(frame)}
						y1={0}
						y2={height}
						stroke={'#ddd'}
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

// ************************************************************************
//  Seq Duration Spec
// ************************************************************************

type TSeqDurationSpec_SECONDS = {type: 'SECONDS'; value: number};
type TSeqDurationSpec_FRAMES = {type: 'FRAMES'; value: number};

type TSeqDurationSpec = TSeqDurationSpec_SECONDS | TSeqDurationSpec_FRAMES;

type TSeqSpec = {
	id: string;
	keyFrame: TSeqKeyFrameSpec;
	duration: TSeqDurationSpec;
};

type TSeqMachineSpec = {
	durationInFrames: number;
	fps: number;
	seqs: TSeqSpec[];
};

type TSeq = {
	id: string;
	startFrame: number;
	endFrame: number;
	durationInFrames: number;
	seqSpec: TSeqSpec;
	// startSecond: number;
	// endSecond: number;
	// durationInSeconds: number;
};

type TSeqMachine = {
	durationInFrames: number;
	fps: number;
	seqs: TSeq[];
};

function buildSeqMachine(seqMachineSpec: TSeqMachineSpec): TSeqMachine {
	return {
		fps: seqMachineSpec.fps,
		durationInFrames: seqMachineSpec.durationInFrames,
		seqs: generateTSeqArray(
			seqMachineSpec.durationInFrames,
			seqMachineSpec.fps,
			seqMachineSpec.seqs
		),
	};
}

function generateTSeqArray(
	globalDurationInFrames: number,
	fps: number,
	seqSpecs: TSeqSpec[]
): TSeq[] {
	return seqSpecs.reduce<TSeq[]>((acc, seqSpec) => {
		// Determine the start frame based on the keyFrame type
		let startFrame: number;
		if (seqSpec.keyFrame.type === 'GLOBAL_SECOND') {
			startFrame = Math.floor(seqSpec.keyFrame.value * fps); // Convert seconds to frames
		} else if (seqSpec.keyFrame.type === 'GLOBAL_FRAME') {
			startFrame = seqSpec.keyFrame.value;
		} else {
			throw new Error(`Unknown keyFrame type`);
		}

		// Calculate the duration in frames based on the duration type
		let durationInFrames: number;
		if (seqSpec.duration.type === 'SECONDS') {
			durationInFrames = Math.floor(seqSpec.duration.value * fps); // Convert seconds to frames
		} else if (seqSpec.duration.type === 'FRAMES') {
			durationInFrames = seqSpec.duration.value;
		} else {
			throw new Error(`Unknown duration type`);
		}

		// Calculate the end frame, clamped to globalDurationInFrames - 1
		const endFrame = Math.min(
			startFrame + durationInFrames,
			globalDurationInFrames - 1
		);

		// Ensure the durationInFrames is correctly calculated based on the clamped endFrame
		const clampedDurationInFrames = endFrame - startFrame;

		// Add the new TSeq to the accumulator
		acc.push({
			id: seqSpec.id,
			startFrame: startFrame,
			endFrame: endFrame,
			durationInFrames: clampedDurationInFrames,
			seqSpec,
		});

		return acc;
	}, []);
}

// a seq that has additional information, about the current 'state'
type TLiveSeq = {
	// TSeq...
	// *****************************
	id: string;
	startFrame: number;
	endFrame: number;
	durationInFrames: number;
	seqSpec: TSeqSpec;
	// startSecond: number;
	// endSecond: number;
	// durationInSeconds: number;
	// ... and live status data:
	// *****************************
	relativeFrame: number;
	// relativeSecond: number;
	animationPercentage: number; //[0,1] , how about undefined when out of range???
	isActive: boolean; // startFrame <= frame <= endFrame
};

function seqToLiveSeq(seq: TSeq, frame: number): TLiveSeq {
	// TODO has to be used by TLiveSeq creation function..., s.t. it can be used also by interpolators, not just ui component!
	const isActive = frame >= seq.startFrame && frame <= seq.endFrame;
	const relativeFrame = frame - seq.startFrame;
	const animationPercentage = interpolate(
		frame,
		[seq.startFrame, seq.endFrame],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return {...seq, isActive, relativeFrame, animationPercentage};
}

type TLiveSeqMachine = {
	durationInFrames: number;
	fps: number;
	frame: number;
	liveSeqs: TLiveSeq[];
};

function buildLiveSeqMachine(
	seqMachine: TSeqMachine,
	frame: number
): TLiveSeqMachine {
	return {
		frame,
		fps: seqMachine.fps,
		durationInFrames: seqMachine.durationInFrames,
		liveSeqs: seqMachine.seqs.map((seq) => seqToLiveSeq(seq, frame)),
	};
}
