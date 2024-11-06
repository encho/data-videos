import {z} from 'zod';
import {useCurrentFrame, useVideoConfig, Img} from 'remotion';
import {extent} from 'd3-array';
import React, {useCallback, useMemo} from 'react';
import invariant from 'tiny-invariant';

import {Page} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {
	SimpleBarChart,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {SimpleBarChartTransition} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChartTransition';
import {useBarChartRaceKeyframes} from './useBarChartRaceKeyframes';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {KeyFramesSequence} from '../../Keyframes/Keyframes/KeyframesInspector';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {getGdpData} from '../BarChartRace_Simple/BarChartRace_Simple_Composition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {TBarChartLabelComponent} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';

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
	const theme = useThemeFromEnum(themeEnum as any);

	const gdpData = useMemo(() => getGdpData(2000, 2024), []);

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

	const BARCHARTRACE_HEIGHT = 600;

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
		<Page theme={theme} show>
			<BarChartRace
				theme={theme}
				data={barChartRaceData}
				width={theme.page.contentWidth}
				height={BARCHARTRACE_HEIGHT}
				CustomLabelComponent={CustomBarChartLabelComponent}
			/>
		</Page>
	);
};

type TBarChartRaceData = {
	index: string;
	data: TSimpleBarChartData;
	valueDomain: [number, number];
}[];

type TBarChartRaceProps = {
	theme: ThemeType;
	data: TBarChartRaceData;
	width: number;
	height: number;
	CustomLabelComponent?: TBarChartLabelComponent;
};

export const BarChartRace: React.FC<TBarChartRaceProps> = ({
	theme,
	data,
	width,
	height,
	CustomLabelComponent,
}) => {
	const {fps, durationInFrames} = useVideoConfig();

	const dataIds = data.map((it) => it.index);
	const transitionPairs = getPairs(dataIds);

	const keyframes = useBarChartRaceKeyframes({
		fps,
		durationInFrames,
		dataIds,
	});

	const BARCHARTRACE_HEIGHT = height;
	const BARCHARTRACE_WIDTH = width;

	const dataStart = data[0].data;
	const valueDomainStart = data[0].valueDomain;
	invariant(dataStart);
	invariant(valueDomainStart);

	const dataEnd = data[data.length - 1].data;
	const valueDomainEnd = data[data.length - 1].valueDomain;
	invariant(dataEnd);
	invariant(valueDomainEnd);

	return (
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
					CustomLabelComponent={CustomLabelComponent}
				/>
			</KeyFramesSequence>

			{transitionPairs.map(([fromId, toId]) => {
				const startKeyframe = `TRANSITION_START__${fromId}_${toId}`;
				const endKeyframe = `TRANSITION_END__${fromId}_${toId}`;

				const itemFrom = data.find((it) => it.index === fromId);
				const itemTo = data.find((it) => it.index === toId);

				invariant(itemFrom);
				invariant(itemTo);

				const dataFrom = itemFrom.data;
				const valueDomainFrom = itemFrom.valueDomain;

				const dataTo = itemTo.data;
				const valueDomainTo = itemTo.valueDomain;

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
								CustomLabelComponent={CustomLabelComponent}
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
					CustomLabelComponent={CustomLabelComponent}
					// showLayout
					// hideLabels={HIDE_LABELS}
				/>
			</KeyFramesSequence>
		</div>
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
