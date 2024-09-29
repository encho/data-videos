import {z} from 'zod';
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
import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {WaterfallTextEffect} from '../../SimpleStats/WaterfallTextEffect';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {DisplayGridRails, HtmlArea} from '../../../acetti-layout';

import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../acetti-layout/hooks/useMatrixLayout';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';

export const simpleBarChartPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

function formatPercentage(value: number): string {
	return (
		(value * 100).toLocaleString(undefined, {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1,
		}) + '%'
	);
}
// Example usage:
// console.log(formatPercentage(0.12)); // Output: "12.0%"

const wahlergebnis2024: {parteiName: string; prozent: number; farbe: string}[] =
	[
		{parteiName: 'SPD', prozent: 30.9 / 100, farbe: '#E3000F'}, // SPD Red
		{parteiName: 'AfD', prozent: 29.2 / 100, farbe: '#009EE0'}, // AfD Blue
		{parteiName: 'BSW', prozent: 13.5 / 100, farbe: '#FFA500'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
		// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
		{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#fff'}, // CDU Black
		{parteiName: 'Grüne', prozent: 4.1 / 100, farbe: '#64A12D'}, // Grüne Green
		{parteiName: 'Die Linke', prozent: 3.0 / 100, farbe: '#BE3075'}, // Die Linke Magenta
		{parteiName: 'BVB/Freie Wähler', prozent: 2.6 / 100, farbe: '#FFD700'}, // BVB Yellow
		{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00'}, // FDP Yellow
		{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080'}, // Others Gray
	];

export const SimpleBarChartPOC: React.FC<
	z.infer<typeof simpleBarChartPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const barChartData = wahlergebnis2024.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 60,
							marginTop: 50,
							fontFamily: 'Arial',
							fontWeight: 700,
						}}
					>
						<FadeInAndOutText>SimpleBarChartPOC</FadeInAndOutText>
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 50,
					marginTop: 100,
				}}
			>
				<SimpleBarChartHtml data={barChartData} width={800} baseFontSize={36} />
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const SimpleBarChartHtml: React.FC<{
	data: {
		label: string;
		value: number;
		barColor?: string;
		valueLabel: string;
	}[];
	width: number;
	baseFontSize: number;
}> = ({data, width, baseFontSize}) => {
	const nrColumns = 1;
	const nrRows = data.length;

	const BAR_LABEL_FONT_SIZE = baseFontSize;
	const BAR_VALUE_LABEL_FONT_SIZE = baseFontSize * 0.75;
	const BAR_HEIGHT = baseFontSize * 1.5;
	const BAR_SPACE = baseFontSize * 0.5;

	const barChartHeight = nrRows * BAR_HEIGHT + (nrRows - 1) * BAR_SPACE;

	const matrixLayout = useMatrixLayout({
		width,
		height: barChartHeight,
		nrColumns,
		nrRows,
		rowSpacePixels: 20,
	});

	// labelWidth for each dataitem
	// determine labelWidth from all labelWidth's

	const labelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 500,
		fontSize: BAR_LABEL_FONT_SIZE,
		// letterSpacing: 1,
	};

	const labelWidths = data.map(
		(it) => measureText({...labelTextProps, text: it.label}).width
	);
	const labelWidth = Math.max(...labelWidths) * 1.05; // safety width bump

	// valueLabelWidth for each dataitem
	// determine valueLabelWidth from all valueLabelWidth's
	const valueLabelTextProps = {
		fontFamily: 'Arial',
		fontWeight: 700,
		fontSize: BAR_VALUE_LABEL_FONT_SIZE,
		// letterSpacing: 1,
	};

	const valueLabelWidths = data.map(
		(it) => measureText({...valueLabelTextProps, text: it.valueLabel}).width
	);
	const valueLabelWidth = Math.max(...valueLabelWidths);

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

const LABEL_TEXT_COLOR = '#fff';

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
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const horizontalBarLayout = useHorizontalBarLayout({
		width,
		height,
		valueLabelWidth,
		labelWidth,
		spaceWidth: 20,
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
					<div style={{...labelTextProps, color: LABEL_TEXT_COLOR}}>
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
						<div style={{...valueLabelTextProps, color: '#fff'}}>
							<FadeInAndOutText>{valueLabel}</FadeInAndOutText>
						</div>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};
