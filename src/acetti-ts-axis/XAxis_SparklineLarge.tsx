import {
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	interpolate,
	Easing,
} from 'remotion';
import invariant from 'tiny-invariant';
import {measureText} from '@remotion/layout-utils';

import {TGridLayoutArea} from '../acetti-layout';
import {ThemeType} from '../acetti-themes/themeTypes';
import {TXAxisSpec, TAxisLabelSpec} from './utils/axisSpecs_xAxis';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {WaterfallTextEffect} from '../acetti-typography/TextEffects/WaterfallTextEffect';

type TTheme_XAxis = ThemeType['xAxis'];

// SIZES, from theme or props rather
// const TICK_LINE_SIZE = 24;
// const TICK_TEXT_FONT_SIZE = 24;
// const TICK_TEXT_FONT_WEIGHT = 500;

const labelTextProps = {
	fontFamily: 'Arial',
	fontWeight: 700,
	fontSize: 30,
	// letterSpacing: 1,
};

export const XAxis_SparklineLarge: React.FC<{
	area: TGridLayoutArea;
	axisSpec: TXAxisSpec;
	theme: TTheme_XAxis;
	periodsScale: TPeriodsScale;
	clip?: boolean;
	fadeInDurationInFrames: number;
	tickLabelColor: string;
	lineColor: string;
}> = ({
	area,
	theme,
	axisSpec,
	periodsScale,
	clip = true,
	fadeInDurationInFrames,
	tickLabelColor,
	lineColor,
}) => {
	const {durationInFrames, fps} = useVideoConfig();

	// KEY-FRAMES from props?
	// ************************************************************************
	const LABEL_FADE_IN_DURATION = Math.floor(fps * 0.5);
	const PAUSE_AFTER_START_LABEL_FADED_IN = Math.floor(fps * 0.1);
	const PAUSE_AFTER_LINE_FADED_IN = Math.floor(fps * 0.1);
	const TOTAL_LABEL_DURATIONS =
		2 * LABEL_FADE_IN_DURATION +
		PAUSE_AFTER_START_LABEL_FADED_IN +
		PAUSE_AFTER_LINE_FADED_IN;

	const KF_XLINE_FADE_IN_DURATION =
		fadeInDurationInFrames - TOTAL_LABEL_DURATIONS;

	const KF_XLINE_FADE_OUT_DURATION = Math.floor(fps * 0.5);

	const KF_START_DATE_ENTER_START = Math.floor(fps * 0);
	const KF_XLINE_ENTER_START = LABEL_FADE_IN_DURATION + Math.floor(fps * 0.1);
	const KF_END_DATE_ENTER_START =
		KF_XLINE_ENTER_START + KF_XLINE_FADE_IN_DURATION;

	// ************************************************************************

	const firstLabelSpec = axisSpec.labels[0];
	const secondLabelSpec = axisSpec.labels[1];

	invariant(firstLabelSpec);
	invariant(secondLabelSpec);

	// const firstLabelXPosition = periodsScale.mapFloatIndexToRange(
	// 	firstLabelSpec.periodFloatIndex
	// );

	// const secondLabelXPosition = periodsScale.mapFloatIndexToRange(
	// 	secondLabelSpec.periodFloatIndex
	// );

	const firstLabelTextWidth = measureText({
		...labelTextProps,
		text: firstLabelSpec.label,
	});

	const secondLabelTextWidth = measureText({
		...labelTextProps,
		text: secondLabelSpec.label,
	});

	return (
		<div style={{position: 'relative'}}>
			<Sequence
				name="first-Date"
				layout="none"
				from={KF_START_DATE_ENTER_START}
				durationInFrames={durationInFrames - Math.floor(fps * 0.3)}
			>
				<HtmlLabel
					labelSpec={firstLabelSpec}
					color={tickLabelColor}
					style={{left: 0}}
				/>
			</Sequence>

			<Sequence
				name="last-Date"
				layout="none"
				from={KF_END_DATE_ENTER_START}
				durationInFrames={durationInFrames}
			>
				<HtmlLabel
					labelSpec={secondLabelSpec}
					color={tickLabelColor}
					style={{right: 0}}
				/>
			</Sequence>

			<svg
				width={area.width}
				height={area.height}
				style={{
					overflow: 'visible',
				}}
			>
				<defs>
					<clipPath id="xAxisAreaClipPath">
						<rect x={0} y={0} width={area.width} height={area.height} />
					</clipPath>
				</defs>

				<Sequence name="x-axis-line" layout="none" from={KF_XLINE_ENTER_START}>
					<SvgLine
						xStartPosition={firstLabelTextWidth.width + 15}
						xEndPosition={area.width - secondLabelTextWidth.width - 15}
						fadeInDurationInFrames={KF_XLINE_FADE_IN_DURATION}
						fadeOutDurationInFrames={KF_XLINE_FADE_OUT_DURATION}
						color={lineColor}
					/>
				</Sequence>
			</svg>
		</div>
	);
};

export const HtmlLabel: React.FC<{
	labelSpec: TAxisLabelSpec;
	color: string;
	style: {left: number} | {right: number};
}> = ({labelSpec, color, style}) => {
	return (
		<div
			style={{
				position: 'absolute',
				...style,
				color,
				fontSize: labelTextProps.fontSize,
				fontWeight: labelTextProps.fontWeight,
				fontFamily: labelTextProps.fontFamily,
			}}
		>
			<WaterfallTextEffect>{labelSpec.label}</WaterfallTextEffect>
		</div>
	);
};

export const SvgLine: React.FC<{
	xStartPosition: number;
	xEndPosition: number;
	fadeInDurationInFrames: number;
	fadeOutDurationInFrames: number;
	color: string;
}> = ({
	xStartPosition,
	xEndPosition,
	fadeInDurationInFrames,
	fadeOutDurationInFrames,
	color,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const x1 = interpolate(
		frame,
		[0, durationInFrames - fadeOutDurationInFrames, durationInFrames - 1],
		[xStartPosition, xStartPosition, xEndPosition],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const x2 = interpolate(
		frame,
		[0, fadeInDurationInFrames],
		[xStartPosition, xEndPosition],
		{
			easing: Easing.bounce,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const opacity = interpolate(frame, [0, fadeInDurationInFrames], [0, 1], {
		easing: Easing.ease,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<g
			// clipPath={clip ? 'url(#xAxisAreaClipPath)' : undefined}
			transform="translate(0,0)"
		>
			<line
				opacity={opacity}
				x1={x1}
				// x1={xStartPosition}
				x2={x2}
				y1={labelTextProps.fontSize / 1.35}
				y2={labelTextProps.fontSize / 1.35}
				stroke={color}
				strokeWidth="2"
			/>
		</g>
	);
};
