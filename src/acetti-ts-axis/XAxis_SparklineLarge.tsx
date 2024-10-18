import {
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	interpolate,
	Easing,
} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../acetti-layout';
import {ThemeType} from '../acetti-themes/themeTypes';
import {TXAxisSpec} from './utils/axisSpecs_xAxis';
import {WaterfallTextEffect} from '../acetti-typography/TextEffects/WaterfallTextEffect';
import {TypographyStyle} from '../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	getTextDimensions,
	getTextStyleCapHeight,
} from '../acetti-typography/new/CapSizeTextNew';

export const XAxis_SparklineLarge: React.FC<{
	baseline: number;
	area: TGridLayoutArea;
	axisSpec: TXAxisSpec;
	theme: ThemeType;
	fadeInDurationInFrames: number;
	tickLabelColor: string;
	lineColor: string;
}> = ({
	baseline,
	area,
	theme,
	axisSpec,
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

	const firstLabelTextWidth = getTextDimensions({
		baseline,
		theme,
		key: 'datavizLabel',
		text: firstLabelSpec.label,
	});

	const secondLabelTextWidth = getTextDimensions({
		baseline,
		theme,
		key: 'datavizLabel',
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
				<TypographyLabel
					color={tickLabelColor}
					theme={theme}
					baseline={baseline}
					style={{left: 0}}
				>
					{firstLabelSpec.label}
				</TypographyLabel>
			</Sequence>

			<Sequence
				name="last-Date"
				layout="none"
				from={KF_END_DATE_ENTER_START}
				durationInFrames={durationInFrames}
			>
				<TypographyLabel
					color={tickLabelColor}
					theme={theme}
					baseline={baseline}
					style={{right: 0}}
				>
					{secondLabelSpec.label}
				</TypographyLabel>
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
						theme={theme}
						baseline={baseline}
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

// TODO centralize in acetti-typography
export const TypographyLabel: React.FC<{
	children: string;
	color: string;
	style: {left: number} | {right: number};
	theme: ThemeType;
	baseline: number;
}> = ({children, color, style, theme, baseline}) => {
	return (
		<div
			style={{
				position: 'absolute',
				...style,
			}}
		>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.datavizLabel}
				baseline={baseline}
				color={color}
			>
				<WaterfallTextEffect>{children}</WaterfallTextEffect>
			</TypographyStyle>
		</div>
	);
};

export const SvgLine: React.FC<{
	theme: ThemeType;
	baseline: number;
	xStartPosition: number;
	xEndPosition: number;
	fadeInDurationInFrames: number;
	fadeOutDurationInFrames: number;
	color: string;
}> = ({
	theme,
	baseline,
	xStartPosition,
	xEndPosition,
	fadeInDurationInFrames,
	fadeOutDurationInFrames,
	color,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const labelTextCapHeight = getTextStyleCapHeight({
		theme,
		baseline,
		key: 'datavizLabel',
	});

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
				x2={x2}
				y1={labelTextCapHeight / 2}
				y2={labelTextCapHeight / 2}
				stroke={color}
				strokeWidth="2"
			/>
		</g>
	);
};
