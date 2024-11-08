import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';

import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {MultipleSimpleBarChartFlic} from './MultipleSimpleBarChartFlic';

export const multipleSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleBarChartComposition: React.FC<
	z.infer<typeof multipleSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const {width, height} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	const upperBarChartData = wahlergebnis2024.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		// barColor: it.farbe,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const lowerBarChartData = wahlergebnis2024_2.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	return (
		<PageContext margin={50} nrBaselines={60} width={width} height={height}>
			<MultipleSimpleBarChartFlic
				theme={theme}
				upperData={upperBarChartData}
				lowerData={lowerBarChartData}
			/>
		</PageContext>
	);
};

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
	{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#222', id: 'CDU'}, // CDU Black
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
	{parteiName: 'CDU', prozent: 20 / 100, farbe: '#222', id: 'CDU'}, // CDU Black
	{parteiName: 'BSW', prozent: 10 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
];
