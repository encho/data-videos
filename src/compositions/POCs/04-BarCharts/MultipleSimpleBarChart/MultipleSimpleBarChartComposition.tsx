import {z} from 'zod';
import {Sequence} from 'remotion';

import {EconomistDataSource} from '../EconomistDataSource';
import {measureText} from '../../02-TypographicLayouts/BaselineGrid/CapSizeTextNew';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {CapSizeTextNew} from '../../02-TypographicLayouts/BaselineGrid/CapSizeTextNew';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {
	getTextProps_label,
	getTextProps_valueLabel,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';

export const multipleSimpleBarChartCompositionSchema = z.object({
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

const wahlergebnis2024_2: {
	parteiName: string;
	prozent: number;
	farbe: string;
}[] = [
	{parteiName: 'SPD', prozent: 50 / 100, farbe: '#E3000F'}, // SPD Red
	{parteiName: 'AfD', prozent: 20 / 100, farbe: '#009EE0'}, // AfD Blue
	{parteiName: 'BSW', prozent: 10 / 100, farbe: '#FFA500'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 20 / 100, farbe: '#fff'}, // CDU Black
];

export const MultipleSimpleBarChartComposition: React.FC<
	z.infer<typeof multipleSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(['Inter-Regular']);

	const baseFontSize = 24;

	const barChartData = wahlergebnis2024.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartData2 = wahlergebnis2024_2.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const labelTextProps = {
		fontFamily: 'Inter' as const, // TODO Inter-Bold
		fontWeight: 600,
		capHeight: 28,
		color: theme.typography.textColor,
	};

	const textProps_label = getTextProps_label({baseFontSize, theme});
	const textProps_valueLabel = getTextProps_valueLabel({baseFontSize, theme});

	const labelWidths = [...barChartData, ...barChartData2].map(
		(it) => measureText({...textProps_label, text: it.label}).width
	);
	const labelWidth = Math.max(...labelWidths);

	const valueLabelWidths = [...barChartData, ...barChartData2].map(
		(it) => measureText({...textProps_valueLabel, text: it.valueLabel}).width
	);
	const valueLabelWidth = Math.max(...valueLabelWidths);

	const allValues = [...barChartData, ...barChartData2].map((it) => it.value);
	const sharedValueDomain = [0, Math.max(...allValues)] as [number, number];

	const barChartWidth = 800;

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
						<FadeInAndOutText>Multiple Bar Chart</FadeInAndOutText>
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 80,
					marginTop: 100,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 40,
					}}
				>
					<CapSizeTextNew
						fontFamily={labelTextProps.fontFamily}
						fontWeight={labelTextProps.fontWeight}
						color={labelTextProps.color}
						capHeight={labelTextProps.capHeight}
						lineGap={0}
					>
						<WaterfallTextEffect>Brandenburg Wahl</WaterfallTextEffect>
					</CapSizeTextNew>
					{/* TODO pass shared domainValues, but also shared label widths and valueLabelWidths */}
					<SimpleBarChart
						theme={theme}
						data={barChartData}
						width={barChartWidth}
						baseFontSize={baseFontSize}
						labelWidth={labelWidth}
						valueLabelWidth={valueLabelWidth}
						valueDomain={sharedValueDomain}
						// showLayout
					/>
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 40,
					}}
				>
					<CapSizeTextNew
						fontFamily={labelTextProps.fontFamily}
						fontWeight={labelTextProps.fontWeight}
						color={labelTextProps.color}
						capHeight={labelTextProps.capHeight}
						lineGap={0}
					>
						<WaterfallTextEffect>Bayern Wahl</WaterfallTextEffect>
					</CapSizeTextNew>
					{/* TODO pass shared domainValues, but also shared label widths and valueLabelWidths */}
					<Sequence from={90 * 4} layout="none">
						<SimpleBarChart
							theme={theme}
							data={barChartData2}
							width={barChartWidth}
							baseFontSize={baseFontSize}
							labelWidth={labelWidth}
							valueLabelWidth={valueLabelWidth}
							valueDomain={sharedValueDomain}
							// showLayout
						/>
					</Sequence>
				</div>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
