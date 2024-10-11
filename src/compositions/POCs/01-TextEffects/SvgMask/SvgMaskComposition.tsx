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

	// const bigCirclePath = generateCirclePath({
	// 	r: videoWidth / 5,
	// 	cx: videoWidth / 2,
	// 	cy: videoWidth / 2,
	// });

	// const smallCirclePath = generateCirclePath({
	// 	r: videoWidth / 7,
	// 	cx: videoWidth / 2,
	// 	cy: videoWidth / 3,
	// });

	paper.setup([videoWidth, videoHeight]);

	var text = new paper.PointText({
		point: [videoWidth / 2, videoHeight * 0.8], // Position of the text
		content: 'Hello, SVG!', // The text content
		// fillColor: 'black',     // Text color
		fontFamily: 'Inter-Bold', // Font family
		fontSize: videoHeight * 0.2, // Font size
	});

	// Convert the text to a path
	// var textPath = text.toPath();

	let paperCircle = new paper.Path.Circle(
		[videoWidth / 2, videoHeight / 2],
		// videoWidth / 5
		bigRadius
	);

	let paperCircle2 = new paper.Path.Circle(
		[videoWidth / 2, videoHeight / 3],
		videoWidth / 7
	);

	// const myRectAttr = {
	// 	type: 'rect',
	// 	x: 25,
	// 	y: 25,
	// 	width: 50,
	// 	height: 50,
	// 	rx: 5
	// };

	// const myRectPath = SVGPathCommander.shapeToPath(myRectAttr);

	// exclude, subtract, unite, intersect, divide
	// const result = paperCircle2.exclude(paperCircle);
	const result = paperCircle2.unite(paperCircle);

	const svgPathElement = result.exportSVG();
	invariant(typeof svgPathElement !== 'string');

	const ddd = svgPathElement.getAttribute('d');
	invariant(ddd);

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
						// width="0"
						// height="0"
						// width="100%"
						// height="100%"
						// viewBox="0 0 400 300"
						style={{
							position: 'absolute',
							// visibility: 'hidden'
							overflow: 'visible',
							opacity: 0,
						}}
					>
						<defs>
							<mask id="maskkk">
								<rect
									fill="rgba(255,255,255,0.0)"
									// fill={`rgba(255,255,255,${opacity})`}
									// fill="black"
									x="0"
									y="0"
									width={videoWidth}
									height={videoHeight}
								></rect>
								<path d={ddd} fill={`rgba(255,255,255,${1 - opacity})`} />
								{/* <path
									d={bigCirclePath}
									fill={`rgba(255,255,255,${1 - opacity})`}
								/> */}
								{/* <path
									d={smallCirclePath}
									fill={`rgba(255,255,255,${1 - opacity})`}
								/> */}
								{/* <circle
									// fill="#FFFFFF"
									fill={`rgba(255,255,255,${1 - opacity})`}
									cx={videoWidth / 2}
									cy={videoHeight / 2}
									r={videoWidth / 5}
								/> */}
								{/* <circle
									// fill="#FFFFFF"
									fill={`rgba(255,255,255,${1 - opacity})`}
									cx={videoWidth / 2}
									cy={videoHeight / 4}
									r={videoWidth / 6}
								/> */}

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
							// height: '100%',
							width: '100%',
							// height: '50%',
							// width: '50%',
							objectFit: 'cover',
							WebkitMaskImage: 'url(#maskkk)',
						}}
						// className="w-full object-cover rounded-sm bg-gray-100 md:hiddenxxxx"
					>
						<source
							// src="https://lorenzobertolini.s3.eu-central-1.amazonaws.com/nba/HeadlessShortTrailer-x1.mp4"
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

function getDAttribute(path: any) {
	let d = '';
	for (let i = 0; i < path.segments.length; i++) {
		let segment = path.segments[i];
		let point = segment.point;
		let handleIn = segment.handleIn;
		let handleOut = segment.handleOut;

		if (i === 0) {
			d += `M${point.x},${point.y} `;
		} else {
			if (!handleIn.isZero()) {
				d += `C${point.x + handleIn.x},${point.y + handleIn.y} `;
			}
			if (!handleOut.isZero()) {
				d += `C${point.x + handleOut.x},${point.y + handleOut.y} `;
			}
			d += `${point.x},${point.y} `;
		}
	}
	if (path.closed) {
		d += 'Z';
	}
	return d.trim();
}
