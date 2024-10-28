import {z} from 'zod';
import {useVideoConfig} from 'remotion';

import {EconomistDataSource} from '../EconomistDataSource';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {EconomistTitleWithSubtitle} from '../EconomistTitleWithSubtitle';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {HtmlArea} from '../../../../acetti-layout';

export const composedSimpleBarChartCompositionSchema = z.object({
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
		parteiName: 'BVB',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];

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
	{parteiName: 'Grüne', change: -0.05, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
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

export const ComposedSimpleBarChartComposition: React.FC<
	z.infer<typeof composedSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const {width} = useVideoConfig();

	const theme = getThemeFromEnum(themeEnum as any);

	useFontFamiliesLoader(theme);

	const matrixLayout = useMatrixLayout({
		width: width - 4, // to better show grid rails!
		// width, TODO enable when we are not showing gridlayout any more
		height: 680,
		nrColumns: 2,
		nrRows: 1,
		columnSizes: [
			// {type: 'fr', value: 4},
			// {type: 'fr', value: 1},
			{type: 'fr', value: 2},
			{type: 'fr', value: 1},
		],
		rowSpacePixels: 80,
		columnSpacePixels: 50,
		rowPaddingPixels: 0,
		columnPaddingPixels: 12 * 16, // TODO page margin/baseline
	});

	const leftArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const rightArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});

	const barChartData = wahlergebnis2024.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		barColor: '#444',
		// barColor: it.farbe,
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartDataPercChange = wahlergebnis2024_percChange.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.change,
		barColor: it.change > 0 ? 'green' : 'red',
		// valueLabel: formatPercentage(it.prozent),
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
				title={'Composed Simple Barchart'}
				subtitle={'Wahlergebnisse Brandenburg 2024'}
				theme={theme}
			/>

			<div style={{position: 'relative'}}>
				<DisplayGridRails
					{...matrixLayout}
					// stroke={theme.TypographicLayouts.gridLayout.lineColor}
					// stroke={'#292929'}
					stroke={'#252525'}
					// stroke={'transparent'}
					// stroke={'magenta'}
				/>

				<HtmlArea area={leftArea}>
					<SimpleBarChart
						theme={theme}
						data={barChartData}
						width={leftArea.width}
						height={leftArea.height}
						// showLayout
					/>
				</HtmlArea>
				<HtmlArea area={rightArea}>
					<SimpleBarChart
						theme={theme}
						data={barChartDataPercChange}
						width={rightArea.width}
						height={rightArea.height}
						valueDomain={[-1, 1]}
						hideLabels
						// showLayout
					/>
				</HtmlArea>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
