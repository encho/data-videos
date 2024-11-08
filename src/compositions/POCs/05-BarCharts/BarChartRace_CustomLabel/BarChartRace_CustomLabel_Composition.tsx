import {z} from 'zod';
import {Img, useVideoConfig, Sequence} from 'remotion';
import {extent} from 'd3-array';
import React, {useMemo} from 'react';

import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/NewPage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {TSimpleBarChartData} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {getGdpData} from '../BarChartRace_Simple/BarChartRace_Simple_Composition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {BarChartRace} from '../../../../acetti-flics/SimpleBarChart/BarChartRace';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';

export const barChartRaceCustomLabelCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BarChartRace_CustomLabel_Composition: React.FC<
	z.infer<typeof barChartRaceCustomLabelCompositionSchema>
> = ({themeEnum}) => {
	const {width, height} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);
	return (
		<PageContext margin={50} nrBaselines={50} width={width} height={height}>
			<BarChartRace_CustomLabel_Flic theme={theme} />
		</PageContext>
	);
};

export const BarChartRace_CustomLabel_Flic: React.FC<{theme: ThemeType}> = ({
	theme,
}) => {
	const {fps} = useVideoConfig();

	const {ref, dimensions} = useElementDimensions();

	const page = usePage();

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

	return (
		<Page theme={theme} show>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader
					theme={theme}
					// showArea={showAreas}
				>
					<TitleWithSubtitle
						title={'Bar Chart Race'}
						subtitle={'Based on Mock Chat-GPT generated data'}
						theme={theme}
						innerDelayInSeconds={1}
					/>
				</PageHeader>

				<div
					ref={ref}
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{dimensions ? (
						<Sequence from={Math.floor(fps * 2.75)} layout="none">
							<BarChartRace
								theme={theme}
								data={barChartRaceData}
								width={page.contentWidth}
								height={dimensions.height}
								CustomLabelComponent={CountryLogosBarChartLabel}
							/>
						</Sequence>
					) : null}
				</div>

				<PageFooter
					theme={theme}
					// showArea
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<div style={{maxWidth: '62%'}}>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={page.baseline}
							>
								<TextAnimationSubtle
									translateY={page.baseline * 1.1}
									innerDelayInSeconds={5.25} // TODO time better...
								>
									Data Source: German Bundesbank 2024 Paper on Evolutional
									Finance
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>

			<PageLogo theme={theme} />
		</Page>
	);
};

const CountryLogosBarChartLabel = React.memo(
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
);

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

// Function to round numbers to two decimal places
function roundToTwo(num: number): number {
	return Math.round(num * 100) / 100;
}
