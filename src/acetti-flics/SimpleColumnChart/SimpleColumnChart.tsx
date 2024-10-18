import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {useVerticalColumnLayout} from './useVerticalColumnLayout';
import {CapSizeTextNew} from '../../acetti-typography/new/CapSizeTextNew';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';

type TSimpleColumnChartProps = {
	data: {
		label: string;
		value: number;
		columnColor?: string;
		valueLabel: string;
	}[];
	height: number;
	baseline: number;
	valueDomain?: [number, number];
	delayInFrames?: number;
};

export const SimpleColumnChart: React.FC<TSimpleColumnChartProps> = ({
	data,
	height,
	baseline,
	valueDomain,
	delayInFrames = 0,
}) => {
	const frame = useCurrentFrame();
	// const {fps} = useVideoConfig();

	const nrColumns = data.length;
	const nrRows = 1;

	const COLUMN_LABEL_FONT_SIZE = baseline;
	const COLUMN_VALUE_LABEL_FONT_SIZE = baseline * 0.85;
	const COLUMN_SPACE = baseline * 1;
	const COLUMN_WIDTH = baseline * 4;

	const labelTextProps = {
		fontFamily: 'Inter' as const,
		fontWeight: 600,
		capHeight: COLUMN_LABEL_FONT_SIZE,
		color: 'white', // TODO from theme
	};

	const valueLabelTextProps = {
		fontFamily: 'Inter' as const,
		fontWeight: 400,
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
	const computedValueDomain =
		valueDomain || ([0, Math.max(...values)] as [number, number]);

	return frame < delayInFrames ? (
		<div
			style={{
				position: 'relative',
				width: matrixLayout.width,
				height: matrixLayout.height,
			}}
		/>
	) : (
		<Sequence from={delayInFrames} layout="none">
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
												valueDomain={computedValueDomain}
											/>
										</HtmlArea>
									</Sequence>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</Sequence>
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
		fontFamily: 'Inter';
		fontWeight: number;
		capHeight: number;
		color: string;
	};
	labelTextProps: {
		fontFamily: 'Inter';
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
					<CapSizeTextNew
						fontFamily={labelTextProps.fontFamily}
						fontWeight={labelTextProps.fontWeight}
						color={labelTextProps.color}
						capHeight={labelTextProps.capHeight}
						lineGap={0}
					>
						<WaterfallTextEffect>{label}</WaterfallTextEffect>
					</CapSizeTextNew>
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
						<CapSizeTextNew
							fontFamily={valueLabelTextProps.fontFamily}
							fontWeight={valueLabelTextProps.fontWeight}
							color={valueLabelTextProps.color}
							capHeight={valueLabelTextProps.capHeight}
							lineGap={0}
						>
							<FadeInAndOutText>{valueLabel}</FadeInAndOutText>
						</CapSizeTextNew>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};
