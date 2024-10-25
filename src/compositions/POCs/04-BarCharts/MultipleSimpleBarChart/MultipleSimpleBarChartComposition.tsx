import {z} from 'zod';
import {Sequence} from 'remotion';

import {EconomistDataSource} from '../EconomistDataSource';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {EconomistTitleWithSubtitle} from '../EconomistTitleWithSubtitle';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {getTextDimensions} from '../../../../acetti-typography/CapSizeTextNew';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';

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

const wahlergebnis2024: {
	parteiName: string;
	prozent: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 30.9 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 29.2 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', prozent: 13.5 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', prozent: 4.1 / 100, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', prozent: 3.0 / 100, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB/Freie Wähler',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];

const wahlergebnis2024_2: {
	parteiName: string;
	prozent: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 50 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 20 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', prozent: 10 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 20 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
];

export const MultipleSimpleBarChartComposition: React.FC<
	z.infer<typeof multipleSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(theme);

	const barChartWidth = 800;
	const baseline = 18;

	const barChartData = wahlergebnis2024.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartData2 = wahlergebnis2024_2.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const labelWidths = [...barChartData, ...barChartData2].map(
		(it) =>
			getTextDimensions({key: 'datavizLabel', theme, baseline, text: it.label})
				.width
	);

	const labelWidth = Math.max(...labelWidths);

	const valueLabelWidths = [...barChartData, ...barChartData2].map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = Math.max(...valueLabelWidths);

	const allValues = [...barChartData, ...barChartData2].map((it) => it.value);
	const sharedValueDomain = [0, Math.max(...allValues)] as [number, number];

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<EconomistTitleWithSubtitle
				title={'AfD: Vormarsch in Brandenburg'}
				subtitle={'Wahlergebnisse Brandenburg 2024'}
				theme={theme}
			/>

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
					}}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.body}
						baseline={22}
						marginBottom={2}
					>
						<WaterfallTextEffect>Brandenburg Wahl</WaterfallTextEffect>
					</TypographyStyle>

					{/* TODO pass shared domainValues, but also shared label widths and valueLabelWidths */}
					<SimpleBarChart
						theme={theme}
						data={barChartData}
						width={barChartWidth}
						baseline={baseline}
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
					}}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.body}
						baseline={22}
						marginBottom={2}
					>
						<WaterfallTextEffect>Bayern Wahl</WaterfallTextEffect>
					</TypographyStyle>
					{/* TODO pass shared domainValues, but also shared label widths and valueLabelWidths */}
					<Sequence from={90 * 4} layout="none">
						<SimpleBarChart
							theme={theme}
							data={barChartData2}
							width={barChartWidth}
							baseline={baseline}
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

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
