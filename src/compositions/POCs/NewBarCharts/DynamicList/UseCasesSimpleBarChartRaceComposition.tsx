import {z} from 'zod';
import React, {useMemo} from 'react';
import {useVideoConfig, Sequence} from 'remotion';
import chroma from 'chroma-js';

import {SimpleBarChartRace} from './components/SimpleBarChartRace';
import {SeededRandom} from '../../../../acetti-utils/seededRandom';
// import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../../../../acetti-components/Page';
import {PageContext} from '../../../../acetti-components/PageContext';
// import {SimpleBarChart} from './components/SimpleBarChart';
import {getImageLabelComponent} from './packages/BarChartAnimation/BarsTransition/getImageLabelComponent';
// import {getImageValueLabelComponent} from './packages/BarChartAnimation/BarsTransition/getImageValueLabelComponent';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

const imageMappings: {[id: string]: string} = {
	US: getCountryImageURL('US'),
	CN: getCountryImageURL('CN'),
	JP: getCountryImageURL('JP'),
	DE: getCountryImageURL('DE'),
	IN: getCountryImageURL('IN'),
	GB: getCountryImageURL('GB'),
	FR: getCountryImageURL('FR'),
	IT: getCountryImageURL('IT'),
	CA: getCountryImageURL('CA'),
	KR: getCountryImageURL('KR'),
};

const ImageLabelComponent = getImageLabelComponent({
	imageMappings,
});

// const ImageValueLabelComponent = getImageValueLabelComponent({
// 	imageMappings,
// 	// numberFormatter: (x: number) => `${x}--->`,
// 	numberFormatter: formatPercentage,
// });

// TODO pass in from outside
// function formatPercentage(value: number): string {
// 	const sign = value > 0 ? '+' : '';
// 	return `${sign}${(value * 100).toFixed(1)}%`;
// }
// // // Example usage
// // console.log(formatPercentage(40.4)); // Output: "+40.40%"
// // console.log(formatPercentage(-15.678)); // Output: "-15.68%"
// // console.log(formatPercentage(0)); // Output: "0.00%"

// function formatPercentage_0(value: number): string {
// 	// Add a + sign for positive values, keep the sign for negative values
// 	const sign = value > 0 ? '+' : '';
// 	// Format the number with two decimal places and append %
// 	// return `${sign}${(value * 100).toFixed(2)}%`;
// 	return `${sign}${(value * 100).toFixed(0)}%`;
// }
// // // Example usage
// // console.log(formatPercentage(40.4)); // Output: "+40.40%"
// // console.log(formatPercentage(-15.678)); // Output: "-15.68%"
// // console.log(formatPercentage(0)); // Output: "0.00%"

export const useCasesSimpleBarChartRaceCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const UseCasesSimpleBarChartRaceComposition: React.FC<
	z.infer<typeof useCasesSimpleBarChartRaceCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height, durationInFrames} = useVideoConfig();

	const durationInFrames_1 = durationInFrames;

	const gdpDataArray = useMemo(() => getGdpData(1990, 2024), []);

	const barChartRaceData = useMemo(
		() =>
			gdpDataArray.map((it) => {
				return {
					periodLabel: it.year,
					data: it.data.map((dataItem) => {
						return {
							id: dataItem.id,
							label: dataItem.country,
							value: dataItem.gdp,
							// color: '#f05122',
							// color: 'rgba(255,255,255,0.6)',
							// TODO from theme
							color: chroma(theme.data.grays['200']).alpha(0.2).css(), // 50% opacitytheme.data.grays[300],
						};
					}),
				};
			}),
		[gdpDataArray, theme]
	);

	// TODO work with this data to create SimpleBarChartRace component
	// console.log({gdpDataArray});

	return (
		<div style={{position: 'relative'}}>
			<PageContext
				margin={80}
				nrBaselines={50}
				width={width}
				height={height}
				theme={theme}
			>
				<Page>
					{({baseline, contentWidth}) => {
						return (
							<>
								<Sequence durationInFrames={durationInFrames_1} layout="none">
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={3}
									>
										Bar Chart Race
									</TypographyStyle>
									<SimpleBarChartRace
										// showLayout
										hideAxis
										barChartRaceData={barChartRaceData}
										height={800}
										width={contentWidth}
										theme={theme}
										//
										LabelComponent={ImageLabelComponent}
										valueLabelFormatter={formatTrillionUSD}
									/>
								</Sequence>
								{/* <Sequence
									from={durationInFrames_1}
									durationInFrames={durationInFrames_2}
									layout="none"
								>
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Bar Chart with Custom Value Label
									</TypographyStyle>
									<SimpleBarChart
										showLayout
										hideLabel
										ValueLabelComponent={ImageValueLabelComponent}
										height={700}
										width={contentWidth}
										theme={theme}
										dataItems={dataChange}
										tickLabelFormatter={formatPercentage_0}
									/>
								</Sequence> */}
							</>
						);
					}}
				</Page>
			</PageContext>
		</div>
	);
};

/**
 * Formats a number to two decimal places and appends "T USD" (abbreviation for Trillion USD).
 * @param num - The number to format.
 * @returns A string in the format "X.XX T USD".
 */
function formatTrillionUSD(num: number): string {
	return `$${'\u2009'}${num.toFixed(2)} T`;
}
// Example usage:
// console.log(formatTrillionUSD(5.2)); // Output: "5.20 T USD"
// console.log(formatTrillionUSD(3));   // Output: "3.00 T USD"

export function getGdpData(startYear: number, endYear: number) {
	const gdpData: {
		[year: string]: {
			country: string;
			id: string;
			gdp: number;
			averageLifespan: number;
		}[];
	} = {};

	const gdpDataArray: {
		year: string;
		data: {
			country: string;
			id: string;
			gdp: number;
			averageLifespan: number;
		}[];
	}[] = [];

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

			gdpDataArray.push({
				year: year.toString(),
				data: gdpData[year.toString()],
			});
		}
	}

	// Generate data from 2000 to 2024
	generateData(startYear, endYear);
	// generateData(1980, 2024);

	// Example of how to access the generated data
	// console.log(gdpData);

	// return gdpData;
	return gdpDataArray;
}

function getCountryImageURL(countryId: string): string {
	const germany =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/germany-flag-circular-1024.png';
	const italy =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/italy-flag-circular-1024.png';
	const uk =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/uk-flag-circular-1024.png';

	const china =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/china-flag-circular-1024.png';
	const usa =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/usa-flag-circular-1024.png';

	const india =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/india-flag-circular-1024.png';
	const france =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/france-flag-circular-1024.png';
	const canada =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/canada-flag-circular-1024.png';
	const japan =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/japan-flag-circular-1024.png';

	const southKorea =
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/countryIcons/south-korea-flag-circular-1024.png';

	if (countryId === 'US') return usa;
	if (countryId === 'CN') return china;
	if (countryId === 'JP') return japan;
	if (countryId === 'DE') return germany;
	if (countryId === 'IN') return india;
	if (countryId === 'GB') return uk;
	if (countryId === 'FR') return france;
	if (countryId === 'IT') return italy;
	if (countryId === 'CA') return canada;
	if (countryId === 'KR') return southKorea;

	throw Error('no matching image found');
}
