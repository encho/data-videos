import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {PageContext} from '../../../../acetti-components/PageContext';
import {NegativeBarChartPage} from './NegativeBarChartPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const negativeSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const NegativeSimpleBarChartComposition: React.FC<
	z.infer<typeof negativeSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {width, height} = useVideoConfig();

	const positiveColor = theme.positiveNegativeColors.positiveColor;
	const negativeColor = theme.positiveNegativeColors.negativeColor;

	const barChartData = wahlergebnis2024_percChange.map((it) => ({
		label: it.parteiName,
		value: it.change,
		barColor: it.change > 0 ? positiveColor : negativeColor, // TODO could be automatic!! within SimpleBarChart
		id: it.id,
		valueLabel: formatPercentage(it.change),
	}));

	return (
		<PageContext
			margin={50}
			nrBaselines={40}
			width={width}
			height={height}
			theme={theme}
		>
			<NegativeBarChartPage
				title="Negative Bar Chart"
				theme={theme}
				subtitle="With Green and Red Bars"
				data={barChartData}
				dataSource="Data Source: Some Data SOurce here..."
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

const wahlergebnis2024_percChange: {
	parteiName: string;
	change: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', change: -0.1, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', change: -0.3, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', change: 0.5, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', change: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', change: 0.2, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', change: 0, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', change: 0.1, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB',
		change: 0.02,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', change: -0.8, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', change: 0.9, farbe: '#808080', id: 'SON'}, // Others Gray
];
