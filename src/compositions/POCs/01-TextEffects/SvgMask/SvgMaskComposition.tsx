import {z} from 'zod';
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import invariant from 'tiny-invariant';
import * as paper from 'paper';
import SVGPathCommander from 'svg-path-commander';

import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';

export const svgMaskCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

// TODO test TestPath feature for example in this lib (try paper.js first)
// https://svgjs.dev/docs/3.1/shape-elements/

export const SvgMaskComposition: React.FC<
	z.infer<typeof svgMaskCompositionSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader(['Inter-Regular', 'Inter-Bold']);

	const theme = getThemeFromEnum(themeEnum as any);

	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		easing: Easing.ease,
	});

	const videoWidth = 800;
	const videoHeight = 800;

	const bigRadius = interpolate(
		frame,
		[0, durationInFrames],
		[0, videoWidth / 3],
		{
			easing: Easing.ease,
		}
	);

	paper.setup([videoWidth, videoHeight]);

	let paperCircle = new paper.Path.Circle(
		[videoWidth / 2, videoHeight / 2],
		bigRadius
	);

	let paperCircle2 = new paper.Path.Circle(
		[videoWidth / 2, videoHeight / 3],
		videoWidth / 7
	);

	// exclude, subtract, unite, intersect, divide
	// const result = paperCircle2.exclude(paperCircle);
	const result = paperCircle2.unite(paperCircle);

	const svgPathElement = result.exportSVG();
	invariant(typeof svgPathElement !== 'string');

	const resultingPath = svgPathElement.getAttribute('d');
	invariant(resultingPath);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>SVG Mask for Video</SlideTitle>

			{/* here, we set the size in pixels (width, height) */}
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div
					style={{width: videoWidth, height: videoHeight, position: 'relative'}}
				>
					<svg
						style={{
							position: 'absolute',
							overflow: 'visible',
							opacity: 0,
						}}
					>
						<defs>
							<mask id="mySvgMask">
								<rect
									fill="rgba(255,255,255,0.0)"
									x="0"
									y="0"
									width={videoWidth}
									height={videoHeight}
								></rect>
								<path
									d={resultingPath}
									fill={`rgba(255,255,255,${1 - opacity})`}
								/>
								<text
									x={videoWidth / 2}
									y={videoHeight * 0.997}
									fontFamily={'Inter-Bold'}
									fontSize={videoHeight / 5}
									fontWeight={700}
									fill={`rgba(255,255,255,${1 - opacity})`}
									textAnchor="middle"
									alignmentBaseline="baseline"
								>
									{'encho.'}
								</text>
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
						WebkitMaskImage: 'url(#maskkk)',
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

			{/* <Position position={{top: 100, left: 100}}></Position> */}
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
