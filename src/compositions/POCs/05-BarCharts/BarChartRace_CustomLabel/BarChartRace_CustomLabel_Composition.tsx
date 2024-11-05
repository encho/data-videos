import {z} from 'zod';
import {useCurrentFrame, useVideoConfig, Img} from 'remotion';
import {extent} from 'd3-array';
import React, {useCallback, useMemo} from 'react';

import {Page} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {SimpleBarChartTransition} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChartTransition';
import {useBarChartRaceKeyframes} from './useBarChartRaceKeyframes';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {KeyFramesSequence} from '../../Keyframes/Keyframes/KeyframesInspector';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {getGdpData} from '../BarChartRace_Simple/BarChartRace_Simple_Composition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

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

export const barChartRaceCustomLabelCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartRace_CustomLabel_Composition: React.FC<
	z.infer<typeof barChartRaceCustomLabelCompositionSchema>
> = ({themeEnum}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();
	// const {durationInFrames, }
	const theme = useThemeFromEnum(themeEnum as any);
	// const {ref, dimensions} = useElementDimensions();

	const gdpData = useMemo(() => getGdpData(2000, 2024), []);

	const domain = extent(gdpData[2020].map((it) => it.gdp)) as [number, number];
	domain[0] = 0;

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

	const BARCHARTRACE_HEIGHT = 600;
	const BARCHARTRACE_WIDTH = theme.page.contentWidth;

	const CustomBarChartLabelComponent = useCallback(
		React.memo(
			({
				children,
				id,
				animateEnter,
				animateExit,
				baseline,
				theme,
			}: {
				children: string;
				id: string;
				animateEnter: boolean;
				animateExit: boolean;
				baseline: number;
				theme: ThemeType;
				// dataItem: TODO inject chart Dataitem
				// index: TODO inject dataItem index
			}) => {
				const imageSrc = getCountryImageURL(id);

				return (
					<div
						style={{
							display: 'flex',
							gap: baseline * 0.6,
							alignItems: 'center',
						}}
					>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.datavizLabel}
							baseline={baseline}
						>
							<TextAnimationSubtle
								innerDelayInSeconds={0}
								translateY={baseline * 1.15}
								animateEnter={animateEnter}
								animateExit={animateExit}
							>
								{children}
							</TextAnimationSubtle>
						</TypographyStyle>

						<TextAnimationSubtle
							innerDelayInSeconds={0}
							translateY={baseline * 1.15}
							animateEnter={animateEnter}
							animateExit={animateExit}
						>
							<Img
								style={{
									borderRadius: '50%',
									width: baseline * 2,
									height: baseline * 2,
								}}
								src={imageSrc}
							/>
						</TextAnimationSubtle>
					</div>
				);
			}
		),
		[]
	);

	return (
		<Page
			theme={theme}
			// show
		>
			{/* <div
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
			</div> */}
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
						CustomLabelComponent={CustomBarChartLabelComponent}
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
									CustomLabelComponent={CustomBarChartLabelComponent}
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
						CustomLabelComponent={CustomBarChartLabelComponent}
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
