import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';

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

export const simpleBarChartRaceCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChartRaceComposition: React.FC<
	z.infer<typeof simpleBarChartRaceCompositionSchema>
> = ({themeEnum}) => {
	const {fps} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();

	const LEFT_CHART_WIDTH_PERCENTAGE = 1;

	const domain = extent(gdpData[2020].map((it) => it.gdp)) as [number, number];
	domain[0] = 0;

	const barChartData_left = gdpData[2020].map((it) => ({
		label: it.country,
		value: it.gdp,
		barColor: theme.data.tenColors[0].main,
		id: it.id,
		valueLabel: `${it.gdp}`,
	}));

	const barChartDataSorted_left = barChartData_left;

	const chartGap = theme.page.baseline * 2;

	return (
		<Page theme={theme}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader theme={theme}>
					<TitleWithSubtitle
						title={'Simple Bar Chart Race'}
						subtitle={'Good for sorting data, for Example:'}
						theme={theme}
						innerDelayInSeconds={1}
					/>
				</PageHeader>

				<div
					ref={ref}
					style={{
						flex: 1,
						// display: 'flex',
						// justifyContent: 'center',
					}}
				>
					{dimensions ? (
						// TODO start after title and subtitle are in (using their keyframes...)
						<Sequence from={Math.floor(fps * 2.75)} layout="none">
							<div
								style={
									{
										// display: 'flex', gap: 50
									}
								}
							>
								<Sequence from={0} durationInFrames={fps * 7} layout="none">
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'flex-start',
											// gap: chartGap,
											// backgroundColor: 'cyan',
										}}
									>
										<SimpleBarChart
											data={barChartData_left}
											width={dimensions.width}
											height={dimensions.height}
											theme={theme}
											animateExit={false}
											valueDomain={domain}
											// showLayout
											// hideLabels={HIDE_LABELS}
										/>
									</div>
								</Sequence>
								<Sequence
									from={fps * 7}
									durationInFrames={fps * 0.5}
									layout="none"
								>
									<div style={{display: 'flex', gap: chartGap}}>
										<SimpleBarChartTransition
											height={dimensions.height}
											dataFrom={barChartData_left}
											dataTo={barChartDataSorted_left}
											width={dimensions.width}
											theme={theme}
											valueDomain={domain}
										/>
									</div>
								</Sequence>
								<Sequence from={fps * 7.5} layout="none">
									<div style={{display: 'flex', gap: chartGap}}>
										<SimpleBarChart
											data={barChartDataSorted_left}
											width={dimensions.width}
											height={dimensions.height}
											theme={theme}
											animateEnter={false}
											valueDomain={domain}
										/>
									</div>
								</Sequence>
							</div>
						</Sequence>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter theme={theme}>
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
								baseline={theme.page.baseline}
							>
								<TextAnimationSubtle
									translateY={theme.page.baseline * 1.1}
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

const gdpData = {
	2020: [
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
	],
	2021: [
		{country: 'United States', id: 'US', gdp: 22.67, averageLifespan: 78.54},
		{country: 'China', id: 'CN', gdp: 17.73, averageLifespan: 77.93},
		{country: 'Japan', id: 'JP', gdp: 4.93, averageLifespan: 84.64},
		{country: 'Germany', id: 'DE', gdp: 4.26, averageLifespan: 81.23},
		{country: 'India', id: 'IN', gdp: 3.05, averageLifespan: 69.88},
		{country: 'United Kingdom', id: 'GB', gdp: 3.13, averageLifespan: 81.3},
		{country: 'France', id: 'FR', gdp: 2.94, averageLifespan: 82.52},
		{country: 'Italy', id: 'IT', gdp: 2.12, averageLifespan: 83.57},
		{country: 'Canada', id: 'CA', gdp: 1.84, averageLifespan: 82.52},
		{country: 'South Korea', id: 'KR', gdp: 1.8, averageLifespan: 83.12},
	],
	2022: [
		{country: 'United States', id: 'US', gdp: 23.0, averageLifespan: 78.54},
		{country: 'China', id: 'CN', gdp: 18.0, averageLifespan: 78.34},
		{country: 'Japan', id: 'JP', gdp: 5.0, averageLifespan: 84.66},
		{country: 'Germany', id: 'DE', gdp: 4.5, averageLifespan: 81.25},
		{country: 'India', id: 'IN', gdp: 3.2, averageLifespan: 70.1},
		{country: 'United Kingdom', id: 'GB', gdp: 3.3, averageLifespan: 81.32},
		{country: 'France', id: 'FR', gdp: 3.0, averageLifespan: 82.52},
		{country: 'Italy', id: 'IT', gdp: 2.2, averageLifespan: 83.56},
		{country: 'Canada', id: 'CA', gdp: 1.9, averageLifespan: 82.52},
		{country: 'South Korea', id: 'KR', gdp: 1.85, averageLifespan: 83.14},
	],
	2023: [
		{country: 'United States', id: 'US', gdp: 23.5, averageLifespan: 78.54},
		{country: 'China', id: 'CN', gdp: 18.5, averageLifespan: 78.63},
		{country: 'Japan', id: 'JP', gdp: 5.1, averageLifespan: 84.67},
		{country: 'Germany', id: 'DE', gdp: 4.6, averageLifespan: 81.27},
		{country: 'India', id: 'IN', gdp: 3.3, averageLifespan: 70.2},
		{country: 'United Kingdom', id: 'GB', gdp: 3.4, averageLifespan: 81.35},
		{country: 'France', id: 'FR', gdp: 3.1, averageLifespan: 82.53},
		{country: 'Italy', id: 'IT', gdp: 2.3, averageLifespan: 83.58},
		{country: 'Canada', id: 'CA', gdp: 2.0, averageLifespan: 82.52},
		{country: 'South Korea', id: 'KR', gdp: 1.9, averageLifespan: 83.15},
	],
	2024: [
		{country: 'United States', id: 'US', gdp: 24.0, averageLifespan: 78.54},
		{country: 'China', id: 'CN', gdp: 19.0, averageLifespan: 78.83},
		{country: 'Japan', id: 'JP', gdp: 5.2, averageLifespan: 84.68},
		{country: 'Germany', id: 'DE', gdp: 4.7, averageLifespan: 81.29},
		{country: 'India', id: 'IN', gdp: 3.5, averageLifespan: 70.3},
		{country: 'United Kingdom', id: 'GB', gdp: 3.5, averageLifespan: 81.36},
		{country: 'France', id: 'FR', gdp: 3.2, averageLifespan: 82.54},
		{country: 'Italy', id: 'IT', gdp: 2.4, averageLifespan: 83.59},
		{country: 'Canada', id: 'CA', gdp: 2.1, averageLifespan: 82.52},
		{country: 'South Korea', id: 'KR', gdp: 2.0, averageLifespan: 83.16},
	],
};
