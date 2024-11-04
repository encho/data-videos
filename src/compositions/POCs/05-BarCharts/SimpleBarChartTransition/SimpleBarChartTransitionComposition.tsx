import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

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

export const simpleBarChartTransitionCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleBarChartTransitionComposition: React.FC<
	z.infer<typeof simpleBarChartTransitionCompositionSchema>
> = ({themeEnum}) => {
	const {fps} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();

	const LEFT_CHART_WIDTH_PERCENTAGE = 0.7;
	const RIGHT_CHART_WIDTH_PERCENTAGE = 0.3;
	const HIDE_LABELS = true;

	const wahlergebnisWinnerSort = [...wahlergebnis2024].sort(
		(a, b) => b.prozent - a.prozent
	);
	const wahlergebnisChangeSort = [...wahlergebnis2024].sort(
		(a, b) => b.change - a.change
	);

	const barChartData_left = wahlergebnisWinnerSort.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		// barColor: it.farbe,
		barColor: theme.data.tenColors[0].main,
		id: it.id,
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartData_right = wahlergebnisWinnerSort.map((it) => ({
		label: it.parteiName,
		value: it.change,
		// barColor: it.farbe,
		barColor:
			it.change >= 0
				? theme.positiveNegativeColors.positiveColor
				: theme.positiveNegativeColors.negativeColor,
		id: it.id,
		valueLabel: formatPercentage(it.change),
	}));

	const barChartDataSorted_left = wahlergebnisChangeSort.map((it) => ({
		label: it.parteiName,
		value: it.prozent,
		// barColor: it.farbe,
		barColor: theme.data.tenColors[0].main,
		id: it.id,
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartDataSorted_right = wahlergebnisChangeSort.map((it) => ({
		label: it.parteiName,
		value: it.change,
		// barColor: it.farbe,
		barColor:
			it.change >= 0
				? theme.positiveNegativeColors.positiveColor
				: theme.positiveNegativeColors.negativeColor,
		id: it.id,
		valueLabel: formatPercentage(it.change),
	}));

	const chartGap = theme.page.baseline * 8;

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
						title={'Transitioning a Bar Chart'}
						subtitle={'Good for sorting data, for Example:'}
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
						// TODO start after title and subtitle are in (using their keyframes...)
						<Sequence from={Math.floor(fps * 2.75)} layout="none">
							<div style={{display: 'flex', gap: 50}}>
								<Sequence from={0} durationInFrames={fps * 5} layout="none">
									<div style={{display: 'flex', gap: chartGap}}>
										<SimpleBarChart
											data={barChartData_left}
											width={
												(dimensions.width - chartGap) *
												LEFT_CHART_WIDTH_PERCENTAGE
											}
											height={dimensions.height}
											theme={theme}
											animateExit={false}
											valueDomain={[0, 0.31]}
											// hideLabels={HIDE_LABELS}
										/>
										<SimpleBarChart
											data={barChartData_right}
											width={
												(dimensions.width - chartGap) *
												RIGHT_CHART_WIDTH_PERCENTAGE
											}
											height={dimensions.height}
											theme={theme}
											animateExit={false}
											valueDomain={[0, 0.31]}
											hideLabels={HIDE_LABELS}
										/>
									</div>
								</Sequence>
								<Sequence
									from={fps * 5}
									durationInFrames={fps * 0.5}
									layout="none"
								>
									<div style={{display: 'flex', gap: chartGap}}>
										<SimpleBarChartTransition
											height={dimensions.height}
											dataFrom={barChartData_left}
											dataTo={barChartDataSorted_left}
											width={
												(dimensions.width - chartGap) *
												LEFT_CHART_WIDTH_PERCENTAGE
											}
											theme={theme}
											valueDomain={[0, 0.31]}
										/>
										<SimpleBarChartTransition
											height={dimensions.height}
											dataFrom={barChartData_right}
											dataTo={barChartDataSorted_right}
											width={
												(dimensions.width - chartGap) *
												RIGHT_CHART_WIDTH_PERCENTAGE
											}
											theme={theme}
											valueDomain={[0, 0.31]}
											hideLabels={HIDE_LABELS}
										/>
									</div>
								</Sequence>
								<Sequence from={fps * 5.5} layout="none">
									<div style={{display: 'flex', gap: chartGap}}>
										<SimpleBarChart
											data={barChartDataSorted_left}
											width={
												(dimensions.width - chartGap) *
												LEFT_CHART_WIDTH_PERCENTAGE
											}
											height={dimensions.height}
											theme={theme}
											animateEnter={false}
											valueDomain={[0, 0.31]}
										/>
										<SimpleBarChart
											data={barChartDataSorted_right}
											width={
												(dimensions.width - chartGap) *
												RIGHT_CHART_WIDTH_PERCENTAGE
											}
											height={dimensions.height}
											theme={theme}
											animateEnter={false}
											valueDomain={[0, 0.31]}
											hideLabels={HIDE_LABELS}
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
	change: number;
	farbe: string;
	id: string;
}[] = [
	{
		parteiName: 'SPD',
		prozent: 30.9 / 100,
		change: -0.5,
		farbe: '#E3000F',
		id: 'SPD',
	}, // SPD Red
	{
		parteiName: 'AfD',
		prozent: 29.2 / 100,
		change: -0.3,
		farbe: '#009EE0',
		id: 'AFD',
	}, // AfD Blue
	{
		parteiName: 'BSW',
		prozent: 13.5 / 100,
		change: 0.2,
		farbe: '#FFA500',
		id: 'BSW',
	}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{
		parteiName: 'CDU',
		prozent: 12.1 / 100,
		change: 0.5,
		farbe: '#fff',
		id: 'CDU',
	}, // CDU Black
	{
		parteiName: 'Grüne',
		prozent: 4.1 / 100,
		change: 0.2,
		farbe: '#64A12D',
		id: 'GRU',
	}, // Grüne Green
	{
		parteiName: 'Die Linke',
		prozent: 3.0 / 100,
		change: -0.4,
		farbe: '#BE3075',
		id: 'LIN',
	}, // Die Linke Magenta
	{
		parteiName: 'BVB/Freie Wähler',
		prozent: 2.6 / 100,
		change: 0.3,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{
		parteiName: 'FDP',
		prozent: 0.8 / 100,
		change: 0.1,
		farbe: '#FFED00',
		id: 'FDP',
	}, // FDP Yellow
	{
		parteiName: 'Sonstige',
		prozent: 4.6 / 100,
		change: 0.12,
		farbe: '#808080',
		id: 'SON',
	}, // Others Gray
];
