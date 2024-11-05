import {z} from 'zod';
import {Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';

import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {SimpleBarChartTransition} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChartTransition';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {useBarChartRaceKeyframes} from './useBarChartRaceKeyframes';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {
	getExclusiveSequenceDuration,
	getKeyFrame,
} from '../../Keyframes/Keyframes/keyframes';
import {KeyFramesSequence} from '../../Keyframes/Keyframes/KeyframesInspector';

function getPairs(dataIds: string[]): [string, string][] {
	return dataIds
		.map((id, index) =>
			index < dataIds.length - 1 ? [id, dataIds[index + 1]] : null
		)
		.filter((pair): pair is [string, string] => pair !== null);
}
// Example usage:
// const dataIds = ['2020', '2021', '2022', '2023'];
// const result = getPairs(dataIds);
// console.log(result); // Output: [["2020", "2021"], ["2021", "2022"], ["2022", "2023"]]

// Function to round numbers to two decimal places
function roundToTwo(num: number): number {
	return Math.round(num * 100) / 100;
}

export const simpleBarChartRaceCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChartRaceComposition: React.FC<
	z.infer<typeof simpleBarChartRaceCompositionSchema>
> = ({themeEnum}) => {
	const {fps, durationInFrames, width} = useVideoConfig();
	const frame = useCurrentFrame();
	// const {durationInFrames, }
	const theme = useThemeFromEnum(themeEnum as any);
	// const {ref, dimensions} = useElementDimensions();

	const domain = extent(gdpData[2020].map((it) => it.gdp)) as [number, number];
	domain[0] = 0;

	// ***********************
	// keyframes:
	// ***********************
	// ENTER_BARS_START
	// ENTER_BARS_END
	// TRANSITION_BARS_START_2020_2021
	// TRANSITION_BARS_END_2020_2021
	// TRANSITION_BARS_START_2021_2022
	// TRANSITION_BARS_END_2021_2022
	// ...
	// EXIT_BARS_START
	// EXIT_BARS_END

	// const barChartData_left = gdpData[2020].map((it) => ({
	// 	label: it.country,
	// 	value: it.gdp,
	// 	barColor: theme.data.tenColors[0].main,
	// 	id: it.id,
	// 	valueLabel: `${it.gdp}`,
	// }));

	// const barChartDataSorted_left = barChartData_left;
	// const chartGap = theme.page.baseline * 2;

	// const dataIds = ['2020', '2021', '2022', '2023'];

	const dataIds = Object.keys(gdpData).map((it) => `${it}`);

	const transitionPairs = getPairs(dataIds);

	const keyframes = useBarChartRaceKeyframes({
		fps,
		durationInFrames,
		dataIds,
	});

	const dataStart = gdpData[dataIds[0]].map((it) => ({
		value: it.gdp,
		label: it.country,
		valueLabel: `${roundToTwo(it.gdp)} T$`,
		id: it.id,
		barColor: theme.data.tenColors[0].main,
	}));
	const valueDomainStart = extent(dataStart.map((it) => it.value)) as [
		number,
		number
	];
	valueDomainStart[0] = 0;

	const dataEnd = gdpData[dataIds[dataIds.length - 1]].map((it) => ({
		value: it.gdp,
		label: it.country,
		valueLabel: `${roundToTwo(it.gdp)} T$`,
		id: it.id,
		barColor: theme.data.tenColors[0].main,
	}));
	const valueDomainEnd = extent(dataEnd.map((it) => it.value)) as [
		number,
		number
	];
	valueDomainEnd[0] = 0;

	const BARCHARTRACE_HEIGHT = 340;
	const BARCHARTRACE_WIDTH = theme.page.contentWidth;

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
					width={BARCHARTRACE_WIDTH}
					baseFontSize={22}
					frame={frame}
					theme={theme}
				/>
			</div>
			<div>
				<KeyFramesSequence
					exclusive
					name={`enter-${dataIds[0]}`}
					from={`DATA_ENTER_START__${dataIds[0]}`}
					to={`DATA_ENTER_END__${dataIds[0]}`}
					keyframes={keyframes}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.h1}
						baseline={20}
						marginBottom={3}
					>
						{dataIds[0]}
					</TypographyStyle>

					<SimpleBarChart
						data={dataStart}
						width={BARCHARTRACE_WIDTH}
						height={BARCHARTRACE_HEIGHT}
						theme={theme}
						animateExit={false}
						valueDomain={valueDomainStart}
						// showLayout
						// hideLabels={HIDE_LABELS}
					/>
				</KeyFramesSequence>

				{transitionPairs.map(([fromId, toId]) => {
					const startKeyframe = `TRANSITION_START__${fromId}_${toId}`;
					const endKeyframe = `TRANSITION_END__${fromId}_${toId}`;

					const dataFrom = gdpData[fromId].map((it) => ({
						value: it.gdp,
						label: it.country,
						valueLabel: `${roundToTwo(it.gdp)} T$`,
						id: it.id,
						barColor: theme.data.tenColors[0].main,
					}));

					const dataTo = gdpData[toId].map((it) => ({
						value: it.gdp,
						label: it.country,
						valueLabel: `${roundToTwo(it.gdp)} T$`,
						id: it.id,
						barColor: theme.data.tenColors[0].main,
					}));

					const valueDomainFrom = extent(dataFrom.map((it) => it.value)) as [
						number,
						number
					];
					valueDomainFrom[0] = 0;

					const valueDomainTo = extent(dataTo.map((it) => it.value)) as [
						number,
						number
					];
					valueDomainTo[0] = 0;

					return (
						<div>
							<KeyFramesSequence
								exclusive
								name={`${fromId}-${toId}`}
								from={startKeyframe}
								to={endKeyframe}
								keyframes={keyframes}
							>
								<TypographyStyle
									typographyStyle={theme.typography.textStyles.h1}
									baseline={20}
									marginBottom={3}
								>
									{toId}
								</TypographyStyle>

								{/* TODO here we need the  */}
								<SimpleBarChartTransition
									height={BARCHARTRACE_HEIGHT}
									dataFrom={dataFrom}
									valueDomainFrom={valueDomainFrom}
									dataTo={dataTo}
									valueDomainTo={valueDomainTo}
									width={BARCHARTRACE_WIDTH}
									theme={theme}
								/>
							</KeyFramesSequence>
						</div>
					);
				})}

				<KeyFramesSequence
					exclusive
					name={`enter-${dataIds[dataIds.length - 1]}`}
					from={`DATA_EXIT_START__${dataIds[dataIds.length - 1]}`}
					to={`DATA_EXIT_END__${dataIds[dataIds.length - 1]}`}
					keyframes={keyframes}
				>
					<TypographyStyle
						typographyStyle={theme.typography.textStyles.h1}
						baseline={20}
						marginBottom={3}
					>
						{dataIds[dataIds.length - 1]}
					</TypographyStyle>

					<SimpleBarChart
						data={dataEnd}
						width={BARCHARTRACE_WIDTH}
						height={BARCHARTRACE_HEIGHT}
						theme={theme}
						animateEnter={false}
						valueDomain={valueDomainEnd}
						// showLayout
						// hideLabels={HIDE_LABELS}
					/>
				</KeyFramesSequence>
			</div>

			{/* <div style={{position: 'relative'}}>
				<SimpleBarChartRace theme={theme} />
			</div> */}
		</Page>
	);
};

const gdpData: {
	[year: string]: {
		country: string;
		id: string;
		gdp: number;
		averageLifespan: number;
	}[];
} = {};

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
			const growthRate = Math.random() * 0.08 - 0.04; // Between -4% and +4%
			country.gdp *= 1 + growthRate; // Update GDP

			// Simulating average lifespan increase (0.3-0.5 years annually)
			const lifespanIncrease = Math.random() * 0.2 + 0.3; // Between 0.3 and 0.5 years
			country.averageLifespan += lifespanIncrease; // Update average lifespan

			return {...country}; // Return a new object to avoid mutations
		});

		// Sort countries by GDP for this year to reflect new rankings
		gdpData[year.toString()].sort((a, b) => b.gdp - a.gdp);
	}
}

// Generate data from 2000 to 2024
generateData(2020, 2024);
// generateData(1980, 2024);
// generateData(1980, 2024);

// Example of how to access the generated data
console.log(gdpData);
