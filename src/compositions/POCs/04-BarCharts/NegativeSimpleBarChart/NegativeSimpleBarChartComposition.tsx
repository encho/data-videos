import {z} from 'zod';

import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {EconomistDataSource} from '../EconomistDataSource';
import {EconomistTitleWithSubtitle} from '../EconomistTitleWithSubtitle';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';

export const negativeSimpleBarChartCompositionSchema = z.object({
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

export const NegativeSimpleBarChartComposition: React.FC<
	z.infer<typeof negativeSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const CHART_WIDTH = 900;
	const BASELINE = 26;

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const barChartData = wahlergebnis2024_percChange.map((it) => ({
		label: it.parteiName,
		value: it.change,
		barColor: it.change > 0 ? '#088E81' : '#E53F1D', // TODO could be automatic!! within SimpleBarChart
		id: it.id,
		valueLabel: formatPercentage(it.change),
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
			<EconomistTitleWithSubtitle
				title={'Negative Simple Bar Chart'}
				subtitle={'Wahlergebnisse Brandenburg 2024'}
				theme={theme}
			/>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<SimpleBarChart
					data={barChartData}
					width={CHART_WIDTH}
					baseline={BASELINE}
					theme={theme}
					valueDomain={[-1, 1]} // TODO automatize from within barChart
					// showLayout
				/>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
