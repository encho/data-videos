import {z} from 'zod';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';
import {useMemo} from 'react';

import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {Page} from '../../../../acetti-components/Page';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {useBarChartRaceKeyframes} from './useBarChartRaceKeyframes';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {SeededRandom} from '../../../../acetti-utils/seededRandom';
import {BarChartRace} from '../../../../acetti-flics/SimpleBarChart/BarChartRace';
import {TSimpleBarChartData} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';

export const barChartRaceSimpleCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartRace_Simple_Composition: React.FC<
	z.infer<typeof barChartRaceSimpleCompositionSchema>
> = ({themeEnum}) => {
	const {width, height} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<PageContext margin={50} nrBaselines={40} width={width} height={height}>
			<BarChartRace_Simple_Flic theme={theme} />
		</PageContext>
	);
};

export const BarChartRace_Simple_Flic: React.FC<{theme: ThemeType}> = ({
	theme,
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const page = usePage();

	const gdpData = useMemo(() => getGdpData(2020, 2024), []);

	const barChartRaceData: {
		index: string;
		data: TSimpleBarChartData;
		valueDomain: [number, number];
	}[] = Object.keys(gdpData).map((yearString) => {
		const currentData = gdpData[yearString].map((it) => ({
			value: it.gdp,
			label: it.country,
			valueLabel: `${roundToTwo(it.gdp)} T$`,
			id: it.id,
			barColor: theme.data.tenColors[0].main,
		}));
		const currentValueDomain = extent(currentData.map((it) => it.value)) as [
			number,
			number
		];
		currentValueDomain[0] = 0;

		return {
			index: yearString,
			data: currentData,
			valueDomain: currentValueDomain,
		};
	});

	const dataIds = Object.keys(gdpData).map((it) => `${it}`);

	// const transitionPairs = getPairs(dataIds);

	const keyframes = useBarChartRaceKeyframes({
		fps,
		durationInFrames,
		dataIds,
	});

	return (
		<Page theme={theme} show>
			<div
				style={{
					position: 'absolute',
					top: 520,
				}}
			>
				<KeyFramesInspector
					keyFramesGroup={keyframes}
					width={page.contentWidth}
					baseFontSize={22}
					frame={frame}
					theme={theme}
				/>
			</div>

			<BarChartRace
				theme={theme}
				data={barChartRaceData}
				width={page.contentWidth}
				height={360}
				keyframes={keyframes}
				// CustomLabelComponent={CountryLogosBarChartLabel}
			/>
		</Page>
	);
};

// Function to round numbers to two decimal places
function roundToTwo(num: number): number {
	return Math.round(num * 100) / 100;
}

export function getGdpData(startYear: number, endYear: number) {
	const gdpData: {
		[year: string]: {
			country: string;
			id: string;
			gdp: number;
			averageLifespan: number;
		}[];
	} = {};

	const seed = 999; // Your seed value
	const seededRandom = new SeededRandom(seed);
	const MyRandom = () => seededRandom.randomBetween(0, 100) / 100;

	// Sample data initialization
	const countries = [
		{country: 'United States', id: 'US', gdp: 21.43, averageLifespan: 78.54},
		{country: 'China', id: 'CN', gdp: 14.69, averageLifespan: 76.91},
		{country: 'Japan', id: 'JP', gdp: 5.08, averageLifespan: 84.63},
		{country: 'Germany', id: 'DE', gdp: 3.84, averageLifespan: 81.21},
		{country: 'India', id: 'IN', gdp: 2.87, averageLifespan: 69.66},
		{country: 'United Kingdom', id: 'GB', gdp: 2.83, averageLifespan: 81.26},
		{country: 'France', id: 'FR', gdp: 2.78, averageLifespan: 82.52},
		{country: 'Italy', id: 'IT', gdp: 2.05, averageLifespan: 83.57},
		{country: 'Canada', id: 'CA', gdp: 1.64, averageLifespan: 82.52},
		{country: 'South Korea', id: 'KR', gdp: 1.63, averageLifespan: 83.08},
	];

	// Function to generate realistic data with dynamic ranking
	function generateData(startYear: number, endYear: number) {
		for (let year = startYear; year <= endYear; year++) {
			// Randomly shuffle countries to vary initial order each year
			const shuffledCountries = countries.map((country) => ({...country}));

			gdpData[year.toString()] = shuffledCountries.map((country) => {
				// Simulating GDP growth with a random fluctuation (positive or negative)
				const growthRate = MyRandom() * 0.08 - 0.04; // Between -4% and +4%
				country.gdp *= 1 + growthRate; // Update GDP

				// Simulating average lifespan increase (0.3-0.5 years annually)
				const lifespanIncrease = MyRandom() * 0.2 + 0.3; // Between 0.3 and 0.5 years
				country.averageLifespan += lifespanIncrease; // Update average lifespan

				return {...country}; // Return a new object to avoid mutations
			});

			// Sort countries by GDP for this year to reflect new rankings
			gdpData[year.toString()].sort((a, b) => b.gdp - a.gdp);
		}
	}

	// Generate data from 2000 to 2024
	generateData(startYear, endYear);
	// generateData(1980, 2024);

	// Example of how to access the generated data
	// console.log(gdpData);

	return gdpData;
}
