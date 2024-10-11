import {number, z} from 'zod';
import React, {useState, useEffect} from 'react';
import {
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	staticFile,
	Sequence,
} from 'remotion';
import invariant from 'tiny-invariant';
import * as paper from 'paper';
import opentype from 'opentype.js';
import {range} from 'lodash';

import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
// import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
// import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';

export const startingFiveSlideCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

// TODO test TestPath feature for example in this lib (try paper.js first)
// https://svgjs.dev/docs/3.1/shape-elements/

export const StartingFiveSlideComposition: React.FC<
	z.infer<typeof startingFiveSlideCompositionSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader([
		'Inter-Regular',
		'Inter-Bold',
		'SourceSerifPro-Light',
	]);

	// const [svgPath, setSvgPath] = useState<string | null>(null);

	const theme = getThemeFromEnum(themeEnum as any);

	const {durationInFrames, width} = useVideoConfig();
	const frame = useCurrentFrame();

	// const fontFilePath = staticFile(`/fonts/Inter/Inter-Bold.ttf`);
	// const fontFilePath = staticFile(
	// 	`/fonts/SourceSerifPro/SourceSerifPro-Light.ttf`
	// );

	const opacity = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		easing: Easing.ease,
	});

	const zoomInDurationInFrames = 90 * 2;
	const scale = interpolate(frame, [0, zoomInDurationInFrames - 1], [4, 1], {
		easing: Easing.ease,
	});

	const videoWidth = width;
	const videoHeight = width;

	// const fontFamily = 'SourceSerifPro-Light';
	// const fontFamily = 'Inter-Regular';
	const fontFamily = 'Inter-Bold';
	const fontSize = 35;
	// const lineHeight = 40;
	const lineHeight = 60;
	const word = 'Lorenzo Bertolini';
	const numberOfWordRows = 5;

	// const seed = 12345; // Your seed value
	const seed = 999; // Your seed value
	const seededRandom = new SeededRandom(seed);
	const getRandomCharacterEntryDuration = () =>
		seededRandom.randomBetween(1, 90 * 3);

	return (
		<div
			style={{
				// backgroundColor: theme.global.backgroundColor,
				backgroundColor: '#F60051',
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			{/* <SlideTitle theme={theme}>Starting Five Slide</SlideTitle> */}

			{/* here, we set the size in pixels (width, height) */}
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div
					style={{width: videoWidth, height: videoHeight, position: 'relative'}}
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
										// fill="rgba(255,255,255,0.1)"
										x="0"
										y="0"
										width={videoWidth}
										height={videoHeight}
									></rect>

									{range(numberOfWordRows).map((it, i) => {
										const centerIndex = (numberOfWordRows - 1) / 2;

										const cy = videoHeight / 2 - (centerIndex - i) * lineHeight;

										return (
											<WordRow
												dx={2}
												zoomInDurationInFrames={zoomInDurationInFrames}
												generateRandomCharacterEntryDuration={
													getRandomCharacterEntryDuration
												}
												centerX={videoWidth / 2}
												// centerY={lineHeight * (i + 1)}
												centerY={cy}
												isCenterRow={i === centerIndex}
												fontSize={fontSize}
												fontFamily={fontFamily}
												// fill={`rgba(255,255,255,${1 - opacity})`}
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

					<video
						playsInline
						autoPlay
						muted
						loop
						style={{
							width: '100%',
							// height: '100%',
							objectFit: 'cover',
							WebkitMaskImage: 'url(#mySvgMask)',
						}}
					>
						<source
							src="https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/TextMask.mp4"
							type="video/mp4"
						/>
					</video>

					{/* this would also work with an image instead of a video, like so: */}
					{/* <div
						style={{
							height: '100%',
							width: '100%',
							objectFit: 'cover',
							backgroundColor: 'red',
							WebkitMaskImage: 'url(#mySvgMask)',
							border: '3px solid red',
						}}
					>
						<img
							src="https://cdn.pixabay.com/photo/2024/06/03/21/40/square-8807357_1280.jpg"
							alt="Balloons"
						/>
					</div> */}
				</div>
			</div>

			{/* <LorenzoBertoliniLogo color={theme.typography.textColor} /> */}
		</div>
	);
};

export const WordRow: React.FC<{
	children: string;
	dx: number;
	centerX: number;
	centerY: number;
	fontFamily: string;
	fill: string;
	fontSize: number;
	isCenterRow: boolean;
	zoomInDurationInFrames: number;
	// randomCharacterAppear: boolean;
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
	// randomCharacterAppear,
	generateRandomCharacterEntryDuration,
}) => {
	const numberOfWords = 3;
	return (
		<text
			x={centerX}
			y={centerY}
			fontFamily={fontFamily}
			fontSize={fontSize}
			// fill={`rgba(255,255,255,${1 - opacity})`}
			fill={fill}
			textAnchor="middle"
			alignmentBaseline="middle"
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
