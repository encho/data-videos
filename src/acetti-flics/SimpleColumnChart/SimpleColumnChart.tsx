import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {useVerticalColumnLayout} from './useVerticalColumnLayout';
import {getTextStyleCapHeight} from '../../acetti-typography/CapSizeTextNew';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';
import {ThemeType} from '../../acetti-themes/themeTypes';

type TSimpleColumnChartProps = {
	theme: ThemeType;
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
	theme,
}) => {
	const frame = useCurrentFrame();

	const nrColumns = data.length;
	const nrRows = 1;

	// TODO define IBCS-style chart sizes in terms of baseline on a theme level
	const COLUMN_SPACE = Number(baseline);
	const COLUMN_WIDTH = baseline * 4;

	const labelHeight = getTextStyleCapHeight({
		baseline,
		theme,
		key: 'datavizLabel',
	});

	const valueLabelHeight = getTextStyleCapHeight({
		baseline,
		theme,
		key: 'datavizValueLabel',
	});

	// =========================================
	// TODO factor this out, as we want to be able to access chart width also from other components
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
					{/* {false ? (
						<div style={{position: 'absolute', top: 0, left: 0}}>
							<DisplayGridRails {...matrixLayout} />
						</div>
					) : null} */}
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
												theme={theme}
												baseline={baseline}
												width={columnArea.width}
												height={columnArea.height}
												label={it.label}
												valueLabel={it.valueLabel}
												value={it.value}
												columnColor={it.columnColor || 'magenta'}
												labelHeight={labelHeight}
												valueLabelHeight={valueLabelHeight}
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
	theme: ThemeType;
	baseline: number;
	width: number;
	height: number;
	labelHeight: number;
	valueLabelHeight: number;
	label: string;
	valueLabel: string;
	value: number;
	valueDomain: [number, number];
	columnColor: string;
}> = ({
	theme,
	baseline,
	width,
	height,
	labelHeight,
	valueLabelHeight,
	label,
	valueLabel,
	valueDomain,
	value,
	columnColor,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const verticalColumnLayout = useVerticalColumnLayout({
		width,
		height,
		valueLabelHeight,
		labelHeight,
		spaceHeight: 20, // TODO as prop
	});

	// // TODO as props
	const columnEntryDelayInFrames = fps * 0.6;
	const columnEnterDurationInFrames = fps * 0.6;
	const columnExitDurationInFrames = Number(fps);

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
			{/* {false ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...verticalColumnLayout} stroke="cyan" />
				</div>
			) : null} */}

			<HtmlArea area={verticalColumnLayout.areas.label}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.datavizLabel}
						baseline={baseline}
					>
						<WaterfallTextEffect>{label}</WaterfallTextEffect>
					</TypographyStyle>
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
						{/* TODO  new api: (ideally theme and baseline via context!) */}
						{/* <ValueLabel theme={theme} baseline={baseline}>
							{valueLabel}
						</ValueLabel> */}
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.datavizValueLabel}
							baseline={baseline}
						>
							<FadeInAndOutText>{valueLabel}</FadeInAndOutText>
						</TypographyStyle>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};
