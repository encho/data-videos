import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

import {
	getBarChartBaseline,
	getBarChartHeight,
} from '../../../../acetti-flics/SimpleBarChart/useBarChartLayout';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {SimpleBarChart} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {getTextDimensions} from '../../../../acetti-typography/CapSizeTextNew';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';

export const multipleSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleBarChartComposition: React.FC<
	z.infer<typeof multipleSimpleBarChartCompositionSchema>
> = ({themeEnum}) => {
	const {fps} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);
	const {ref, dimensions} = useElementDimensions();

	const barChartData = wahlergebnis2024.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		// barColor: it.farbe,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	const barChartData2 = wahlergebnis2024_2.map((it) => ({
		id: it.id,
		label: it.parteiName,
		value: it.prozent,
		barColor: it.farbe,
		// barColor: '#fff',
		valueLabel: formatPercentage(it.prozent),
	}));

	// const baseline = 14; // TODO compute, s.t. the barcharts size perfectly

	const referenceUpperBarChartHeight = getBarChartHeight({
		baseline: 10,
		nrRows: barChartData.length,
	});
	const referenceLowerBarChartHeight = getBarChartHeight({
		baseline: 10,
		nrRows: barChartData2.length,
	});

	const relativeLowerBarChartHeight =
		referenceLowerBarChartHeight / referenceUpperBarChartHeight;

	const barChartTitlesTypographyStyle = theme.typography.textStyles.h3;
	const barChartTitlesCapHeightInBaselines =
		barChartTitlesTypographyStyle.capHeightInBaselines;

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 20000, // to better show grid rails!
		height: dimensions ? dimensions.height : 20000,
		nrColumns: 1,
		nrRows: 7,
		rowSizes: [
			{
				type: 'pixel',
				value: barChartTitlesCapHeightInBaselines * theme.page.baseline,
			}, // TODO from theme
			{type: 'pixel', value: 1 * theme.page.baseline}, // TODO from theme
			{type: 'fr', value: 1},
			{type: 'pixel', value: 4 * theme.page.baseline}, // TODO from theme
			{
				type: 'pixel',
				value: barChartTitlesCapHeightInBaselines * theme.page.baseline,
			}, // TODO from theme
			{type: 'pixel', value: 1 * theme.page.baseline}, // TODO from theme
			{type: 'fr', value: relativeLowerBarChartHeight},
		],
		rowSpacePixels: 0,
		columnSpacePixels: 0,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
	});

	const upperBarChartTitleArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const upperBarChartArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 2,
		column: 0,
	});

	const lowerBarChartTitleArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 4,
		column: 0,
	});

	const lowerBarChartArea = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 6,
		column: 0,
	});

	const inferredChartsBaseline = Math.max(
		getBarChartBaseline(upperBarChartArea.height, barChartData),
		getBarChartBaseline(lowerBarChartArea.height, barChartData2)
	);

	const FRAME_TITLE_1 = Math.floor(fps * 0);
	const FRAME_BARCHART_1 = Math.floor(fps * 0.6);
	const FRAME_TITLE_2 = Math.floor(fps * 4.8);
	const FRAME_BARCHART_2 = Math.floor(fps * 5.4);

	const labelWidths = [...barChartData, ...barChartData2].map(
		(it) =>
			getTextDimensions({
				key: 'datavizLabel',
				theme,
				baseline: inferredChartsBaseline,
				text: it.label,
			}).width
	);

	const labelWidth = Math.max(...labelWidths);

	const valueLabelWidths = [...barChartData, ...barChartData2].map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline: inferredChartsBaseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = Math.max(...valueLabelWidths);

	const allValues = [...barChartData, ...barChartData2].map((it) => it.value);
	const sharedValueDomain = [0, Math.max(...allValues)] as [number, number];

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
				<PageHeader
					theme={theme}
					// showArea={showAreas}
				>
					<TitleWithSubtitle
						title={'Multiple Bar Charts'}
						subtitle={'Wahlergebnisse 2024 Brandenburg & Sachsen'}
						theme={theme}
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
					{dimensions &&
					Math.round(matrixLayout.width) === Math.round(dimensions.width) ? (
						<div style={{position: 'relative'}}>
							<DisplayGridRails
								{...matrixLayout}
								// stroke={'#252525'}
								stroke={'transparent'}
							/>

							<HtmlArea area={upperBarChartTitleArea}>
								<Sequence from={FRAME_TITLE_1} layout="none">
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h3}
										baseline={theme.page.baseline}
									>
										<WaterfallTextEffect>Berlin</WaterfallTextEffect>
									</TypographyStyle>
								</Sequence>
							</HtmlArea>

							<HtmlArea area={upperBarChartArea}>
								<Sequence from={FRAME_BARCHART_1} layout="none">
									<SimpleBarChart
										theme={theme}
										data={barChartData}
										width={upperBarChartArea.width}
										height={upperBarChartArea.height}
										// baseline={baseline}
										labelWidth={labelWidth}
										valueLabelWidth={valueLabelWidth}
										valueDomain={sharedValueDomain}
										// showLayout
									/>
								</Sequence>
							</HtmlArea>

							<HtmlArea area={lowerBarChartTitleArea}>
								<Sequence from={FRAME_TITLE_2} layout="none">
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h3}
										baseline={theme.page.baseline}
									>
										<WaterfallTextEffect>Stuttgart</WaterfallTextEffect>
									</TypographyStyle>
								</Sequence>
							</HtmlArea>

							<HtmlArea area={lowerBarChartArea}>
								<Sequence from={FRAME_BARCHART_2} layout="none">
									<SimpleBarChart
										theme={theme}
										data={barChartData2}
										width={lowerBarChartArea.width}
										height={lowerBarChartArea.height}
										labelWidth={labelWidth}
										valueLabelWidth={valueLabelWidth}
										valueDomain={sharedValueDomain}
										// showLayout
									/>
								</Sequence>
							</HtmlArea>
						</div>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter
					theme={theme}
					// showArea={showAreas}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<div
							style={{
								maxWidth: '62%',
								textWrap: 'pretty',
							}}
						>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={theme.page.baseline}
							>
								Data Source: German Bundesbank 2024 Paper on Evolutional
								Finance; Central Bank Database Locator 2023.
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
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 30.9 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 29.2 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'BSW', prozent: 13.5 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
	{parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#222', id: 'CDU'}, // CDU Black
	{parteiName: 'Grüne', prozent: 4.1 / 100, farbe: '#64A12D', id: 'GRU'}, // Grüne Green
	{parteiName: 'Die Linke', prozent: 3.0 / 100, farbe: '#BE3075', id: 'LIN'}, // Die Linke Magenta
	{
		parteiName: 'BVB/Freie Wähler',
		prozent: 2.6 / 100,
		farbe: '#FFD700',
		id: 'BVB',
	}, // BVB Yellow
	{parteiName: 'FDP', prozent: 0.8 / 100, farbe: '#FFED00', id: 'FDP'}, // FDP Yellow
	{parteiName: 'Sonstige', prozent: 4.6 / 100, farbe: '#808080', id: 'SON'}, // Others Gray
];

const wahlergebnis2024_2: {
	parteiName: string;
	prozent: number;
	farbe: string;
	id: string;
}[] = [
	{parteiName: 'SPD', prozent: 50 / 100, farbe: '#E3000F', id: 'SPD'}, // SPD Red
	{parteiName: 'AfD', prozent: 20 / 100, farbe: '#009EE0', id: 'AFD'}, // AfD Blue
	{parteiName: 'CDU', prozent: 20 / 100, farbe: '#222', id: 'CDU'}, // CDU Black
	{parteiName: 'BSW', prozent: 10 / 100, farbe: '#FFA500', id: 'BSW'}, // BSW Orange (aligned with Sahra Wagenknecht's movement)
	// {parteiName: 'CDU', prozent: 12.1 / 100, farbe: '#000000'}, // CDU Black
];
