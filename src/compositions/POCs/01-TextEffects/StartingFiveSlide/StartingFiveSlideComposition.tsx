import {
	// number,
	z,
} from 'zod';
import React from 'react';
import {
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	Easing,
	Video,
} from 'remotion';
import {range} from 'lodash';

import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const startingFiveSlideCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

// TODO test TestPath feature for example in this lib (try paper.js first)
// https://svgjs.dev/docs/3.1/shape-elements/

export const StartingFiveSlideComposition: React.FC<
	z.infer<typeof startingFiveSlideCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(theme);

	const {width, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const maxZoomScale = 20;
	// const maxZoomScale = 1;

	const zoomInDelayInFrames = Math.floor(fps * 1);
	const zoomInDurationInFrames = 90 * 1;
	const zoomOutDurationInFrames = 90 * 1;
	const shiftDurationInFrames = 90 * 3;
	// const shiftDurationInFrames =
	// 	durationInFrames - zoomInDurationInFrames - zoomOutDurationInFrames;

	const zoomOutFromFrame =
		zoomInDelayInFrames + zoomInDurationInFrames + shiftDurationInFrames;
	const zoomOutEndFrame = zoomOutFromFrame + zoomOutDurationInFrames - 1;

	const revealVideoOpacity = interpolate(
		frame,
		[zoomOutFromFrame, zoomOutEndFrame],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const scale = interpolate(
		frame,
		[
			zoomInDelayInFrames,
			zoomInDelayInFrames + zoomInDurationInFrames - 1,
			zoomOutFromFrame,
			zoomOutEndFrame,
		],
		[maxZoomScale, 1, 1, maxZoomScale],
		{
			easing: Easing.ease,
		}
	);

	const videoWidth = width;
	const videoHeight = width;

	const fontFamily = 'Inter-Bold';
	const fontSize = 55;
	const lineHeight = 65;

	const word = 'JUNGLE FEVER.';
	const numberOfWordRows = 17;

	const seed = 999; // Your seed value
	const seededRandom = new SeededRandom(seed);
	const getRandomCharacterEntryDuration = () =>
		seededRandom.randomBetween(1, 90 * 3);

	const seed2 = 888; // Your seed value
	const seededRandom2 = new SeededRandom(seed2);
	const getRandomRowDisplacement = () =>
		seededRandom2.randomBetween(0, 300) - 300 / 2;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Sequence from={zoomInDelayInFrames} layout="none">
				{/* here, we set the size in pixels (width, height) */}
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							width: videoWidth,
							height: videoHeight,
							position: 'relative',
						}}
					>
						<svg
							style={{
								position: 'absolute',
								overflow: 'visible',
							}}
						>
							<defs>
								<mask id="mySvgMask">
									<g
										transform={`translate(${videoWidth / 2},${
											videoHeight / 2
										}) scale(${scale}) translate(${-videoWidth / 2},${
											-videoHeight / 2
										})`}
									>
										<rect
											fill={`rgba(255,255,255,${revealVideoOpacity})`}
											x="0"
											y="0"
											width={videoWidth}
											height={videoHeight}
										></rect>

										{range(numberOfWordRows).map((it, i) => {
											const centerIndex = (numberOfWordRows - 1) / 2;
											const isCenterRow = i === centerIndex;

											const cx = videoWidth / 2;
											const cy =
												videoHeight / 2 - (centerIndex - i) * lineHeight;

											const shiftDirection =
												i % 2 === 0 ? ('right' as const) : ('left' as const);

											const randomRowDisplacement = isCenterRow
												? 0
												: getRandomRowDisplacement();

											return (
												<WordRow
													shiftDirection={shiftDirection}
													dx={2}
													zoomInDurationInFrames={zoomInDurationInFrames}
													shiftDurationInFrames={shiftDurationInFrames}
													generateRandomCharacterEntryDuration={
														getRandomCharacterEntryDuration
													}
													centerX={cx + randomRowDisplacement}
													centerY={cy}
													isCenterRow={i === centerIndex}
													fontSize={fontSize}
													fontFamily={fontFamily}
													fill={`rgba(255,255,255,${1})`}
												>
													{word}
												</WordRow>
											);
										})}
									</g>
								</mask>
							</defs>
						</svg>

						<Video
							src="https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+2677769786%2C+zoom+into+dramatic+j%2C+lorenzobertolini_a_b%2C+M+5.mp4"
							style={{
								position: 'absolute',
								// width: '100%',
								height: '100%',
								objectFit: 'cover',
								WebkitMaskImage: 'url(#mySvgMask)',
							}}
							playbackRate={0.5}
						/>

						{/* this would also work with an image instead of a video, like so: */}
						{/* <div
						style={{
							objectFit: 'cover',
						}}
					>
						<img
							src="https://cdn.pixabay.com/photo/2024/06/03/21/40/square-8807357_1280.jpg"
							alt="Balloons"
						/>
					</div> */}
					</div>
				</div>
			</Sequence>
			<LorenzoBertoliniLogo2 theme={theme} color="white" />
		</div>
	);
};

