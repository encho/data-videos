import {AbsoluteFill, useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';

import {PageContext} from '../../../../acetti-components/PageContext';
import {Page, PageHeader, PageFooter} from '../../../../acetti-components/Page';
import {zNerdyFinancePriceChartDataResult} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {zNerdyTickers} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const performanceChartCompositionSchema = z.object({
	ticker: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export const PerformanceChartComposition: React.FC<
	z.infer<typeof performanceChartCompositionSchema>
> = ({ticker, timePeriod, nerdyFinanceEnv, themeEnum, apiPriceData}) => {
	// TODO actually get height and with as props
	// const {height, width} = useVideoConfig();
	const {fps, width, height} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	const theme = useThemeFromEnum(themeEnum as any);

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

	const timeSeries = apiPriceData.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	return (
		<GlobalVideoContextWrapper>
			<PageContext
				width={width}
				height={height}
				margin={60}
				nrBaselines={60}
				theme={theme}
			>
				<Page>
					{({baseline}) => {
						return (
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
										title={'AfD: Vormarsch in Brandenburg'}
										subtitle={'Wahlergebnisse Brandenburg 2024'}
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
									{dimensions ? (
										<Sequence from={Math.floor(fps * 0.75)} layout="none">
											<TimeseriesAnimation
												width={dimensions.width}
												height={dimensions.height}
												timeSeries={timeSeries}
												theme={theme} // TODO evtl pass second theme
											/>
										</Sequence>
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
										<div style={{maxWidth: '62%'}}>
											<TypographyStyle
												typographyStyle={theme.typography.textStyles.dataSource}
												baseline={baseline}
											>
												Data Source: German Bundesbank 2024 Paper on Evolutional
												Finance
											</TypographyStyle>
										</div>
									</div>
								</PageFooter>
							</div>
						);
					}}
				</Page>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};

// {/* <TitleAndSubtitle
// 	title={'XAxisSpecDev TODO here showcase all xaxis specs'}
// 	titleColor={theme.typography.title.color}
// 	titleFontFamily={theme.typography.title.fontFamily}
// 	titleFontSize={60}
// 	subTitle={apiResult.tickerMetadata.name + apiResult.timePeriod}
// 	subTitleColor={theme.typography.subTitle.color}
// 	subTitleFontFamily={theme.typography.subTitle.fontFamily}
// 	subTitleFontSize={40}
// /> */}
