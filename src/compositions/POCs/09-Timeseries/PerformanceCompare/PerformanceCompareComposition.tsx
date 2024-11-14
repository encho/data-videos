import {AbsoluteFill, useVideoConfig} from 'remotion';
import {z} from 'zod';

import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {zNerdyFinancePriceChartDataResult} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {zNerdyTickers} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';

export const performanceCompareCompositionSchema = z.object({
	ticker: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export const PerformanceCompareComposition: React.FC<
	z.infer<typeof performanceCompareCompositionSchema>
> = ({ticker, timePeriod, nerdyFinanceEnv, themeEnum, apiPriceData}) => {
	// TODO actually get height and with as props
	const {height, width} = useVideoConfig();

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
				margin={80}
				nrBaselines={40}
				theme={theme}
			>
				<Page show>
					{({contentWidth, contentHeight}) => {
						return (
							<TimeseriesAnimation
								width={contentWidth}
								height={contentHeight}
								timeSeries={timeSeries}
								theme={theme}
							/>
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
