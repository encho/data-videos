import React, {ReactNode} from 'react';
import {scaleLinear} from 'd3-scale';
import chroma from 'chroma-js';
import {Sequence} from 'remotion';

import {TKeyFramesGroup, getSign, getKeyFrame} from './keyframes';

export const KeyFramesSequence: React.FC<{
	keyframes: TKeyFramesGroup;
	from: string;
	to: string;
	name: string;
	children: ReactNode;
}> = ({keyframes, from, to, name, children}) => {
	const keyFrameFrom = getKeyFrame(keyframes, from).frame; // e.g.
	const keyFrameTo = getKeyFrame(keyframes, to).frame;

	// inclusive duration!!!
	const durationInFrames = keyFrameTo - keyFrameFrom + 1;

	return (
		<Sequence
			from={keyFrameFrom}
			durationInFrames={durationInFrames}
			layout="none"
			name={name}
		>
			{children}
		</Sequence>
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
			<div style={{marginBottom: 18}}>
				<div style={{fontSize: 26, color: '#fff', fontFamily: 'Inter-Regular'}}>
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
								fill={'#666'}
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
