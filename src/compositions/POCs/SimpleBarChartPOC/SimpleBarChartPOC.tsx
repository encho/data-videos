import {z} from 'zod';
import {Sequence} from 'remotion';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {SimpleBarChart} from './SimpleBarChart';

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
					flexDirection: 'row',
					gap: 50,
					marginTop: 60,
				}}
			>
				{/* TODO at this level we pass theme colors directly already or Theme object? */}
				{/* tendency: Theme Object at this level of abstraction */}
				<SimpleBarChart data={barChartData} width={400} baseFontSize={18} />
				<Sequence from={90 * 4} layout="none">
					<SimpleBarChart data={barChartData} width={400} baseFontSize={18} />
				</Sequence>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 50,
					marginTop: 60,
				}}
			>
				{/* TODO at this level we pass theme colors directly already? */}
				<SimpleBarChart data={barChartData} width={800} baseFontSize={26} />
				{/* <SimpleBarChart data={barChartData} width={1000} baseFontSize={50} /> */}
			</div>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
