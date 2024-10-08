import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {EconomistDataSource} from '../EconomistDataSource';

export const simpleBarChartCompositionSchema = z.object({
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

export const SimpleBarChartComposition: React.FC<
	z.infer<typeof simpleBarChartCompositionSchema>
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
						<FadeInAndOutText>Simple Bar Chart</FadeInAndOutText>
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 50,
					marginTop: 120,
				}}
			>
				<SimpleBarChart
					data={barChartData}
					width={800}
					baseFontSize={30}
					theme={theme}
				/>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>
			<LorenzoBertoliniLogo
				// TODO pass theme
				// theme={theme}
				color={theme.typography.textColor}
				// fontSize={28}
			/>
		</div>
	);
};