export const WordRow: React.FC<{
	shiftDirection: 'right' | 'left';
	children: string;
	dx: number;
	centerX: number;
	centerY: number;
	fontFamily: string;
	fill: string;
	fontSize: number;
	isCenterRow: boolean;
	zoomInDurationInFrames: number;
	shiftDurationInFrames: number;
	generateRandomCharacterEntryDuration: () => number;
}> = ({
	children,
	dx,
	centerX,
	centerY,
	fontFamily,
	fontSize,
	fill,
	isCenterRow,
	zoomInDurationInFrames,
	shiftDurationInFrames,
	shiftDirection,
	generateRandomCharacterEntryDuration,
}) => {
	const frame = useCurrentFrame();

	const startShiftFrame = isCenterRow ? zoomInDurationInFrames : 0;
	const endShiftFrame = zoomInDurationInFrames + shiftDurationInFrames;
	const numberShiftFrames = endShiftFrame - startShiftFrame;

	const shiftPixelPerFrame = 0.2; // TODO as prop

	const totalShiftPixel = numberShiftFrames * shiftPixelPerFrame;

	const shiftPixelRange =
		shiftDirection === 'right' ? [0, totalShiftPixel] : [0, -totalShiftPixel];

	const translateX = interpolate(
		frame,
		[startShiftFrame, endShiftFrame],
		shiftPixelRange,
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.ease,
		}
	);

	const numberOfWords = 5;
	return (
		<g transform={`translate(${translateX},${0})`}>
			<text
				x={centerX}
				y={centerY}
				fontFamily={fontFamily}
				fontSize={fontSize}
				// fill={`rgba(255,255,255,${1 - opacity})`}
				fill={fill}
				textAnchor="middle"
				// alignmentBaseline="center"
				dominantBaseline={'middle'}
			>
				{range(numberOfWords).map((it, i) => {
					const isCenterWord = i === (numberOfWords - 1) / 2;
					return (
						<>
							{/* en-space */}
							{i !== 0 ? '\u2002' : undefined}
							<TSpanWord
								randomCharacterAppear={!isCenterWord || !isCenterRow}
								randomCharacterAppearAfterFrames={zoomInDurationInFrames}
								dx={2}
								generateRandomCharacterEntryDuration={
									generateRandomCharacterEntryDuration
								}
							>
								{children}
							</TSpanWord>
						</>
					);
				})}
			</text>
		</g>
	);
};

export const TSpanWord: React.FC<{
	children: string;
	dx: number;
	randomCharacterAppear: boolean;
	randomCharacterAppearAfterFrames: number;
	generateRandomCharacterEntryDuration: () => number;
}> = ({
	children,
	dx,
	randomCharacterAppear,
	randomCharacterAppearAfterFrames,
	generateRandomCharacterEntryDuration,
}) => {
	const characters = children.split('');

	return (
		<>
			{characters.map((char, i) => {
				return (
					<TSpanCharacter
						dx={i === 0 ? 0 : dx}
						randomCharacterAppear={randomCharacterAppear}
						randomCharacterAppearAfterFrames={randomCharacterAppearAfterFrames}
						generateRandomCharacterEntryDuration={
							generateRandomCharacterEntryDuration
						}
					>
						{char}
					</TSpanCharacter>
				);
			})}
		</>
	);
};

export const TSpanCharacter: React.FC<{
	children: string;
	dx: number;
	generateRandomCharacterEntryDuration: () => number;
	randomCharacterAppear: boolean;
	randomCharacterAppearAfterFrames: number;
}> = ({
	children,
	dx,
	randomCharacterAppear,
	randomCharacterAppearAfterFrames,
	generateRandomCharacterEntryDuration,
}) => {
	const frame = useCurrentFrame();

	const entryDurationInFrames = randomCharacterAppear
		? generateRandomCharacterEntryDuration()
		: 1;

	const opacity = randomCharacterAppear
		? interpolate(
				frame,
				[
					randomCharacterAppearAfterFrames,
					randomCharacterAppearAfterFrames + entryDurationInFrames,
				],
				[0, 1],
				{
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.ease,
				}
		  )
		: 1;

	return (
		<tspan dx={dx} opacity={opacity}>
			{children}
		</tspan>
	);
};

class SeededRandom {
	private seed: number;

	constructor(seed: number) {
		this.seed = seed;
	}

	// Linear Congruential Generator (LCG)
	private random(): number {
		const a = 1664525;
		const c = 1013904223;
		const m = Math.pow(2, 32);
		this.seed = (a * this.seed + c) % m;
		return this.seed / m;
	}

	// Generate a random number between min and max (inclusive)
	public randomBetween(min: number, max: number): number {
		return Math.floor(this.random() * (max - min + 1)) + min;
	}
}
// // Example usage:
// const seed = 12345; // Your seed value
// const seededRandom = new SeededRandom(seed);

// const randomNumber = seededRandom.randomBetween(0, 90);
// console.log(randomNumber);
