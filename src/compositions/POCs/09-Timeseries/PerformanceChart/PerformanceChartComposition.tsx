import {AbsoluteFill, useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';
import {format} from 'date-fns';
import {enGB} from 'date-fns/locale';

import {PageContext} from '../../../../acetti-components/PageContext';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';
import {
	zNerdyFinancePriceChartDataResult,
	TNerdyFinancePriceChartDataResult,
} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

const formatDateCustom = (date: Date): string => {
	// return format(date, 'd. MMM. yyyy'); // Formats to '1. Jan. 2024'
	return format(date, 'P', {locale: enGB}); // Formats to '1. Jan. 2024'
};

export const performanceChartCompositionSchema = z.object({
	ticker: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export const PerformanceChartComposition: React.FC<
	z.infer<typeof performanceChartCompositionSchema>
> = ({
	// ticker,
	// timePeriod,
	// nerdyFinanceEnv,
	theme: themeEnum,
	chartTheme: chartThemeEnum,
	apiPriceData,
}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	// TODO actually get height and with as props
	// const {height, width} = useVideoConfig();
	const {fps, width, height} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	const chartTheme = useThemeFromEnum(chartThemeEnum as any);

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

	const timeSeries = apiPriceData.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	console.log({apiPriceData});

	const getSubtitle = (
		nerdyPriceApiResult: TNerdyFinancePriceChartDataResult
	) => {
		const startDate = nerdyPriceApiResult.data[0].index;
		const endDate =
			nerdyPriceApiResult.data[nerdyPriceApiResult.data.length - 1].index;
		const periodString = `(${formatDateCustom(startDate)}-${formatDateCustom(
			endDate
		)})`;

		if (nerdyPriceApiResult.timePeriod === '2Y') {
			return `2-Year Performance ${periodString}`;
		}

		return 'Implement subtitle for this timePeriod!!!';
	};

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
							<>
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
											title={apiPriceData.tickerMetadata.name}
											subtitle={getSubtitle(apiPriceData)}
											theme={theme}
											innerDelayInSeconds={0.5}
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
											<Sequence from={Math.floor(fps * 1.75)} layout="none">
												<TimeseriesAnimation
													width={dimensions.width}
													height={dimensions.height}
													timeSeries={timeSeries}
													theme={chartTheme}
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
													typographyStyle={
														theme.typography.textStyles.dataSource
													}
													baseline={baseline}
												>
													<TextAnimationSubtle
														translateY={baseline * 0.5}
														innerDelayInSeconds={2.5}
													>
														Data Source: Yahoo Finance API
													</TextAnimationSubtle>
												</TypographyStyle>
											</div>
										</div>
									</PageFooter>
								</div>
								<PageLogo theme={theme} />
							</>
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
