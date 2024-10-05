import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {createStyleObject} from '@capsizecss/core';

import {WaterfallTextEffect} from '../../SimpleStats/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../../acetti-layout';
import {useVerticalColumnLayout} from './useVerticalColumnLayout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {ReactNode} from 'react';

const INTER_CAPSIZE_MEASURES = {
	familyName: 'Inter',
	fullName: 'Inter Regular',
	postscriptName: 'Inter-Regular',
	capHeight: 1490,
	ascent: 1984,
	descent: -494,
	lineGap: 0,
	unitsPerEm: 2048,
	xHeight: 1118,
	xWidthAvg: 978,
	subsets: {
		latin: {
			xWidthAvg: 978,
		},
		thai: {
			xWidthAvg: 1344,
		},
	},
};

type TSimpleColumnChartProps = {
	data: {
		label: string;
		value: number;
		columnColor?: string;
		valueLabel: string;
	}[];
	// width: number;
	height: number; // TODO for column!
	baseFontSize: number;
};

export const SimpleColumnChart: React.FC<TSimpleColumnChartProps> = ({
	data,
	height,
	baseFontSize,
}) => {
	const nrColumns = data.length;
	const nrRows = 1;

	const COLUMN_LABEL_FONT_SIZE = baseFontSize;
	const COLUMN_VALUE_LABEL_FONT_SIZE = baseFontSize * 0.85;
	const COLUMN_SPACE = baseFontSize * 1;
	const COLUMN_WIDTH = baseFontSize * 4;

	const labelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 700,
		capHeight: COLUMN_LABEL_FONT_SIZE,
		color: 'white', // TODO from theme
	};

	const valueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		capHeight: COLUMN_VALUE_LABEL_FONT_SIZE,
		color: 'white', // TODO from theme
	};

	// =========================================
	const columnChartWidth =
		nrColumns * COLUMN_WIDTH + (nrColumns - 1) * COLUMN_SPACE;

	const matrixLayout = useMatrixLayout({
		width: columnChartWidth,
		height,
		nrColumns,
		nrRows,
		columnSpacePixels: COLUMN_SPACE,
	});

	// determine domain
	// ------------------------------------------
	const values = data.map((it) => it.value);
	const valueDomain = [0, Math.max(...values)] as [number, number];

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					position: 'relative',
					width: matrixLayout.width,
					height: matrixLayout.height,
				}}
			>
				{false ? (
					<div style={{position: 'absolute', top: 0, left: 0}}>
						<DisplayGridRails {...matrixLayout} />
					</div>
				) : null}
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<div style={{position: 'relative'}}>
						{data.map((it, i) => {
							const BAR_DELAY = Math.floor(90 * 1.4);
							const columnArea = getMatrixLayoutCellArea({
								layout: matrixLayout,
								row: 0,
								column: i,
							});
							return (
								<Sequence from={i * BAR_DELAY}>
									<HtmlArea area={columnArea}>
										<VerticalColumn
											width={columnArea.width}
											height={columnArea.height}
											label={it.label}
											labelTextProps={labelTextProps}
											valueLabel={it.valueLabel}
											valueLabelTextProps={valueLabelTextProps}
											value={it.value}
											columnColor={it.columnColor || 'magenta'}
											labelHeight={labelTextProps.capHeight}
											valueLabelHeight={valueLabelTextProps.capHeight}
											valueDomain={valueDomain}
										/>
									</HtmlArea>
								</Sequence>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export const VerticalColumn: React.FC<{
	width: number;
	height: number;
	labelHeight: number;
	valueLabelHeight: number;
	label: string;
	valueLabel: string;
	valueLabelTextProps: {
		fontFamily: string;
		fontWeight: number;
		capHeight: number;
		color: string;
	};
	labelTextProps: {
		fontFamily: string;
		fontWeight: number;
		capHeight: number;
		color: string;
	};
	value: number;
	valueDomain: [number, number];
	columnColor: string;
}> = ({
	width,
	height,
	labelHeight,
	valueLabelHeight,
	label,
	valueLabel,
	valueLabelTextProps,
	labelTextProps,
	valueDomain,
	value,
	columnColor,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const verticalColumnLayout = useVerticalColumnLayout({
		width,
		height,
		valueLabelHeight: valueLabelHeight,
		labelHeight: labelHeight,
		spaceHeight: 20, // TODO as prop
	});

	// // TODO as props
	const columnEntryDelayInFrames = fps * 0.6;
	const columnEnterDurationInFrames = fps * 0.6;
	const columnExitDurationInFrames = fps * 1;

	const valueLabelDelayInFrames =
		columnEntryDelayInFrames +
		columnEnterDurationInFrames -
		Math.floor(fps * 0.7);

	const columnHeightScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, verticalColumnLayout.areas.bar.height]);

	const fullColumnHeight = columnHeightScale(value);

	// // actually evtentually do in own factored out component with Sequence based delay?
	const interpolatedEntryColumnHeight = (currentFrame: number) =>
		interpolate(
			currentFrame,
			// TODO rename to column...
			[
				columnEntryDelayInFrames,
				columnEntryDelayInFrames + columnEnterDurationInFrames,
			],
			[0, fullColumnHeight],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

	const interpolatedExitColumnHeight = (currentFrame: number) =>
		interpolate(
			currentFrame,
			[durationInFrames - columnExitDurationInFrames, durationInFrames - 1],
			[fullColumnHeight, 0],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

	const interpolatedColumnHeight =
		frame < durationInFrames - columnExitDurationInFrames
			? interpolatedEntryColumnHeight(frame)
			: interpolatedExitColumnHeight(frame);

	// FONT
	// ****************************************************
	const capSizeLabelStyles = createStyleObject({
		capHeight: labelTextProps.capHeight,
		lineGap: 0,
		fontMetrics: INTER_CAPSIZE_MEASURES,
	});

	const capSizeValueLabelStyles = createStyleObject({
		capHeight: valueLabelTextProps.capHeight,
		lineGap: 0,
		fontMetrics: INTER_CAPSIZE_MEASURES,
	});

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			{false ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...verticalColumnLayout} />
				</div>
			) : null}

			<HtmlArea area={verticalColumnLayout.areas.label}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<CapSizeText
						capSizeStyles={capSizeLabelStyles}
						fontFamily={labelTextProps.fontFamily}
						fontWeight={labelTextProps.fontWeight}
						color={labelTextProps.color}
					>
						<WaterfallTextEffect>{label}</WaterfallTextEffect>
					</CapSizeText>
				</div>
			</HtmlArea>

			<HtmlArea area={verticalColumnLayout.areas.bar}>
				<svg
					width={verticalColumnLayout.areas.bar.width}
					height={verticalColumnLayout.areas.bar.height}
				>
					<rect
						y={verticalColumnLayout.areas.bar.height - interpolatedColumnHeight}
						x={0}
						width={verticalColumnLayout.areas.bar.width}
						height={interpolatedColumnHeight}
						fill={columnColor}
						rx={3}
						ry={3}
					/>
				</svg>
			</HtmlArea>

			<Sequence from={valueLabelDelayInFrames}>
				<HtmlArea area={verticalColumnLayout.areas.valueLabel}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
							marginTop:
								verticalColumnLayout.areas.bar.height -
								interpolatedColumnHeight,
						}}
					>
						<CapSizeText
							capSizeStyles={capSizeValueLabelStyles}
							fontFamily={valueLabelTextProps.fontFamily}
							fontWeight={valueLabelTextProps.fontWeight}
							color={valueLabelTextProps.color}
						>
							<FadeInAndOutText>{valueLabel}</FadeInAndOutText>
						</CapSizeText>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};

const CapSizeText: React.FC<{
	children: ReactNode;
	capSizeStyles: {
		fontSize: number | string;
		lineHeight: number | string;
		'::before': {marginBottom: number | string};
		'::after': {marginTop: number | string};
	};
	fontFamily: string;
	fontWeight: number;
	color: string;
}> = ({children, capSizeStyles, fontFamily, fontWeight, color}) => {
	return (
		<div
			style={{
				marginBottom: capSizeStyles['::before'].marginBottom,
				marginTop: capSizeStyles['::after'].marginTop,
			}}
		>
			<div
				style={{
					color,
					fontWeight,
					fontFamily,
					fontSize: capSizeStyles.fontSize,
					lineHeight: capSizeStyles.lineHeight,
				}}
			>
				{children}
			</div>
		</div>
	);
};
