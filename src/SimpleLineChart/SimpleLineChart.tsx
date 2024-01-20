import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	delayRender,
	continueRender,
} from 'remotion';
import {zColor} from '@remotion/zod-types';
import {z} from 'zod';
import {useRef, useEffect, useState} from 'react';

// TODO
// implement this design: https://polygon.io/blog/universal-snapshot
// import {Watermark} from '../GenericTools/Watermark';
import {FooterLogo} from './FooterLogo';
import {SlideIn} from '../SlideIn';
import {SlideTitleSequence} from '../slides/SlideTitleSequence';
import {LineChartBody} from './LineChartBody';
import {fontFamilies} from '../fontSpecs';

export const simpleLineChartSchema = z.object({
	title: z.string(),
	// title: z.union([z.string(), z.object({})]),
	// title: z.union([z.string(), z.any()]),
	subtitle: z.string(),
	showZero: z.boolean(),
	fontFamilyTitle: z.enum(fontFamilies),
	fontFamilySubtitle: z.enum(fontFamilies),
	fontFamilyXTicklabels: z.enum(fontFamilies),
	fontFamilyYTicklabels: z.enum(fontFamilies),
	watermark: z.boolean().optional(),
	showLineChartLayout: z.optional(z.boolean()),
	styling: z.object({
		backgroundColor: zColor(),
		titleColor: zColor(),
		gridLinesColor: zColor(),
		yLabelsColor: zColor(),
		xLabelsColor: zColor(),
		lineColor: zColor(),
		titleFontSize: z.number(),
		subTitleFontSize: z.number(),
		yAxisAreaWidth: z.number(),
		lineStrokeWidth: z.number(),
		lineCircleRadius: z.number(),
		yTickValuesFontSize: z.number(),
		xTickValuesFontSize: z.number(),
		xAxisAreaHeight: z.number(),
		gridLinesStrokeWidth: z.number(),
		yAxisAreaMarginLeft: z.number(),
		xTickValuesLength: z.number(),
		xTickValuesWidth: z.number(),
		xTickValuesColor: zColor(),
	}),
	data: z
		.array(
			z.object({
				index: z.date(),
				value: z.number(),
			})
		)
		.nullable(),
});

export const SimpleLineChart: React.FC<
	z.infer<typeof simpleLineChartSchema>
> = ({
	data,
	title,
	subtitle,
	showZero,
	styling,
	watermark,
	showLineChartLayout,
	fontFamilyTitle,
	fontFamilySubtitle,
	fontFamilyXTicklabels,
	fontFamilyYTicklabels,
}) => {
	// TODO use tiny-invariant
	if (data === null) {
		throw new Error('Data was not fetched');
	}

	const [chartElementHeight, setChartElementHeight] = useState(0);
	const [chartElementWidth, setChartElementWidth] = useState(0);

	const chartElementRef = useRef(null);

	useEffect(() => {
		const handle = delayRender('before measuring chart element height');
		// @ts-ignore
		setChartElementHeight(chartElementRef.current.offsetHeight);
		// @ts-ignore
		setChartElementWidth(chartElementRef.current.offsetWidth);
		continueRender(handle);
	}, []);

	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames - 5],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill style={{backgroundColor: styling.backgroundColor}}>
			<div className="flex flex-col h-full p-12">
				<div className="pb-12">
					<Sequence from={0} durationInFrames={durationInFrames} layout="none">
						<SlideTitleSequence
							title={title}
							subTitle={subtitle}
							fontFamilyTitle={fontFamilyTitle}
							fontFamilySubtitle={fontFamilySubtitle}
							styling={{
								titleColor: styling.titleColor,
								subTitleColor: styling.titleColor,
								titleFontSize: styling.titleFontSize,
								subTitleFontSize: styling.subTitleFontSize,
							}}
						/>
					</Sequence>
				</div>
				<div ref={chartElementRef} className="flex-auto" style={{opacity}}>
					<Sequence from={15} layout="none">
						<SlideIn>
							<LineChartBody
								areaWidth={chartElementWidth}
								areaHeight={chartElementHeight}
								data={data}
								showZero={showZero}
								showLayout={showLineChartLayout}
								fontFamilyYTicklabels={fontFamilyYTicklabels}
								fontFamilyXTicklabels={fontFamilyXTicklabels}
								styling={{
									gridLinesColor: styling.gridLinesColor,
									yLabelsColor: styling.yLabelsColor,
									xLabelsColor: styling.xLabelsColor,
									lineColor: styling.lineColor,
									yAxisAreaWidth: styling.yAxisAreaWidth,
									lineStrokeWidth: styling.lineStrokeWidth,
									lineCircleRadius: styling.lineCircleRadius,
									yTickValuesFontSize: styling.yTickValuesFontSize,
									xTickValuesFontSize: styling.xTickValuesFontSize,
									xAxisAreaHeight: styling.xAxisAreaHeight,
									gridLinesStrokeWidth: styling.gridLinesStrokeWidth,
									yAxisAreaMarginLeft: styling.yAxisAreaMarginLeft,
									xTickValuesLength: styling.xTickValuesLength,
									xTickValuesWidth: styling.xTickValuesWidth,
									xTickValuesColor: styling.xTickValuesColor,
								}}
							/>
						</SlideIn>
					</Sequence>
				</div>
				{/* <div className="bg-orange-300"> */}
				{/* // TODO rename to footerLogoImgSrc or so */}
				{watermark ? (
					// <h1 className="text-[140px]">FOOTERIMAGE</h1>
					<FooterLogo />
				) : (
					<div></div>
				)}
				{/* </div> */}
			</div>

			{/* <Watermark watermark={watermark} baselines={baselines} /> */}
			{/* <ProgressBar
				progressBar={progressBar}
				theme={theme}
				baselines={baselines}
			/> */}
		</AbsoluteFill>
	);
};
