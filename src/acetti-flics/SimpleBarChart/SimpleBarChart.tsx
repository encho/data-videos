import {measureText} from '@remotion/layout-utils';
import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {useHorizontalBarLayout} from './useHorizontalBarLayout';
import {WaterfallTextEffect} from '../../compositions/SimpleStats/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../compositions/SimpleStats/FadeInAndOutText';

type TSimpleBarChartProps = {
	data: {
		label: string;
		value: number;
		barColor?: string;
		valueLabel: string;
	}[];
	width: number;
	baseFontSize: number;
};

export const SimpleBarChart: React.FC<TSimpleBarChartProps> = ({
	data,
	width,
	baseFontSize,
}) => {
	const nrColumns = 1;
	const nrRows = data.length;

	const BAR_LABEL_FONT_SIZE = baseFontSize;
	const BAR_VALUE_LABEL_FONT_SIZE = baseFontSize * 0.75;
	const BAR_HEIGHT = baseFontSize * 1.5;
	const BAR_SPACE = baseFontSize * 0.5;

	// const LABEL_COLOR = '#f05122';
	// const VALUE_LABEL_COLOR = '#ffff00';

	const LABEL_COLOR = '#fff';
	const VALUE_LABEL_COLOR = '#fff';

	const labelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		fontSize: BAR_LABEL_FONT_SIZE,
		// letterSpacing: 1,
	};

	const valueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 700,
		fontSize: BAR_VALUE_LABEL_FONT_SIZE,
		// letterSpacing: 1,
	};

	// =========================================
	const barChartHeight = nrRows * BAR_HEIGHT + (nrRows - 1) * BAR_SPACE;

	const matrixLayout = useMatrixLayout({
		width,
		height: barChartHeight,
		nrColumns,
		nrRows,
		rowSpacePixels: BAR_SPACE,
	});

	// determine labelWidth from all labelWidth's
	// ------------------------------------------
	const labelWidths = data.map(
		(it) => measureText({...labelTextProps, text: it.label}).width
	);
	const labelWidth = Math.max(...labelWidths) * 1.05; // safety width bump

	// determine valueLabelWidth from all valueLabelWidth's
	// ------------------------------------------
	const valueLabelWidths = data.map(
		(it) => measureText({...valueLabelTextProps, text: it.valueLabel}).width
	);
	const valueLabelWidth = Math.max(...valueLabelWidths);

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
							const barArea = getMatrixLayoutCellArea({
								layout: matrixLayout,
								row: i,
								column: 0,
							});
							return (
								<Sequence from={i * BAR_DELAY}>
									<HtmlArea area={barArea}>
										<HorizontalBar
											width={barArea.width}
											height={barArea.height}
											labelWidth={labelWidth}
											valueLabelWidth={valueLabelWidth}
											label={it.label}
											valueLabel={it.valueLabel}
											labelTextProps={labelTextProps}
											valueLabelTextProps={valueLabelTextProps}
											valueDomain={valueDomain}
											value={it.value}
											barColor={it.barColor || 'magenta'}
											labelColor={LABEL_COLOR}
											valueLabelColor={VALUE_LABEL_COLOR}
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

export const HorizontalBar: React.FC<{
	width: number;
	height: number;
	labelWidth: number;
	valueLabelWidth: number;
	label: string;
	valueLabel: string;
	valueLabelTextProps: {
		fontFamily: string;
		fontWeight: number;
		fontSize: number;
	};
	labelTextProps: {
		fontFamily: string;
		fontWeight: number;
		fontSize: number;
	};
	value: number;
	valueDomain: [number, number];
	barColor: string;
	labelColor: string;
	valueLabelColor: string;
}> = ({
	width,
	height,
	labelWidth,
	valueLabelWidth,
	label,
	valueLabel,
	valueLabelTextProps,
	labelTextProps,
	valueDomain,
	value,
	barColor,
	labelColor,
	valueLabelColor,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const horizontalBarLayout = useHorizontalBarLayout({
		width,
		height,
		valueLabelWidth,
		labelWidth,
		spaceWidth: 20, // TODO as prop
	});

	// TODO as props
	const barEntryDelayInFrames = fps * 0.6;
	const barEnterDurationInFrames = fps * 0.6;
	const barExitDurationInFrames = fps * 1;

	const valueLabelDelayInFrames =
		barEntryDelayInFrames + barEnterDurationInFrames - Math.floor(fps * 0.7);

	const barWidthScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, horizontalBarLayout.areas.bar.width]);

	const fullBarWidth = barWidthScale(value);

	// actually evtentually do in own factored out component with Sequence based delay?
	const interpolatedEntryBarWidth = (currentFrame: number) =>
		interpolate(
			currentFrame,
			[barEntryDelayInFrames, barEntryDelayInFrames + barEnterDurationInFrames],
			[0, fullBarWidth],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

	const interpolatedExitBarWidth = (currentFrame: number) =>
		interpolate(
			currentFrame,
			[durationInFrames - barExitDurationInFrames, durationInFrames - 1],
			[fullBarWidth, 0],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

	const interpolatedBarWidth =
		frame < durationInFrames - barExitDurationInFrames
			? interpolatedEntryBarWidth(frame)
			: interpolatedExitBarWidth(frame);

	const valueLabelMarginLeft =
		-1 * (horizontalBarLayout.areas.bar.width - interpolatedBarWidth);

	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			<HtmlArea area={horizontalBarLayout.areas.label}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<div style={{...labelTextProps, color: labelColor}}>
						<WaterfallTextEffect>{label}</WaterfallTextEffect>
					</div>
				</div>
			</HtmlArea>
			<HtmlArea area={horizontalBarLayout.areas.bar}>
				<svg
					width={horizontalBarLayout.areas.bar.width}
					height={horizontalBarLayout.areas.bar.height}
				>
					<rect
						// TODO add opacity eventually
						// opacity={opacity}
						y={0}
						x={0}
						height={horizontalBarLayout.areas.bar.height}
						width={interpolatedBarWidth}
						fill={barColor}
						rx={3}
						ry={3}
					/>
				</svg>
			</HtmlArea>
			<Sequence from={valueLabelDelayInFrames}>
				<HtmlArea area={horizontalBarLayout.areas.valueLabel}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
							alignItems: 'center',
							height: '100%',
							marginLeft: valueLabelMarginLeft,
						}}
					>
						<div style={{...valueLabelTextProps, color: valueLabelColor}}>
							<FadeInAndOutText>{valueLabel}</FadeInAndOutText>
						</div>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};
