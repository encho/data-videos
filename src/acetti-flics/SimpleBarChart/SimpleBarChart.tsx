import {getTextDimensions} from '../../acetti-typography/CapSizeTextNew';
import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {useHorizontalBarLayout} from './useHorizontalBarLayout';
import {WaterfallTextEffect} from '../../acetti-typography/TextEffects/WaterfallTextEffect';
import {DisplayGridRails, HtmlArea} from '../../acetti-layout';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../acetti-typography/TextEffects/FadeInAndOutText';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';

export type TSimpleBarChartData = {
	label: string;
	value: number;
	barColor?: string;
	valueLabel: string;
}[];

type TSimpleBarChartProps = {
	theme: ThemeType;
	data: TSimpleBarChartData;
	width: number;
	baseline: number;
	labelWidth?: number;
	valueLabelWidth?: number;
	valueDomain?: [number, number];
	showLayout?: boolean;
};

export const SimpleBarChart: React.FC<TSimpleBarChartProps> = ({
	theme,
	data,
	width,
	baseline,
	showLayout = false,
	labelWidth: labelWidthProp,
	valueLabelWidth: valueLabelWidthProp,
	valueDomain: valueDomainProp,
}) => {
	const nrColumns = 1;
	const nrRows = data.length;

	const BAR_HEIGHT = baseline * 2;
	const BAR_SPACE = baseline * 0.5;

	// =========================================
	const barChartHeight = nrRows * BAR_HEIGHT + (nrRows - 1) * BAR_SPACE;

	const matrixLayout = useMatrixLayout({
		width,
		height: barChartHeight,
		nrColumns,
		nrRows,
		rowSpacePixels: BAR_SPACE,
	});

	// TODO use labelTextStyleProps after we use that text style!!!
	// determine labelWidth from all labelWidth's
	// ------------------------------------------
	const labelWidths = data.map(
		(it) =>
			getTextDimensions({key: 'datavizLabel', theme, baseline, text: it.label})
				.width
	);

	const labelWidth = labelWidthProp || Math.max(...labelWidths);

	// TODO use valueLabelTextStyleProps after we use that text style!!!
	// determine valueLabelWidth from all valueLabelWidth's
	// ------------------------------------------
	const valueLabelWidths = data.map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = valueLabelWidthProp || Math.max(...valueLabelWidths);

	// determine domain
	// ------------------------------------------
	const values = data.map((it) => it.value);
	const valueDomain =
		valueDomainProp || ([0, Math.max(...values)] as [number, number]);

	return (
		<div
			style={{
				position: 'relative',
				width: matrixLayout.width,
				height: matrixLayout.height,
			}}
		>
			{showLayout ? (
				// {true ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...matrixLayout} stroke="#555" />
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
										theme={theme}
										baseline={baseline}
										width={barArea.width}
										height={barArea.height}
										labelWidth={labelWidth}
										valueLabelWidth={valueLabelWidth}
										label={it.label}
										valueLabel={it.valueLabel}
										valueDomain={valueDomain}
										value={it.value}
										barColor={it.barColor || 'magenta'}
										showLayout={showLayout}
									/>
								</HtmlArea>
							</Sequence>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export const HorizontalBar: React.FC<{
	theme: ThemeType;
	baseline: number;
	width: number;
	height: number;
	labelWidth: number;
	valueLabelWidth: number;
	label: string;
	valueLabel: string;
	value: number;
	valueDomain: [number, number];
	barColor: string;
	showLayout?: boolean;
}> = ({
	theme,
	baseline,
	width,
	height,
	labelWidth,
	valueLabelWidth,
	label,
	valueLabel,
	valueDomain,
	value,
	barColor,
	showLayout = false,
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
			{showLayout ? (
				<div style={{position: 'absolute', top: 0, left: 0}}>
					<DisplayGridRails {...horizontalBarLayout} />
				</div>
			) : null}
			<HtmlArea area={horizontalBarLayout.areas.label}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
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
