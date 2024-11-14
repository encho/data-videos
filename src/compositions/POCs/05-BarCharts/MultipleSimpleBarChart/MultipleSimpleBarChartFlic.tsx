import {Sequence, useVideoConfig} from 'remotion';

import {usePage} from '../../../../acetti-components/PageContext';
import {
	getBarChartBaseline,
	getBarChartHeight,
} from '../../../../acetti-flics/SimpleBarChart/useBarChartLayout';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';

import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {
	SimpleBarChart,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {getTextDimensions} from '../../../../acetti-typography/CapSizeTextNew';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const MultipleSimpleBarChartFlic: React.FC<{
	theme: ThemeType;
	upperData: TSimpleBarChartData;
	lowerData: TSimpleBarChartData;
}> = ({theme, upperData, lowerData}) => {
	const {fps} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();
	const page = usePage();

	const referenceUpperBarChartHeight = getBarChartHeight({
		baseline: 10,
		nrRows: upperData.length,
	});

	const referenceLowerBarChartHeight = getBarChartHeight({
		baseline: 10,
		nrRows: lowerData.length,
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
				value: barChartTitlesCapHeightInBaselines * page.baseline,
			}, // TODO from theme
			{type: 'pixel', value: page.baseline}, // TODO from theme
			{type: 'fr', value: 1},
			{type: 'pixel', value: 4 * page.baseline}, // TODO from theme
			{
				type: 'pixel',
				value: barChartTitlesCapHeightInBaselines * page.baseline,
			}, // TODO from theme
			{type: 'pixel', value: page.baseline}, // TODO from theme
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
		getBarChartBaseline(upperBarChartArea.height, upperData),
		getBarChartBaseline(lowerBarChartArea.height, lowerData)
	);

	const FRAME_TITLE_1 = Math.floor(fps * 0);
	const FRAME_BARCHART_1 = Math.floor(fps * 0.6);
	const FRAME_TITLE_2 = Math.floor(fps * 4.8);
	const FRAME_BARCHART_2 = Math.floor(fps * 5.4);

	const labelWidths = [...upperData, ...lowerData].map(
		(it) =>
			getTextDimensions({
				key: 'datavizLabel',
				theme,
				baseline: inferredChartsBaseline,
				text: it.label,
			}).width
	);

	const labelWidth = Math.max(...labelWidths);

	const valueLabelWidths = [...upperData, ...lowerData].map(
		(it) =>
			getTextDimensions({
				key: 'datavizValueLabel',
				theme,
				baseline: inferredChartsBaseline,
				text: it.valueLabel,
			}).width
	);

	const valueLabelWidth = Math.max(...valueLabelWidths);

	const allValues = [...upperData, ...lowerData].map((it) => it.value);
	const sharedValueDomain = [0, Math.max(...allValues)] as [number, number];

	return (
		<Page show>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader>
					<TitleWithSubtitle
						title="Multiple Bar Charts"
						subtitle="Wahlergebnisse 2024 Brandenburg & Sachsen"
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
								stroke="transparent"
							/>

							<HtmlArea area={upperBarChartTitleArea}>
								<Sequence from={FRAME_TITLE_1} layout="none">
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h3}
										baseline={page.baseline}
									>
										<WaterfallTextEffect>Berlin</WaterfallTextEffect>
									</TypographyStyle>
								</Sequence>
							</HtmlArea>

							<HtmlArea area={upperBarChartArea}>
								<Sequence from={FRAME_BARCHART_1} layout="none">
									<SimpleBarChart
										theme={theme}
										data={upperData}
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
										baseline={page.baseline}
									>
										<WaterfallTextEffect>Stuttgart</WaterfallTextEffect>
									</TypographyStyle>
								</Sequence>
							</HtmlArea>

							<HtmlArea area={lowerBarChartArea}>
								<Sequence from={FRAME_BARCHART_2} layout="none">
									<SimpleBarChart
										theme={theme}
										data={lowerData}
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
				<PageFooter>
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
								baseline={page.baseline}
							>
								Data Source: German Bundesbank 2024 Paper on Evolutional
								Finance; Central Bank Database Locator 2023.
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
			<PageLogo />
		</Page>
	);
};
