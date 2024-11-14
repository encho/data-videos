import {z} from 'zod';
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
import invariant from 'tiny-invariant';

import {usePage} from '../../../../acetti-components/PageContext';
import {SeededRandom} from '../../../../acetti-utils/seededRandom';
import {zodThemeType} from '../../../../acetti-themes/themeTypes';

export const zSquareVideoSrcEnum = z.enum([
	'GOLD',
	'FOOTBALL_FIELD',
	'JUNGLE_WATERFALL',
	'STOCK_MARKET',
]);

const videoSources = {
	GOLD: 'https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+2580331760%2C+Shining+gold+bars+an%2C+gold-midjourneypng%2C+M+5.mp4',
	JUNGLE_WATERFALL:
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+2677769786%2C+zoom+into+dramatic+j%2C+lorenzobertolini_a_b%2C+M+5.mp4',
	FOOTBALL_FIELD:
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/videos/square/Gen-2+3082600833%2C+A+football+field+wit%2C+lorenzobertolini_a_g%2C+M+5.mp4',
	STOCK_MARKET:
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+1076122830%2C+Stock+market+diagram%2C+lorenzobertolini_Des%2C+M+5.mp4',
};

export const startingFiveSlideSchema = z.object({
	theme: zodThemeType,
	fontSizeInBaselines: z.number(),
	lineHeightInBaselines: z.number(),
	numberOfWordRows: z.number(),
	word: z.string(),
	video: zSquareVideoSrcEnum,
});

export const StartingFiveSlide: React.FC<
	z.infer<typeof startingFiveSlideSchema>
> = ({
	theme,
	fontSizeInBaselines,
	lineHeightInBaselines,
	numberOfWordRows,
	word,
	video,
}) => {
	const {fontFamily} = theme.typography.textStyles.h1;

	const page = usePage();

	const fontSize = page.baseline * fontSizeInBaselines;
	const lineHeight = page.baseline * lineHeightInBaselines;
	const videoSrc = videoSources[video];
	invariant(videoSrc);

	const {width, height, fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const maxZoomScale = 30;

	const zoomInDelayInFrames = Math.floor(fps * 0);
	const zoomInDurationInFrames = fps;
	const zoomOutDurationInFrames = fps;

	const shiftDurationInFrames =
		durationInFrames -
		zoomInDelayInFrames -
		zoomInDurationInFrames -
		zoomOutDurationInFrames;

	const zoomOutFromFrame =
		zoomInDelayInFrames + zoomInDurationInFrames + shiftDurationInFrames;
	const zoomOutEndFrame = zoomOutFromFrame + zoomOutDurationInFrames - 1;

	const textVisibility = interpolate(
		frame,
		[
			zoomInDelayInFrames,
			zoomInDelayInFrames + zoomInDurationInFrames,
			zoomOutFromFrame,
			zoomOutEndFrame,
		],
		[0, 1, 1, 0],
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
	const videoHeight = height;

	const seed = 999; // Your seed value
	const seededRandom = new SeededRandom(seed);
	const getRandomCharacterEntryDuration = () =>
		seededRandom.randomBetween(1, fps * 3);

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
			<Sequence layout="none">
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
											fill={`rgba(0,0,0,${1})`} // like this, we never reveal video in background
											x="0"
											y="0"
											width={videoWidth}
											height={videoHeight}
										/>

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
													// fill={`rgba(255,255,255,${1 - revealVideoOpacity})`}
													fill={`rgba(255,255,255,${textVisibility})`}
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
							src={videoSrc}
							// src="https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+2677769786%2C+zoom+into+dramatic+j%2C+lorenzobertolini_a_b%2C+M+5.mp4"
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								// objectFit: 'fill',
								WebkitMaskImage: 'url(#mySvgMask)',
							}}
							playbackRate={4 / 5}
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
		</div>
	);
};

export const WordRow: React.FC<{
	shiftDirection: 'right' | 'left';
	children: string;
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
				fill={fill}
				textAnchor="middle"
				dominantBaseline="middle"
			>
				{range(numberOfWords).map((it, i) => {
					const isCenterWord = i === (numberOfWords - 1) / 2;
					return (
						<>
							{/* en-space */}
							{i > 0 ? '\u2002' : undefined}
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
