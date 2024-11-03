import {z} from 'zod';

import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {SimpleBarChartKeyframes} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChartKeyframes';
import {
	SimpleBarChartLayout,
	SimpleAnimatedBarChartLayout,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChartLayout';

export const simpleBarChartDevCompositionSchema = z.object({
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
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
	{parteiName: 'CDU', prozent: -12.1 / 100, farbe: '#fff', id: 'CDU'}, // CDU Black
];

export const SimpleBarChartDevComposition: React.FC<
	z.infer<typeof simpleBarChartDevCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const CHART_WIDTH = 400;
	const BASELINE = 18;

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const barChartData = wahlergebnis2024.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		id: it.id,
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
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: 50,
					marginTop: 50,
				}}
			>
				<SimpleBarChart
					data={barChartData}
					width={CHART_WIDTH}
					baseline={BASELINE}
					theme={theme}
					// showLayout={true}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: 50,
					marginTop: 50,
					gap: 50,
				}}
			>
				<SimpleBarChartLayout
					data={barChartData}
					width={CHART_WIDTH}
					baseline={BASELINE}
					theme={theme}
					showLayout={true}
				/>
				<SimpleAnimatedBarChartLayout
					data={barChartData}
					width={CHART_WIDTH}
					baseline={BASELINE}
					theme={theme}
					showLayout={true}
					valueDomain={[-0.5, 0.5] as [number, number]}
				/>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
				<SimpleBarChartKeyframes
					data={barChartData}
					width={720}
					theme={theme}
					baseline={12}
				/>
			</div>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
