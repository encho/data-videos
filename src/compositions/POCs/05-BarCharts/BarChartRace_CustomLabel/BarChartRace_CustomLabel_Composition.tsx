import {z} from 'zod';
import {useCurrentFrame, useVideoConfig, Img} from 'remotion';
import {extent} from 'd3-array';
import invariant from 'tiny-invariant';
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

	const gdpData = useMemo(() => getGdpData(2020, 2024), []);

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

	const BARCHARTRACE_HEIGHT = 340;
	const BARCHARTRACE_WIDTH = theme.page.contentWidth;

	const CustomBarChartLabelComponent = useCallback(
		React.memo(
			({
				children,
				id,
			}: {
				children: string;
				id: string;
				// baseline: number;  // TODO inject chart baseline
				// dataItem: TODO inject chart Dataitem
				// index: TODO inject dataItem index
			}) => {
				const countryGDP = gdpData[2020].find((it) => it.id === id)?.gdp;
				invariant(countryGDP);

				const imageSrc = getCountryImageURL(id);

				const BASELINE = 15;

				return (
					<div
						style={{
							display: 'flex',
							gap: BASELINE * 0.6,
							alignItems: 'center',
						}}
					>
						<TypographyStyle
							typographyStyle={theme.typography.textStyles.datavizLabel}
							baseline={BASELINE}
						>
							{id}
							{/* <TextAnimationSubtle
								innerDelayInSeconds={0}
								translateY={BASELINE * 1.15}
							>
								{id}
							</TextAnimationSubtle> */}
						</TypographyStyle>

						{/* <TextAnimationSubtle
							innerDelayInSeconds={0}
							translateY={BASELINE * 1.15}
						>
							<Img
								style={{
									borderRadius: '50%',
									width: BASELINE * 2,
									height: BASELINE * 2,
								}}
								src={imageSrc}
							/>
						</TextAnimationSubtle> */}
						<Img
							style={{
								borderRadius: '50%',
								width: BASELINE * 2,
								height: BASELINE * 2,
							}}
							src={imageSrc}
						/>
					</div>
				);
			}
		),
		[]
	);

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
						CustomLabelComponent={CustomBarChartLabelComponent}
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
						// CustomLabelComponent={CustomBarChartLabelComponent}
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

	if (countryId === 'US') return germany;
	if (countryId === 'CN') return italy;
	if (countryId === 'JP') return germany;
	if (countryId === 'DE') return italy;
	if (countryId === 'IN') return germany;
	if (countryId === 'GB') return italy;
	if (countryId === 'FR') return germany;
	if (countryId === 'IT') return italy;
	if (countryId === 'CA') return germany;
	if (countryId === 'KR') return italy;

	throw Error('no matching image found');
}
